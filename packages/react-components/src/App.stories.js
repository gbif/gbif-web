import React from 'react';
import { MemoryRouter as Router } from "react-router-dom";
import App from './App';
import { defaultContext as defaultSiteConfig } from './dataManagement/SiteContext';

var bisonConfig = {
  routes: {
    occurrenceSearch: {
      // The route you are currently using for occurrence search. The language prefix will be added automatically
      // If you need special routes per language, then you have to add locale specific overwrites. The page language is available as a global variable called `pageLang`
      route: '/data'
    },
    literatureSearch: {
      route: '/literature'
    }
  },
  occurrence: {
    rootPredicate: {
      "type": "and",
      "predicates": [
        {
          "type": "in",
          "key": "country",
          "values": ["US", "UM", "AS", "FM", "GU", "MH", "MP", "PR", "PW", "VI"]
        },
        {
          "type": "equals",
          "key": "notIssues",
          "value": "COUNTRY_COORDINATE_MISMATCH"
        }
      ]
    },
    highlightedFilters: ['taxonKey', 'occurrenceStatus', 'gadmGid', 'year', 'datasetName', 'occurrenceIssue', 'datasetKey']
  },
  literature: {
    rootFilter: {
      predicate: {
        type: 'or', predicates: [
          {
            type: 'in',
            key: 'countriesOfResearcher',
            values: ['US', 'UM', 'AS', 'FM', 'GU', 'MH', 'MP', 'PR', 'PW', 'VI']
          },
          {
            type: 'in',
            key: 'countriesOfCoverage',
            values: ['US', 'UM', 'AS', 'FM', 'GU', 'MH', 'MP', 'PR', 'PW', 'VI']
          }
        ]
      }
    },
    highlightedFilters: ['q', 'countriesOfResearcher', 'countriesOfCoverage', 'year']
  }
};

var livingNorway = {
  routes: {
    enabledRoutes: ['datasetKey', 'occurrenceSearch'],
    occurrenceSearch: {
      // The route you are currently using for occurrence search. The language prefix will be added automatically
      // If you need special routes per language, then you have to add locale specific overwrites. The page language is available as a global variable called `pageLang`
      route: '/data'
    },
    datasetKey: {
      url: ({key}) => `/dataset?key=${key}`,
      isHref: true
    }
  },
  occurrence: {
    rootPredicate: { type: 'equals', key: 'networkKey', value: "379a0de5-f377-4661-9a30-33dd844e7b9a" }
  }
};

export const StandaloneExample = () => <App siteConfig={defaultSiteConfig} router={Router} />;

export default {
  title: 'App/Hosted portal',
  component: StandaloneExample,
};