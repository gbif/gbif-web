import { EventSearch, themeBuilder } from 'gbif-react-components';
// import EventSearch from 'gbif-react-components/dist/esm/EventSearch/Standalone';
// import themeBuilder from 'gbif-react-components/dist/esm/style/themeBuilder';

function App() {
  const widgetLocale = 'en';

    var siteTheme = themeBuilder.extend({
      baseTheme: 'light',
      extendWith: {
        dense: true,
        primary: '#c44d34',
        linkColor: '#c44d34',
        fontSize: '15px',
        background: '#E7E7E7',
        paperBackground: '#ffffff',
        paperBorderColor: '#e0e0e0',
        color: '#162d3d',
        darkTheme: false,
        fontFamily:
                '"Roboto", BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica", "Arial", sans-serif',
        borderRadius: 4,
        drawerZIndex: 1000,
        progressBar: '#ba4931'
      },
    });

    var routes = {
      eventSearch: {
        route: '/',
      },
      eventKey: {
        url: ({ key, otherIds }) =>
                `https://collections-test.ala.org.au/public/showDataResource/${otherIds.datasetKey}`,
        isHref: true,
        route: '/event/:key',
      },
      datasetKey: {
        url: ({ key, gbifOrgLocalePrefix }) =>
                `https://collections-test.ala.org.au/public/showDataResource/${key}`,
        isHref: true,
        route: '/dataset/:key',
      },
    };
    routes.basename = '/';

    var alaSiteConfig = {
      theme: siteTheme,
      routes: routes,
      locale: widgetLocale,
      event: {
        labels: {
          taxonKey: {
            type: 'ENDPOINT',
            template: function ({ id, api }) {
              return (
                      '//namematching-ws.ala.org.au/api/getByTaxonID?taxonID=' +
                      encodeURIComponent(id)
              );
            },
            transform: function (result) {
              return { title: result.scientificName };
            },
          },
        },
      },
      mapSettings: {
        zoom: 3,
        lat: -29.0,
        lng: 137.1
      }
    };
  return <EventSearch siteConfig={alaSiteConfig} pageLayout style={{ height: '100vh' }} />;
}

export default App
