/**
 * This helper groups all relevant terms into groups and adds
 * verbatim value
 * interpreted value (or varbatim again if it isn't interpreted)
 * detected issues related to this field
 * a comment on how this field has been changed (altered/infered/excluded)
 * 
 * The end result is something along:
 * {
 *  groupName: {
 *    simpleName: {
 *      qualifiedName, value, verbatimValue, issues, comment
 *    }
 *  }
 * }
 */
const _ = require('lodash');

const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: false
});
md.linkify.tlds(['org', 'com'], false);

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const terms = require('../groups/terms.json');

var groupBy = function (arr, key, field) {
  return arr.reduce(function (groups, obj) {
    let value = field ? obj[field] : obj;
    (groups[obj[key]] = groups[obj[key]] || []).push(value);
    return groups;
  }, {});
};

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

const qualified2Simple = groupBy(terms, 'qualifiedName', 'simpleName');

const remarkTypes = require('../../../../enums/interpretationRemark').map(remark => {
  return {
    ...remark,
    simpleRelatedTerms: remark.relatedTerms.map(qualifiedName => qualified2Simple[qualifiedName])
  }
});

const remarkMap = remarkTypes.reduce((acc, cur) => {
  acc[cur.id] = cur;
  return acc;
}, {})

/*
Generate functions that takes an occurrences and a group and returns an object with the terms
{
  Taxon: occurrences => [{value, verbatim, remarks}]
}
*/
module.exports = function ({ occurrence, verbatim }) {
  // create a map with issues per field
  const field2issues = occurrence.issues.reduce((map, issue) => {
    if (remarkMap[issue]) {
      remarkMap[issue].simpleRelatedTerms.forEach(term => {
        map[term] = map[term] || [];
        map[term].push(_.pick(remarkMap[issue], ['id', 'severity']));
      })
    }
    return map;
  }, {})

  const enrichedTerms = terms
    .filter(({ qualifiedName, esField, simpleName }) => {
      // remove terms that have no value (neither verbatim or interpreted)
      return typeof occurrence[esField || simpleName] !== 'undefined' || typeof verbatim[qualifiedName] !== 'undefined';
    })
    .map(({ qualifiedName, esField, simpleName, group = 'other', source, compareWithVerbatim }) => {
      // enrich the used terms with related issues, remarks and both verbatim and GBIF view of the value
      const camelGroup = camelize(group);
      const value = occurrence[esField || simpleName];
      return {
        qualifiedName, simpleName, group: camelGroup, source,
        label: simpleName,
        issues: field2issues[simpleName],
        remarks: getRemarks({ value: occurrence[esField || simpleName], verbatim: verbatim[qualifiedName], compareWithVerbatim }),
        value,
        verbatim: verbatim[qualifiedName],
        htmlValue: getHtmlValue({ value, allowedTags: ['i', 'a', 'b'] })
      }
    });
  return enrichedTerms;
}

function getHtmlValue({ value, allowedTags }) {
  if (Array.isArray(value)) {
    return value.map(x => getHtmlValue({value: x, allowedTags}))
  }
  let options = {};
  if (allowedTags) options.ALLOWED_TAGS = allowedTags;
  if (typeof value === 'string' || typeof value === 'number') {
    const dirty = md.renderInline('' + value);
    const clean = DOMPurify.sanitize(dirty, options);
    return clean;
  } else {
    return null;
  }
}

function getRemarks({ value, verbatim, compareWithVerbatim }) {
  /*
      EXCLUDED has bben replaced with NOT_INDEXED
  */
  if (compareWithVerbatim === false) {
    return null
  } else if (_.isNil(value)) {
    return 'NOT_INDEXED';
  } else if (_.isNil(verbatim)) {
    return 'INFERRED';
  } else if (value.toString().toLowerCase().trim().replace(/_/g, '') !== verbatim.toString().toLowerCase().trim().replace(/_/g, '')) {
    return 'ALTERED';
  } else {
    return null
  }
}
