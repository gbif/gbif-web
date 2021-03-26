import get from 'lodash/get';

const filterConf = {
  fields: {
    countryCode: {
      defaultKey: 'country',
      singleValue: true
    },
    q: {
      singleValue: true
    },
  }
}

export default filterConf;