import React from "react";
import * as styles from './ErrorBoundary.styles';
import { Button } from '../Button';
import { ErrorImage as ErrorImage } from '../Icons/Icons';
import { FormattedMessage } from 'react-intl';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, showStack: false };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.invalidateOn !== this.props.invalidateOn) {
      this.setState({
        ...this.state,
        error: false
      });
    }
  }

  handleToggleStack = () => {
    this.setState({
      ...this.state,
      showStack: !this.state.showStack,
    });
  }

  render() {
    const { error, showStack } = this.state;

    // if there is no error then just return the children
    if (!error) {
      return this.props.children;
    }

    // An error has occurred
    let errorMessage = `Thank you for reporting this issue. Please describe what happened.\n\n\n\n`;

    if (typeof error?.stack === 'string') errorMessage += '\n**Error message for diagnostics**\n```\n' + error.stack + '\n```';
    errorMessage += `\nLocation: ${window.location}`;

    return <div css={styles.container}>
      <ErrorImage style={{ maxWidth: '100%', width: 280 }} />
      <h1 style={{ marginBottom: 0 }}>
        <FormattedMessage
          id='error.generic'
          defaultMessage='Something went wrong'
        />
      </h1>
      <div css={styles.actions}>
        <Button
          as='a'
          target='_blank'
          href={`https://github.com/gbif/gbif-web/issues/new?body=${encodeURIComponent(errorMessage)}`}
        >
          <FormattedMessage id='error.report' defaultMessage='Report issue' />
        </Button>
      </div>
      <Button look="text" style={{ color: 'var(--color500)', marginBottom: 8 }} onClick={this.handleToggleStack}>
        <FormattedMessage
          id={showStack ? 'error.hideDetails' : 'error.showDetails'}
          defaultMessage={showStack ? 'Hide details' : 'Show details'}
        />
      </Button>
      {error.stack && showStack && (
        <div css={styles.stack}>
          <h4 style={{ marginTop: 12 }}>
            {error.message || (
              <FormattedMessage
                id='error.unknown'
                defaultMessage='Unknown error'
              />
            )}
          </h4>
          <pre>
            {error.stack}
          </pre>
        </div>
      )}
    </div>
  }
}

export { ErrorBoundary };
