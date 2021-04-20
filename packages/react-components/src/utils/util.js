import stringify from 'fast-json-stable-stringify';

/**
 * generate human readable classnames for easier hacking through css
 * e.g. gbif-button gbif-button-isActive gbif-button-loading
 * @param {string} prefix how to prefix classNames (default 'gbif')
 * @param {string} elementName name of your component e.g. 'button'
 * @param {object} classes what modifiers are applied to this component. An object of booleans and/or strings. booleans will be appended as keys and strings as strings
 * @param {string} className other classnames
 */
export function getClasses(prefix = 'gbif', elementName, classes = {}, className = '') {
  const classesToApply = [];
  Object.keys(classes).forEach(key => {
    const val = classes[key];
    if (val === true) {
      classesToApply.push(key);
    } else if (typeof val === 'string') {
      classesToApply.push(val);
    }
  });
  const humanClasses = getClassNames(prefix, elementName, classesToApply);
  return { classNames: {className: `${className} ${humanClasses}`}, classesToApply };
}

const getClassNames = (prefix, elementName, classes) => {
  const root = `${prefix}-${elementName}`;
  return classes.reduce((a, c) => `${a} ${root}-${c}`, `${root}`);
}

export const isEmpty = obj => Object.entries(obj).length === 0 && obj.constructor === Object;

export const oneOfMany = options => (props, propName, componentName) => {
  const first = options.find(option => Object.prototype.hasOwnProperty.call(props, option));
  return !first && new Error(`On of ${options} is required for ${componentName}`)
}

export function hash(obj) {
  return strToHash(stringify(obj));
}

export const strToHash = function (str) {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export const keyCodes = {
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  ENTER: 13,
  ESCAPE: 27,
};

export function removeTrailingSlash(path) {
  return path.charAt(path.length-1) === '/'
    ? path.slice(0, -1)
    : path
}

export function join(){
  var args = Array.prototype.slice.call(arguments);
  return args
    .filter(x => x !== '')
    .map(x => x.replace(/\/$/g, '')) // remove trailing slash
    // .map(x => x.replace(/^\//g, '')) // remove prepended slash
    .join('/')
    .replace(/\/\//g, '\/')
}