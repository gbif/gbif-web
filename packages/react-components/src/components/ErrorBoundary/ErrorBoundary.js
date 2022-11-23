import * as styles from './ErrorBoundary.styles';
import { Button } from '../Button';
import { MdError } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, showStack: true };

    // Bind event handlers
    this.handleToggleStack = this.handleToggleStack.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  handleToggleStack() {
    this.setState({
      ...this.state,
      showStack: !this.state.showStack,
    });
  }

  render() {
    const { error, showStack } = this.state;
    return error ? (
      <div css={styles.container}>
        <MdError size={72} />
        <h1 style={{ marginBottom: 0 }}>
          <FormattedMessage id="error.generic" defaultMessage="An error occurred" />
        </h1>
        <h3 style={{ marginTop: 12 }}>
          {error.message || <FormattedMessage id="error.unknown" defaultMessage="Unknown error" />}
        </h3>
        <div css={styles.actions}>
          <Button as="a" target="_blank" href="https://github.com/gbif/gbif-web/issues/new">
            <FormattedMessage id="error.report" defaultMessage="Report issue" />
          </Button>
          <Button onClick={this.handleToggleStack}>
            <FormattedMessage
              id={showStack ? 'error.hideDetails' : 'error.showDetails'}
              defaultMessage={showStack ? 'Hide details' : 'Show details'}
            />
          </Button>
        </div>
        {error.stack && showStack && (
          <div css={styles.stack}>
            {error.stack.split(' at ').slice(1).map((stackItem) => 
              <span>at {stackItem}</span>
            )}
          </div>
        )}
      </div>
    ) : this.props.children; 
  }
}

export { ErrorBoundary };