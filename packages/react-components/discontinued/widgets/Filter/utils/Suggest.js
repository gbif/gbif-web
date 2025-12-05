import React from "react";
import { injectIntl } from 'react-intl';
import { Autocomplete } from '../../../components/Autocomplete/Autocomplete';
import LocaleContext from '../../../dataManagement/LocaleProvider/LocaleContext';

class Suggest extends React.Component { 
  static contextType = LocaleContext;
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
    if (this.suggestions?.cancel) {
      this.suggestions.cancel();
      if (this.suggestions?.promise?.cancel) this.suggestions.promise.cancel();
    }
    if (!this.props.allowEmptyQueries && value === '') {
      return;
    }
    this.setState({
      loading: true,
      error: undefined,
    });
    let canceled = false;
    const { promise, cancel } = this.props.getSuggestions({ q: value, localeContext: this.context });
    this.suggestions = {
      promise: promise,
      cancel: () => {
        if (cancel) cancel();
        canceled = true;
      }
    }

    this.suggestions.promise
      .then(response => {
        if (canceled) return;
        this.setState({
          suggestions: response.data,
          error: undefined,
          loading: false
        });
      })
      .catch(err => {
        if (canceled) return;
        this.setState({
          suggestions: [],
          error: 'Unable to load results',
          loading: false
        });
      })
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = ({ item, value }) => {
    if (this.props.onSuggestionSelected) {
      this.props.onSuggestionSelected({ item, value });
    }
    this.setState({ item });
  };

  render() {
    const { value, suggestions, loading, error } = this.state;
    const { intl, render, getValue, placeholder } = this.props;

    // Autosuggest will pass through all these props to the input
    const placeholderTranslationString = placeholder || 'search.placeholders.default';
    const inputProps = {
      placeholder: intl.formatMessage({id: placeholderTranslationString}),
      value,
      onChange: this.onChange,
      onKeyPress: this.props.onKeyPress
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
          isLoading={loading}
          ref={this.props.focusRef}
          menuCss={this.props.menuCss}
          delay={this.props.delay}
          loadingError={error && value !== ''}
        />
      </>
    );
  }
}

export default injectIntl(Suggest);