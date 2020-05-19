import React from "react";
import { Autocomplete } from '../../../components/Autocomplete/Autocomplete';

class Suggest extends React.Component {
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
    const suggestions = await this.props.getSuggestions({q: value});
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
    this.props.onSuggestionSelected({item, value});
    this.setState({ value: '', item })
  };

  render() {
    const { value, suggestions, loading } = this.state;
    const { render, getValue, placeholder } = this.props;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: placeholder || 'Search',
      value,
      onChange: this.onChange,
      onKeyPress: this.props.onKeyPress
    };

    // Finally, render it!
    return (
      <>
        <Autocomplete
          style={{ margin: '10px', zIndex: 10 }}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getValue}
          renderSuggestion={render}
          inputProps={inputProps}
          onSuggestionSelected={this.onSuggestionSelected}
          isLoading={loading}
          ref={this.props.focusRef}
        />
      </>
    );
  }
}

export default Suggest;