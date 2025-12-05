import React from 'react';
const gbifOrg = 'https://www.gbif.org';

export default React.createContext({
  en: {
    gbifLocale: '',
  },
  es: {
    gbifLocale: 'es',
    vocabularyLocale: 'es'
  },
  'en-DK': {
    vocabularyLocale: 'es'
  }
});
