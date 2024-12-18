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
import interpretationRemark from '#/helpers/enums/interpretationRemark';
import { isNil, pick } from 'lodash';
import terms from './terms.json';

const defaultValue = {
  occurrence: [],
  record: [],
  organism: [],
  materialSample: [],
  event: [],
  location: [],
  geologicalContext: [],
  identification: [],
  taxon: [],
  other: [],
};

const groupBy = (arr, key, field) => {
  return arr.reduce((groups, obj) => {
    const value = field ? obj[field] : obj;
    // eslint-disable-next-line no-param-reassign
    (groups[value[key]] = groups[value[key]] || []).push(value);
    return groups;
  }, {});
};

const keyBy = (arr, key, fn) => {
  return arr.reduce((map, obj) => {
    let value = obj;
    if (fn) {
      if (typeof fn === 'string') {
        value = obj[fn];
      } else if (typeof fn === 'function') {
        value = fn(obj, key, arr);
      }
    }
    // eslint-disable-next-line no-param-reassign
    map[value[key]] = value;
    return map;
  }, {});
};

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

const qualified2Simple = groupBy(terms, 'qualifiedName', 'simpleName');

const remarkTypes = interpretationRemark.map((remark) => {
  return {
    ...remark,
    simpleRelatedTerms: remark.relatedTerms.map(
      (qualifiedName) => qualified2Simple[qualifiedName],
    ),
  };
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
  'identifiedByID',
];

function getTermSubset(rawTerms) {
  // field terms that are to be included independent of their source. that is included these gbif specific terms
  return rawTerms.filter(
    (term) =>
      term.source === 'DwcTerm' ||
      term.source === 'DcTerm' ||
      typeof termsWhiteList.indexOf(term.simpleName) > -1,
  );
}

const visibleTerms = getTermSubset(terms);

const remarkMap = remarkTypes.reduce((acc, cur) => {
  acc[cur.id] = cur;
  return acc;
}, {});

function getRemarks({ value, verbatim, compareWithVerbatim }) {
  /*
      EXCLUDED has bben replaced with NOT_INDEXED
  */
  if (compareWithVerbatim === false) {
    return null;
  }
  if (isNil(value)) return 'NOT_INDEXED';
  if (isNil(verbatim)) return 'INFERRED';
  if (
    value.toString().toLowerCase().replace(/_/g, '') !==
    verbatim.toString().toLowerCase().replace(/_/g, '')
  )
    return 'ALTERED';
  return null;
}

/*
Generate functions that takes an occurrences and a group and returns an object with the terms
{
  Taxon: occurrences => [{value, verbatim, remarks}]
}
*/
export default ({ occurrence, verbatim }) => {
  // create a map with issues per field
  const field2issuesOut = occurrence.issues.reduce((field2issues, issue) => {
    if (remarkMap[issue]) {
      remarkMap[issue].simpleRelatedTerms.forEach((term) => {
        // eslint-disable-next-line no-param-reassign
        field2issues[term] = field2issues[term] || [];
        field2issues[term].push(pick(remarkMap[issue], ['id', 'severity']));
      });
    }
    return field2issues;
  }, {});

  const enrichedTerms = visibleTerms
    .filter(({ qualifiedName, simpleName }) => {
      // remove terms that have no value (neither verbatim or interpreted)
      return (
        typeof occurrence[simpleName] !== 'undefined' ||
        typeof verbatim[qualifiedName] !== 'undefined'
      );
    })
    .map(
      ({
        qualifiedName,
        simpleName,
        group = 'other',
        source,
        compareWithVerbatim,
      }) => {
        // enrich the used terms with related issues, remarks and both verbatim and GBIF view of the value
        const camelGroup = camelize(group);
        return {
          qualifiedName,
          simpleName,
          group: camelGroup,
          source,
          label: simpleName,
          issues: field2issuesOut[simpleName],
          remarks: getRemarks({
            value: occurrence[simpleName],
            verbatim: verbatim[qualifiedName],
            compareWithVerbatim,
          }),
          value: occurrence[simpleName],
          verbatim: verbatim[qualifiedName],
        };
      },
      {},
    );
  const groups = {
    ...defaultValue,
    ...groupBy(enrichedTerms, 'group'),
  };
  Object.keys(groups).forEach((groupName) => {
    groups[groupName] = keyBy(groups[groupName], 'simpleName');
  });
  return groups;
};
