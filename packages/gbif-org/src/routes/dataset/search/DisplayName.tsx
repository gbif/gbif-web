import React, { Component, useEffect } from 'react';
import { useIntl } from 'react-intl';

export function DisplayName({
  getData,
  id,
  useHtml,
}: {
  getData: ({ id }: { id: string | number }) => {
    promise?: Promise<{ title: string; description: React.ReactElement }>;
    result?: { title: string; description: React.ReactElement };
    cancel: Function;
  };
  id: string | number;
  useHtml: boolean;
}) {
  const intl = useIntl();
  const [title, setTitle] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    let canceled = false;
    let { promise, result, cancel } = getData({ id });

    if (promise) {
      promise
        .then((result) => {
          console.log(result);
          if (canceled) return;
          if (result?.title) {
            setTitle(result.title);
          } else {
            setTitle('unknown');
          }
        })
        .catch((err) => {
          if (canceled) return;
          console.log(err);
          setTitle('unknown');
        });
    } else if (result) {
      setTitle(result.title);
    } else {
      setTitle('unknown');
    }

    return () => {
      cancel();
    };
  }, [id, useHtml]);

  return title ? (
    useHtml ? (
      <span dangerouslySetInnerHTML={{ __html: title }}></span>
    ) : (
      <span>{title}</span>
    )
  ) : (
    <span style={{ width: 100, display: 'inline-block', verticalAlign: 'top' }}>
      <span>loading...</span>
    </span>
  );
}

export function PublisherLabel({ id }: { id: string }) {
  return (
    <DisplayName
      getData={({ id }) => ({
        promise: fetch(`https://api.gbif-uat.org/v1/organization/${id}`)
          .then((response) => response.json())
          .then((response) => ({ title: response.title })),
        cancel: () => {},
      })}
      id={id}
      useHtml={false}
    />
  );
}

/*
reference implementation

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

*/
