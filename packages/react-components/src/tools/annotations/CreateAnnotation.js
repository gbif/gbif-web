import { css, jsx } from '@emotion/react';
import React, { useState } from 'react';
import { MdArrowBack, MdSend } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { StringParam, useQueryParam } from 'use-query-params';
import { Button, ButtonGroup, Classification, Input, Tooltip } from '../../components';
import axios from '../../dataManagement/api/axios';
import { placeholder } from '../../style/shared';
import { Option, Suggest } from '../../widgets/Filter/utils';
import { Context } from './Context';

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

function AnnotationForm({ token, onClose, onCreate, ...props }) {
  const errorOptions = [
    { value: 'LOCATION', label: 'Location' },
    { value: 'IDENTIFICATION', label: 'Identification' },
  ];

  const enrichmentOptions = [
    { value: 'NATIVE', label: 'Native' },
    { value: 'VAGRANT', label: 'Vagrant' },
    { value: 'CAPTIVITY', label: 'Captivity' },
    { value: 'INTRODUCED', label: 'Introduced' },
  ];

  const [contextType = 'TAXON', setContextType] = useQueryParam('type', StringParam);
  const [contextKey, setContextKey] = useQueryParam('key', StringParam);
  const [geometry, setGeometry] = useState('');
  const [project, setProject] = useState();
  const [feedbackType, setFeedbackType] = useState('ERROR');
  const [error, setError] = useState(errorOptions[0]);
  const [enrichment, setEnrichment] = useState(enrichmentOptions[0]);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const annotationRule = {
        contextType,
        contextKey,
        geometry,
        project,
      };
      if (feedbackType === 'ERROR') {
        annotationRule.errorType = error.value;
      } else if (feedbackType === 'ENRICHMENT') {
        annotationRule.enrichmentType = enrichment.value;
      }

      const res = await (axios.post(
        'http://labs.gbif.org:7013/v1/occurrence/annotation/rule',
        annotationRule,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )).promise;
      if (comment && comment.length > 0) {
        const commentData = { comment };

        const commentRes = await (axios.post(
          `http://labs.gbif.org:7013/v1/occurrence/annotation/rule/${res.data.id}/comment`,
          commentData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )).promise;
      }
      onCreate(res.data);
    } catch (err) {
      console.error(err);
      alert('Error creating annotation');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Context onChange={(context) => {
          setContextType(contextType);
          setContextKey(contextKey);
        }} />

        <div css={css`background: white; border-radius: 4px; margin: 12px; border: 1px solid var(--paperBorderColor);`}>
          <Input placeholder="Geometry as WKT" onChange={e => setGeometry(e.target.value)} style={{ border: 'none' }} />
        </div>

        <div css={css`background: white; border-radius: 4px; margin: 12px; border: 1px solid var(--paperBorderColor);`}>
          <div>
            <ButtonGroup css={css`
            width: 100%;
            border-bottom: 1px solid var(--paperBorderColor);
            >button {
              flex: 1 1 50%!important;
              border-bottom-left-radius: 0!important;
              border-bottom-right-radius: 0!important;
              border: none!important;
            }
          `}>
              <Button appearance={feedbackType === 'ERROR' ? 'primary' : 'primaryOutline'} truncate onClick={() => setFeedbackType('ERROR')}>Error</Button>
              <Button appearance={feedbackType === 'ENRICHMENT' ? 'primary' : 'primaryOutline'} onClick={() => setFeedbackType('ENRICHMENT')}>Enrichment</Button>
            </ButtonGroup>
          </div>
          <fieldset css={css`
        border:none;
        padding: 12px;
        margin: 0;
        `}>
            {feedbackType === 'ERROR' && errorOptions.map(option => <Option
              key={option.value}
              isRadio={true}
              helpVisible={!!option.help}
              helpText={option.help}
              label={option.label}
              checked={option.value === error.value}
              onChange={() => setError(option)}
            />
            )}
            {feedbackType === 'ENRICHMENT' && enrichmentOptions.map(option => <Option
              key={option.value}
              isRadio={true}
              helpVisible={!!option.help}
              helpText={option.help}
              label={option.label}
              checked={option.value === enrichment.value}
              onChange={() => setEnrichment(option)}
            />
            )}
          </fieldset>
        </div>

        <div css={css`background: white; border-radius: 4px; margin: 12px; border: 1px solid var(--paperBorderColor);`}>
          <Suggest
            css={css`
            margin: 0;
            border: none;
            width: 100%;
            input {
              border: none;
            }
            `}
            {...suggestConfig}
            placeholder="Project (optional)"
            // allowEmptyQueries={config?.specific?.allowEmptyQueries}
            // focusRef={focusRef}
            onKeyPress={e => e.which === keyCodes.ENTER ? onApply({ filter, hide }) : null}
            onSuggestionSelected={({ item }) => {
              setProject(item.key)
            }}
          />
        </div>

        <div css={css`background: white; border-radius: 4px; margin: 12px; border: 1px solid var(--paperBorderColor);`}>
          <textarea
            placeholder="Comment (optional)"
            id="comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
            css={css`
            padding: 4px 11px;
            border: none; 
            width: 100%;
            height: 100px;
            font-size: inherit;
            line-height: 1.5;
            background-color: #fcfdfd;
            resize: vertical;
          `} />
        </div>

        {/* <div>
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
      </div>*/}
        <div css={css`text-align: end; margin: 12px; display: flex; flex-direction: row;`}>
          <Button look="outline" onClick={onClose}>
            Cancel
          </Button>
          <div css={css`flex: 1 1 100%;`}></div>
          <Button look="primary" type="submit">
            Create
          </Button>
        </div>
      </form>
    </>
  );
}

export { AnnotationForm };