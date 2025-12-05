
import { css, jsx } from '@emotion/react';
import React from "react";
import { Autocomplete } from './Autocomplete';
import axios from 'axios';

async function getData(q) {
  const suggestions = (await axios.get(`https://api.gbif.org/v1/species/suggest?limit=8&q=${q}`)).data;
  return suggestions;
}

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = async value => {
  const results = await getData(value);
  return results;
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.scientificName;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div style={{maxWidth: '100%'}}>
    <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
      {suggestion.scientificName}
    </div>
    <div style={{color: '#aaa', fontSize: '0.85em'}}>
      <Classification taxon={suggestion} />
    </div>
  </div >
);

export class Example extends React.Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = async ({ value }) => {
    this.setState({
      loading: true
    });
    const suggestions = await getSuggestions(value);
    this.setState({
      suggestions: suggestions,
      loading: false
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = ({ item, value }) => {
    this.setState({ value: '', item })
  };

  render() {
    const { value, suggestions, loading, item } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search scientific names',
      value,
      onChange: this.onChange
    };

    // Finally, render it!
    return (
      <>
        <Autocomplete
          {...this.props}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={this.onSuggestionSelected}
          isLoading={loading}
        />
        {/* <pre>{item && JSON.stringify(item, null, 2)}</pre> */}
      </>
    );
  }
}

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