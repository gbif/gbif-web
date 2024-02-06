import { jsx, css } from '@emotion/react';
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useQuery } from '../../dataManagement/api';
import { filter2predicate } from '../../dataManagement/filterAdapter';
import { Button, Input, HyperText, ErrorBoundary, NavBar, NavItem, ButtonGroup } from '../../components';
import { FormattedNumber } from 'react-intl';
import { StringParam, useQueryParam } from 'use-query-params';
// import { AnnotationList } from './AnnotationList';
// import { AnnotationForm } from './CreateAnnotation';
import env from '../../../.env.json';
// import { Context } from './Context';
import { SearchWrapper } from '../../search/Search';
import predicateConfig from './config/predicateConfig';
import defaultFilterConfig from './config/filterConf';
import Layout from './Layout';

function searchJsonObjects(jsonList, queryString) {
  const result = [];
  const searchWords = queryString.toLowerCase().split(' ');

  for (let i = 0; i < jsonList.length; i++) {
    const jsonObj = jsonList[i];
    const jsonStr = JSON.stringify(jsonObj).toLowerCase();

    let matchFound = true;
    for (let j = 0; j < searchWords.length; j++) {
      if (!jsonStr.includes(searchWords[j])) {
        matchFound = false;
        break;
      }
    }

    if (matchFound) {
      result.push(jsonObj);
    }
  }

  return result;
}


function getSuggests({ client, suggestStyle }) {
  return {
    annotationProject: {
      //What placeholder to show
      placeholder: 'Search by scientific name',
      // how to get the list of suggestion data
      getSuggestions: ({ q }) => {
        const { promise, cancel } = client.get(`${env.ANNOTATION_API}/occurrence/experimental/annotation/project`);
        return {
          cancel,
          promise: promise.then(response => {
            if (response.status === 200) {
              response.data = searchJsonObjects(response.data, q).map(x => ({ title: x.name, key: x.id, ...x }));
            }
            return response;
          })
        }
      },
      // how to map the results to a single string value
      getValue: suggestion => suggestion.title,
      // how to display the individual suggestions in the list
      render: function AnnotationProjectSuggestItem(suggestion) {
        return <div style={{ maxWidth: '100%' }}>
          <div>
            {suggestion.title}
          </div>
          {/* <div style={{ color: '#aaa', fontSize: '0.85em' }}>
            <Classification taxon={suggestion} />
          </div> */}
        </div>
      }
    }
  };
}

/*
This component is a widget that allows the user to search for annotations. 
add annotation rules, create projects to contain annotations, and view annotations. 
as well as comment on individual annotations.
 */
function Annotations(props) {
  // const [activeView = 'annotations', setActiveView] = useQueryParam('view', StringParam);

  return <SearchWrapper {...{ predicateConfig, defaultFilterConfig }}
    config={{
      availableCatalogues: ['ANNOTATION', 'OCCURRENCE'],
      getSuggests,
      labels: {
        projectId: {
          type: 'ENDPOINT',
          template: ({ id, api }) => `${env.ANNOTATION_API}/occurrence/experimental/annotation/project/${id}`,
          transform: result => ({ title: result.name })
        },
      },
      filters: {
        projectId: {
          type: 'SUGGEST',
          config: {
            std: {
              translations: {
                count: 'filters.annotationProject.count', // translation path to display names with counts. e.g. "3 scientific names"
                name: 'filters.annotationProject.name',// translation path to a title for the popover and the button
                description: 'filters.annotationProject.description', // translation path for the filter description
              },
            },
            specific: {
              suggestHandle: 'annotationProject',
              allowEmptyQueries: true,
              singleSelect: true
            }
          }
        }
      }
    }}>
    <Layout />
  </SearchWrapper >
}

export default Annotations;