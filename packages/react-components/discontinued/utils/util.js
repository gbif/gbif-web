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

export function formatAsPercentage(fraction, max = 100) {
  var formatedPercentage = 0;
  if (Number.isNaN(fraction)) {
    return 0;
  }
  if (!isFinite(fraction)) {
    return fraction;
  }
  fraction = 100 * fraction;
  if (fraction > 101) {
    formatedPercentage = fraction.toFixed();
  } else if (fraction > 100.1) {
    formatedPercentage = fraction.toFixed(1);
  } else if (fraction > 100) {
    formatedPercentage = 100.1;
  } else if (fraction == 100) {
    formatedPercentage = 100;
  } else if (fraction >= 99.9) {
    formatedPercentage = 99.9;
  } else if (fraction > 99) {
    formatedPercentage = fraction.toFixed(1);
  } else if (fraction >= 1) {
    formatedPercentage = fraction.toFixed();
  } else if (fraction >= 0.01) {
    formatedPercentage = fraction.toFixed(2);
  } else if (fraction < 0.01 && fraction != 0) {
    formatedPercentage = 0.01;
  }
  if (formatedPercentage > max) {
    formatedPercentage = max;
  }
  return formatedPercentage;
}


// From https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}