import React, { Component } from "react";
// TODO move styling to emotion to theme

export default getData =>
  class Format extends Component {
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
      // TODO consider to cancel request?
      let dataResult = getData(this.props.id);
      // if it is a promise, then wait for it to return
      if (typeof dataResult?.then === "function") {
        dataResult.then(
          result => {
            if (this._mounted) {
              this.setState({ title: result.title });
            }
          },
          error => {
            if (this._mounted) {
              this.setState({ title: "unknown", error: true });
            }
          }
        );
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
      const style = typeof title !== 'undefined'
        ? {}
        : {display:'inline-block', width: '100px', background: 'rgba(0,0,0,.1)'};
      return <span style={style}>{title}</span>;
    }
  };
