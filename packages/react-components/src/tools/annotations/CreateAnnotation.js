import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Classification, Tooltip } from '../../components';
import axios from '../../dataManagement/api/axios';
import { Suggest } from '../../widgets/Filter/utils';

const suggestStyle = { whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' };

const BACKBONE_KEY = 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c';

const suggestConfig = {
  //What placeholder to show
  // placeholder: 'Search by scientific name',
  placeholder: 'search.placeholders.default',
  // how to get the list of suggestion data
  getSuggestions: ({ q }) => axios.get(`http://api.gbif.org/v1/species/suggest?datasetKey=${BACKBONE_KEY}&limit=20&q=${q}`),
  // how to map the results to a single string value
  getValue: suggestion => suggestion.scientificName,
  // how to display the individual suggestions in the list
  render: function ScientificNameSuggestItem(suggestion) {
    const ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].map((rank, i) => {
      return suggestion[rank] && rank !== suggestion.rank.toLowerCase() ? <span key={rank}>{suggestion[rank]}</span> : null;
    });

    return <div style={{ maxWidth: '100%' }}>
      <div style={suggestStyle}>
        {suggestion.status !== 'ACCEPTED' && <Tooltip title={<span><FormattedMessage id={`enums.taxonomicStatus.${suggestion.status}`} /></span>}>
          <span style={{ display: 'inline-block', marginRight: 8, width: 8, height: 8, borderRadius: 4, background: 'orange' }}></span>
        </Tooltip>}
        {suggestion.scientificName}
      </div>
      <div style={{ color: '#aaa', fontSize: '0.85em' }}>
        <Classification>
          {ranks}
        </Classification>
      </div>
    </div>
  }
};

function AnnotationForm({token, ...props}) {
  const [contextType, setContextType] = useState('TAXON');
  const [contextKey, setContextKey] = useState('');
  const [geometry, setGeometry] = useState('');
  const [errorType, setErrorType] = useState('IDENTIFICATION');
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const annotationRule = {
        contextType,
        contextKey,
        geometry,
        errorType,
      };
      const res = await (axios.post(
        'http://labs.gbif.org:7013/v1/occurrence/annotation/rule',
        annotationRule,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )).promise;
      const commentData = { comment };
      debugger;
      const commentRes = await (axios.post(
        `http://labs.gbif.org:7013/v1/occurrence/annotation/rule/${res.data.id}/comment`,
        commentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )).promise;
      alert('Annotation created successfully');
    } catch (err) {
      console.error(err);
      alert('Error creating annotation');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="contextType">Context Type:</label>
        <select
          id="contextType"
          value={contextType}
          onChange={(e) => setContextType(e.target.value)}
        >
          <option value="TAXON">Taxon</option>
          <option value="LOCATION">Location</option>
        </select>
      </div>
      <div>
        <label htmlFor="contextKey">Context Key:</label>
        <input
          type="text"
          id="contextKey"
          value={contextKey}
          onChange={(e) => setContextKey(e.target.value)}
        />
        <Suggest
          {...suggestConfig}
          // allowEmptyQueries={config?.specific?.allowEmptyQueries}
          // focusRef={focusRef}
          onKeyPress={e => e.which === keyCodes.ENTER ? onApply({ filter, hide }) : null}
          /*onKeyPress={e => {
            if (e.which === keyCodes.ENTER) {
              if (e.target.value === '') {
                onApply({ filter, hide });
              } else {
                const val = e.target.value;
                const allOptions = union(options, [val]);
                setOptions(allOptions);
                toggle(filterHandle, val);
              }
            }
          }}*/
          onSuggestionSelected={({ item }) => {
            console.log(item);
            setContextKey(item.key)
            // if (!item) return;
            // const allOptions = union(options, [item.key]);
            // setOptions(allOptions);
            // if (singleSelect) {
            //   setOptions([item.key]);
            //   setFullField(filterHandle, [item.key], [])
            //     .then(responseFilter => onApply({ filter: responseFilter, hide }))
            //     .catch(err => console.log(err));
            // } else {
            //   toggle(filterHandle, item.key);
            // }
          }}
        />
      </div>
      <div>
        <label htmlFor="geometry">Geometry:</label>
        <input
          type="text"
          id="geometry"
          value={geometry}
          onChange={(e) => setGeometry(e.target.value)}
        />
      </div>
      <div>
        <label>Error Type:</label>
        <label htmlFor="identificationError">
          <input
            type="radio"
            id="identificationError"
            value="IDENTIFICATION"
            checked={errorType === 'IDENTIFICATION'}
            onChange={() => setErrorType('IDENTIFICATION')}
          />
          Identification Error
        </label>
        <label htmlFor="locationError">
          <input
            type="radio"
            id="locationError"
            value="LOCATION"
            checked={errorType === 'LOCATION'}
            onChange={() => setErrorType('LOCATION')}
          />
          Location Error
        </label>
      </div>
      <div>
        <label htmlFor="comment">Comment:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

export { AnnotationForm };