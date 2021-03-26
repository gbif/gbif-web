import get from 'lodash/get';

const filterConf = {
  fields: {
    countryCode: {
      defaultKey: 'country',
      singleValue: true
    },
    institutionKey: {
      defaultKey: 'institution',
      singleValue: true
    },
    q: {
      singleValue: true
    },
    name: {
      singleValue: true
    },
    fuzzyName: {
      singleValue: true
    },
    city: {
      singleValue: true
    },
    code: {
      singleValue: true
    },
  }
}

export default filterConf;