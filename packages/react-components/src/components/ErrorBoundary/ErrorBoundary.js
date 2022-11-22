import * as styles from './ErrorBoundary.styles';
import { MdError } from 'react-icons/md';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    const { error } = this.state;

    return error ? (
      <div css={styles.container}>
        <MdError size={72} />
        <h1 style={{ marginBottom: 0 }}>An error occurred</h1>
        <h3 style={{ marginTop: 10 }}>{error.message || 'Unknown error'}</h3>
        {/* ADD MAX HEIGHT IN STYLES */}
        <div css={styles.stack}>
          {error.stack.split(' at ').slice(1).map((stackItem, stackIndex) => 
            <span>at {stackItem}</span>
          )}
        </div>
      </div>
    ) : this.props.children; 
  }
}

export default ErrorBoundary;