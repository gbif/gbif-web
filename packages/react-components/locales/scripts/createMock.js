let fs = require('fs');
let pseudoloc = require('pseudoloc');
let path = require('path');
let dir = path.join(__dirname, '../_build/');
let _ = require('lodash');
let enJson = require(dir + '/en');

function save(o, name) {
  fs.writeFile(dir + name + '.json', JSON.stringify(o, null, 2), function (err) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('Translation files was succesfully build');
  });
}

function mockify(object, path, language) {
  const newObject = _.clone(object);

  _.each(object, (val, key) => {
    if (typeof val === 'string') {
      newObject[key] = getMockText(val);
    } else if (typeof (val) === 'object') {
      let nestedPath = path ? path + key + '.' : key + '.';
      newObject[key] = mockify(val, nestedPath, language);
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

let translatedJsonEU = mockify(enJson, undefined, 'de-MOCK');
save(translatedJsonEU, 'de-MOCK');