// import { css } from '@emotion/react';
import React, { Component } from 'react';
import { Dataset } from 'gbif-react-components';

class App extends Component {
  state = {
    counter: 0
  };

  render() {
    let currentKey = '821cc27a-e3bb-4bc5-ac34-89ada245069d';
    let props = {
      id: currentKey,
      siteConfig: {
        routes: {
          ssr_location: `/`,
          datasetKey: {
            route: '/',
            isHref: true,
            url: ({ key }) => {
              return `/dataset/${key}`;
            },
          }
        },
        occurrence: {
          occurrenceSearchTabs: ['TABLE', 'GALLERY', 'MAP', 'DATASETS'],
        }
      }
    };

    return (
      <Dataset {...props}/>
      // <div
      //   {...this.props}
      //   searchState={searchState}
      //   onSearchStateChange={this.onSearchStateChange}
      // >
      //   HEJ MED DIG : {JSON.stringify(this.state)}
        // <Button onClick={() => {
        //     this.setState({ counter: this.state.counter + 1 });
        //   }}>{this.state.counter}</Button>
      //   <div hitsPerPage={3} />
      //   <div />
      //   <div />
      //   <div attribute="brand" />
      //   <div />
      // </div>
    );
  }
}

export default App;
