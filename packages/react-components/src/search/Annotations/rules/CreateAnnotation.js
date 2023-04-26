import { css, jsx } from '@emotion/react';
import React, { useState, useContext } from 'react';
import { Button, Classification, Input } from '../../../components';
import axios from '../../../dataManagement/api/axios';
import { Option, Suggest } from '../../../widgets/Filter/utils';
import { FilterContext } from '../../../widgets/Filter/state';
import SearchContext from '../../SearchContext';
import { filter2v1 } from '../../../dataManagement/filterAdapter';
import MapWithGeoJSON from './MapWithGeoJSON';
import getFeature from './getFeature';

const suggestStyle = { whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' };

const BACKBONE_KEY = 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c';

const suggestConfig = {
  //What placeholder to show
  placeholder: 'Load geometry from GADM',
  // how to get the list of suggestion data
  getSuggestions: ({ q }) => {
    const { promise, cancel } = axios.get(`http://api.gbif.org/v1/geocode/gadm/search?limit=100&q=${q}`);
    return {
      promise: promise.then(response => {
        return {
          data: response.data.results.map(x => ({ title: x.name, key: x.id, ...x }))
        }
      }),
      cancel
    }
  },
  // how to map the results to a single string value
  getValue: suggestion => suggestion.title,
  // how to display the individual suggestions in the list
  render: function GadmGidSuggestItem(suggestion) {
    return <div style={{ maxWidth: '100%' }}>
      <div style={suggestStyle}>
        {suggestion.title}
      </div>
      {suggestion?.higherRegions?.length > 0 && <Classification style={{ opacity: .8 }}>
        {suggestion.higherRegions.map(x => <span>{x.name}</span>)}
      </Classification>}
    </div>
  }
};

function AnnotationForm({ token, onClose, onCreate, ...props }) {
  const annotationOptions = [
    {
      "value": "NATIVE",
      "label": "Native"
    },
    {
      "value": "INTRODUCED",
      "label": "Introduced"
    },
    {
      "value": "MANAGED",
      "label": "Managed"
    },
    {
      "value": "FORMER",
      "label": "Former"
    },
    {
      "value": "VAGRANT",
      "label": "Vagrant"
    },
    {
      "value": "CAPTIVITY",
      "label": "Captivity"
    },
    {
      "value": "SUSPICIOUS",
      "label": "Suspicious"
    },
    {
      "value": "OTHER",
      "label": "Other"
    }
  ];

  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(SearchContext);
  const [geometry, setGeometry] = useState('');
  const [project, setProject] = useState();
  const [annotationType, setAnnotationType] = useState(annotationOptions[0]);
  const [comment, setComment] = useState('');

  const onGadmSelect = (gadm) => {
    const { promise, cancel } = axios.get(`http://localhost:4000/unstable-api/geometry/simplify/gadm/${gadm.gadmLevel}/${gadm.id}?format=WKT`);
    promise.then(response => {
      setGeometry(response.data.wkt)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { v1Filter, error } = filter2v1(currentFilterContext.filter, predicateConfig);
      const filter = { ...v1Filter, ...rootPredicate };

      const annotationRule = {
        ...filter,
        geometry,
        // project,
      };
      annotationRule.annotation = annotationType.value;
      annotationRule?.taxonKey && (annotationRule.taxonKey = Number.parseInt(annotationRule.taxonKey));
      annotationRule.project = annotationRule.projectId;
      delete annotationRule.projectId;
      
      // if no taxonKey and no datasetKey, then throw an error)
      if (!annotationRule.taxonKey && !annotationRule.datasetKey) throw new Error('Taxon or dataset is required');
      if (geometry === '') throw new Error('Geometry is required');

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

  const { geojson: geoJsonString, error: wktError } = getFeature(geometry);

  return (
    <>
      <div>
        <MapWithGeoJSON type={annotationType.value} geojson={JSON.parse(geoJsonString)} style={{width: '100%', height: '300px'}}/>
      </div>
      <form onSubmit={handleSubmit}>
        <div css={css`background: white; border-radius: 4px; margin: 12px; border: 1px solid var(--paperBorderColor);`}>
          <Input placeholder="Geometry as WKT" onChange={e => setGeometry(e.target.value)} value={geometry} style={{ border: 'none' }} />
        </div>

        <div css={css`background: white; border-radius: 4px; margin: 12px; border: 1px solid var(--paperBorderColor);`}>
            <Suggest
              css={css`
                width: 100%;
                margin: 0;
                border: none;
                input {
                  border-radius: 0 0 4px 4px;
                  border: none;
                }
              `}
              {...suggestConfig}
              onSuggestionSelected={(item) => {
                onGadmSelect(item.item);
              }}
              allowClear={false}
            />
          </div>

        <div css={css`background: white; border-radius: 4px; margin: 12px; border: 1px solid var(--paperBorderColor);`}>
          <fieldset css={css`
        border:none;
        padding: 12px;
        margin: 0;
        `}>
            {annotationOptions.map(option => <Option
              key={option.value}
              isRadio={true}
              helpVisible={!!option.help}
              helpText={option.help}
              label={option.label}
              checked={option.value === annotationType.value}
              onChange={() => setAnnotationType(option)}
            />
            )}
          </fieldset>
        </div>

        {/* <div css={css`background: white; border-radius: 4px; margin: 12px; border: 1px solid var(--paperBorderColor);`}>
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
        </div> */}

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