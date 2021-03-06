import get from 'lodash/get';

const filterConf = {
  fields: {
    country: {
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