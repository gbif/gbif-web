/**
 * generate human readable classnames for easier hacking through css
 * e.g. gbif-button gbif-button-isActive gbif-button-loading
 * @param {string} prefix how to prefix classNames (default 'gbif')
 * @param {string} elementName name of your component e.g. 'button'
 * @param {object} classes what modifiers are applied to this component. An object of booleans and/or strings. booleans will be appended as keys and strings as strings
 * @param {string} className other classnames
 */
export function getClasses(prefix = 'gbif', elementName, classes, className) {
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

export const keyCodes = {
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  ENTER: 13,
  ESCAPE: 27,
};