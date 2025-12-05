import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { Skeleton } from '../../components/Skeleton';

// TODO move styling to emotion to theme

export default (getData, { isHtmlResponse } = {}) =>
  injectIntl(class Format extends Component {
    constructor(props) {
      super(props);
      this.getTitle = this.getTitle.bind(this);
      this.state = {
      };
    }

    componentDidMount() {
      this._mounted = true;
      this.getTitle();
    }

    componentWillUnmount() {
      // Cancel fetch callback?
      this._mounted = false;
    }

    componentDidUpdate(prevProps) {
      if (prevProps.id !== this.props.id) {
        this.getTitle();
      }
    }

    getTitle() {
      // do not bother canceling the actual request, just abort updating if canceled
      if (this.cancelPending) this.cancelPending();
      let canceled = false;
      let dataResult = getData({ id: this.props.id, locale: this.props.intl?.locale });
      this.cancelPending = () => canceled = true;

      // if it is a promise, then wait for it to return
      if (typeof dataResult?.then === 'function') {
        dataResult.then(
          result => {
            if (canceled) return;
            if (this._mounted) {
              this.setState({ title: result.title, error: false });
            }
          }
        ).catch((err) => {
          if (canceled) return;
          if (this._mounted) {
            console.log(err);
            this.setState({ title: 'unknown', error: true });
          }
        });
      } else {
        // the function simply returned a value.
        this.setState({ title: typeof dataResult.title === 'undefined' ? '' : dataResult.title });
      }
    }

    render() {
      let title = this.state.error ? (
        <span className="discreet">unknown</span>
      ) : (
          this.state.title
        );
      if (typeof title === 'undefined') {
        return <span style={{ width: 100, display: 'inline-block', verticalAlign: 'top' }}>
          <Skeleton />
        </span>
      }
      if (isHtmlResponse) {
        return <span dangerouslySetInnerHTML={{ __html: title }}></span>;
      } else {
        return <span>{title}</span>;
      }
    }
  });
