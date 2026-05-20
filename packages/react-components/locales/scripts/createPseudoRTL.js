import _ from 'lodash';

// Arabic letter Ain (ع) is used as a visible RTL marker at each end of the string.
// Its presence causes Unicode bidirectional algorithm to treat the surrounding text as RTL,
// making this locale useful for testing RTL layout without losing the English content.
const RTL_MARKER = 'ع';

function createPseudoRTL(object) {
  const newObject = _.clone(object);

  _.each(object, (val, key) => {
    if (typeof val === 'string') {
      newObject[key] = replaceWithRTL(val);
      // newObject[key] = wrapWithRTL(val);
    } else if (typeof val === 'object') {
      newObject[key] = createPseudoRTL(val);
    }
  });
  return newObject;
}

function wrapWithRTL(str) {
  if (str === '') return str;
  return RTL_MARKER + str + RTL_MARKER;
}

function replaceWithRTL(str) {
  if (str === '') return str;
  if (str.indexOf('{') !== -1 || str.indexOf('%s') !== -1) {
    return RTL_MARKER + '[[[!' + str + '!]]]' + RTL_MARKER;
  }
  return str.replace(/./g, (char) => {
    if (char === ' ') return char; // preserve spaces
    return RTL_MARKER;
  });
}

export default createPseudoRTL;
