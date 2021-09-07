let pseudoloc = require('pseudoloc');
let _ = require('lodash');

function createPseudo(object, path) {
  const newObject = _.clone(object);

  _.each(object, (val, key) => {
    if (typeof val === 'string') {
      newObject[key] = getMockText(val);
    } else if (typeof (val) === 'object') {
      let nestedPath = path ? path + key + '.' : key + '.';
      newObject[key] = createPseudo(val, nestedPath);
    }
  });
  return newObject;
}

function getMockText(str) {
  if ((str.indexOf('{') !== -1) || (str.indexOf('%s') !== -1)) {
    return '[[[!' + str + '!]]]';
  }
  return pseudoloc.str(str);
}

module.exports = createPseudo;