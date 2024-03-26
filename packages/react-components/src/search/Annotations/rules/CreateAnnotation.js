import { css, jsx } from '@emotion/react';
import React, { useState, useContext, useEffect } from 'react';
import { Button, Classification, Input } from '../../../components';
import axios from '../../../dataManagement/api/axios';
import { Option, Suggest } from '../../../widgets/Filter/utils';
import { FilterContext } from '../../../widgets/Filter/state';
import SearchContext from '../../SearchContext';
import { filter2v1 } from '../../../dataManagement/filterAdapter';
import MapWithGeoJSON from './MapWithGeoJSON';
import getFeature from './getFeature';
import UserContext from '../../../dataManagement/UserProvider/UserContext';
import env from '../../../../.env.json';

const suggestStyle = { whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' };

const suggestConfig = {
  //What placeholder to show
  placeholder: 'Load geometry from GADM',
  // how to get the list of suggestion data
  getSuggestions: ({ q }) => {
    const { promise, cancel } = axios.get(`${env.API_V1}/geocode/gadm/search?limit=100&q=${q}`);
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

function AnnotationForm({ polygons, setPolygons, onClose, onCreate, ...props }) {
  const { user, signHeaders } = useContext(UserContext);

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
  const [invertGeometry, setInvertGeometry] = useState(false);
  const [gadm, setGadm] = useState('');
  const [project, setProject] = useState();
  const [annotationType, setAnnotationType] = useState(annotationOptions[0]);
  const [comment, setComment] = useState('');

  const onGadmSelect = (gadm) => {
    const { promise, cancel } = axios.get(`${env.UTILS_API}/geometry/simplify/gadm/${gadm.gadmLevel}/${gadm.id}?format=WKT`);
    promise.then(response => {
      setPolygons([response.data.wkt])
    });
  };

  const onInvertGeometry = () => {
    setInvertGeometry(!invertGeometry);
  };

  // set geometry to first polygon in list
  useEffect(() => {
    if (invertGeometry) {
      setGeometry("POLYGON ((-180 -90, -90 -90, 0 -90, 90 -90, 180 -90, 180 90, 90 90, 0 90, -90 90, -180 90, -180 -90)," + 
      polygons[0].replace(/POLYGON/g, "").
      replace(/\(\(/g, "(").replace(/\)\)/g, ")") + ")");
    } else {
      setGeometry(polygons[0]);
    } 
  }, [polygons, invertGeometry]);


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
      annotationRule.projectId && (annotationRule.projectId = Number.parseInt(annotationRule.projectId));
      delete annotationRule.project;
      
      // if no taxonKey and no datasetKey, then throw an error)
      if (!annotationRule.taxonKey && !annotationRule.datasetKey) throw new Error('Taxon or dataset is required');
      if (geometry === '') throw new Error('Geometry is required');

      const res = await (axios.post(
        `${env.ANNOTATION_API}/occurrence/experimental/annotation/rule`,
        annotationRule,
        {
          headers: signHeaders()
        }
      )).promise;
      if (comment && comment.length > 0) {
        const commentData = { comment };

        const commentRes = await (axios.post(
          `${env.ANNOTATION_API}/occurrence/experimental/annotation/rule/${res.data.id}/comment`,
          commentData,
          {
            headers: signHeaders()
          }
        )).promise;
      }
      onCreate(res.data);
    } catch (err) {
      console.error(err);
      alert('Error creating annotation');
    }
  };

  const { geojson, error: wktError } = getFeature(geometry || '');

  return (
    <>
      <div>
        <MapWithGeoJSON type={annotationType.value} geojson={geojson} style={{width: '100%', height: '300px'}}/>
      </div>

      <div css={css`background: white; border-radius: 4px; margin: 12px; border: 1px solid var(--paperBorderColor);`}>
          <fieldset css={css`
            border:none;
            padding: 12px;
            margin: 0;
            `}>
          <label>
            <input
              type="checkbox"
              checked={invertGeometry}
              onChange={onInvertGeometry}
              title="Only works with simple polygons."
            />
            Invert geometry
          </label>
              </fieldset>
        </div>

      <form onSubmit={handleSubmit}>
        <div css={css`background: white; border-radius: 4px; margin: 12px; border: 1px solid var(--paperBorderColor);`}>
          <Input placeholder="Geometry as WKT" onChange={e => setPolygons([e.target.value])} value={geometry || ''} style={{ border: 'none' }} />
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