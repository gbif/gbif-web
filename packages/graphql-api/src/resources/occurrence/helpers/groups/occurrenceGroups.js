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
const terms = require('./terms.json');

const defaultValue = {
  'Occurrence': [],
  'Record': [],
  'Organism': [],
  'MaterialSample': [],
  'Event': [],
  'Location': [],
  'GeologicalContext': [],
  'Identification': [],
  'Taxon': [],
  'Other': []
}
var groupBy = function(arr, key, field) {
  return arr.reduce(function(groups, obj) {
    const value = field ? obj[field]: obj;
    (groups[value[key]] = groups[value[key]] || []).push(value);
    return groups;
  }, {});
};

const qualified2Simple = groupBy(terms, 'qualifiedName', 'simpleName')

const remarkTypes = require('../../../../enums/interpretationRemark.json').map(remark => {
  return {
    ...remark,
    simpleRelatedTerms: remark.relatedTerms.map(qualifiedName => qualified2Simple[qualifiedName])
  }
});

// terms that aren't dwc or dc, but should be shown anyway
const termsWhiteList = [
  'elevation',
  'elevationAccuracy',
  'depth',
  'depthAccuracy',
  'distanceAboveSurface',
  'distanceAboveSurfaceAccuracy',
  'recordedByID',
  'identifiedByID'
];

function getTermSubset(terms) {
  // field terms that are to be included independent of their source. that is included these gbif specific terms
  return terms.filter(term => term.source === 'DwcTerm' || term.source === 'DcTerm' || typeof termsWhiteList.indexOf(term.simpleName) > -1);
}

const visibleTerms = getTermSubset(terms);

const remarkMap = remarkTypes.reduce((acc, cur) => {
  acc[cur.id] = cur;
  return acc;
}, {})

/* 
Group the terms so that they have a structure like
{
  Group (e.g. Taxon): {
    simpleName (e.g. kingdom): {qualifiedName, simpleName, group, source}
  }
}
*/
const groupedTerms = visibleTerms.reduce((acc, cur) => {
  _.set(acc, `${cur.group}.${cur.simpleName}`, cur)
  return acc
}, {})

/*
Generate functions that takes an occurrences and a group and returns an object with the terms
{
  Taxon: occurrences => [{value, verbatim, remarks}]
}
*/
module.exports = function ({ occurrence, verbatim }) {
  // create a map with issues per field
  const field2issues = occurrence.issues.reduce((field2issues, issue) => {
    if (remarkMap[issue]) {
      remarkMap[issue].simpleRelatedTerms.forEach(term => {
        field2issues[term] = field2issues[term] || [];
        field2issues[term].push(_.pick(remarkMap[issue], ['id', 'severity']));
      })
    }
    return field2issues;
  }, {})

  const enrichedTerms = visibleTerms
    .filter(({ qualifiedName, simpleName }) => {
      // remove terms that have no value (neither verbatim or interpreted)
      return typeof occurrence[simpleName] !== 'undefined' || typeof verbatim[qualifiedName] !== 'undefined';
    })
    .map(({ qualifiedName, simpleName, group = 'Other', source, compareWithVerbatim }) => {
    // enrich the used terms with related issues, remarks and both verbatim and GBIF view of the value
    return {
      qualifiedName, simpleName, group, source,
      label: simpleName,
      issues: field2issues[simpleName],
      remarks: getRemarks({value: occurrence[simpleName], verbatim: verbatim[qualifiedName], compareWithVerbatim}),
      value: occurrence[simpleName],
      verbatim: verbatim[qualifiedName]
    }
  }, {});
  const groups = Object.assign({}, defaultValue, groupBy(enrichedTerms, 'group'));
  return groups;
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
  } else if (value.toString().toLowerCase().replace(/_/g, '') !== verbatim.toString().toLowerCase().replace(/_/g, '')) {
    return 'ALTERED';
  } else {
    return null
  }
}