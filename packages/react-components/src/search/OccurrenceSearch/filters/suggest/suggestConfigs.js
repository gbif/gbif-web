/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from "react";
import axios from '../../api/axios';

const suggestStyle = { whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' };

export const suggestConfigs = {
  scientificName: {
    //What placeholder to show
    placeholder: 'Search by scientific name',
    // how to get the list of suggestion data
    getSuggestions: async ({ q }) => {
      const suggestions = (await axios.get(`https://api.gbif.org/v1/species/suggest?limit=8&q=${q}`)).data;
      return suggestions;
    },
    // how to map the results to a single string value
    getValue: suggestion => suggestion.scientificName,
    // how to display the individual suggestions in the list
    render: function ScientificNameSuggestItem(suggestion) {
      return <div style={{ maxWidth: '100%' }}>
        <div style={suggestStyle}>
          {suggestion.scientificName}
        </div>
        <div style={{ color: '#aaa', fontSize: '0.85em' }}>
          <Classification taxon={suggestion} />
        </div>
      </div>
    }
  },
  datasetTitle: {
    //What placeholder to show
    placeholder: 'Search by dataset',
    // how to get the list of suggestion data
    getSuggestions: async ({ q }) => {
      const suggestions = (await axios.get(`https://api.gbif.org/v1/dataset/suggest?limit=8&q=${q}`)).data;
      return suggestions;
    },
    // how to map the results to a single string value
    getValue: suggestion => suggestion.title,
    // how to display the individual suggestions in the list
    render: function ScientificNameSuggestItem(suggestion) {
      return <div style={{ maxWidth: '100%' }}>
        <div style={suggestStyle}>
          {suggestion.title}
        </div>
      </div>
    }
  }
};





export const Classification = ({ taxon, ...props }) => {
  const ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
  return <span css={taxClass}>
    {ranks.map(rank => {
      return taxon.rank !== rank.toUpperCase() && taxon[rank] ? <span key={rank}>{taxon[rank]}</span> : null;
    })}
  </span>
}

export const taxClass = css`
  &>span:after {
    font-style: normal;
    content: ' ❯ ';
    font-size: 80%;
    color: #ccc;
    display: inline-block;
    padding: 0 3px;
  }
  &>span:last-of-type:after {
    display: none;
  }
`;