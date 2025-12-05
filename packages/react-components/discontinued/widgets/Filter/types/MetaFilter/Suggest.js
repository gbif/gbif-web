import React from "react";
import { injectIntl } from 'react-intl';
import { Autocomplete } from '../../../../components/Autocomplete/Autocomplete';

class Suggest extends React.Component {
  constructor(props) {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      suggestions: props.initSuggestions
    };
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.props.getSuggestions({ q: value })
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = ({ item, value }) => {
    this.onSuggestionsClearRequested();
    if (this.props.onSuggestionSelected) {
      this.props.onSuggestionSelected({ item, value });
    }
  };

  render() {
    const { suggestions: currentSuggestions } = this.state;
    const { intl, defaultIsOpen, render, getValue, placeholder, onChange, value, initSuggestions, onKeyPress } = this.props;
    const suggestions = value === '' ? initSuggestions : currentSuggestions;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: placeholder || intl.formatMessage({id: 'search.placeholders.default'}),
      value,
      onChange,
    };

    // Finally, render it!
    return (
      <>
        <Autocomplete
          style={{ margin: '10px' }}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getValue}
          renderSuggestion={render}
          inputProps={inputProps}
          onSuggestionSelected={this.onSuggestionSelected}
          isLoading={false}
          ref={this.props.focusRef}
          menuCss={this.props.menuCss}
          delay={this.props.delay}
          defaultIsOpen={defaultIsOpen}
        />
      </>
    );
  }
}

export default injectIntl(Suggest);