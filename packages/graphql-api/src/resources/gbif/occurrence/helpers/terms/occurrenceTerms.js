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
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { isNil, pick } from 'lodash';
import mdit from 'markdown-it';
import terms from '../groups/terms.json';

const md = mdit({
  html: true,
  linkify: true,
  typographer: false,
});
md.linkify.tlds(['org', 'com'], false);

const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

const groupBy = (arr, key, field) => {
  return arr.reduce((groups, obj) => {
    const value = field ? obj[field] : obj;
    // eslint-disable-next-line no-param-reassign
    (groups[obj[key]] = groups[obj[key]] || []).push(value);
    return groups;
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

const remarkMap = remarkTypes.reduce((acc, cur) => {
  acc[cur.id] = cur;
  return acc;
}, {});

function getHtmlValue({ value, allowedTags }) {
  if (Array.isArray(value)) {
    return value.map((x) => getHtmlValue({ value: x, allowedTags }));
  }
  const options = {};
  if (allowedTags) options.ALLOWED_TAGS = allowedTags;
  if (typeof value === 'string' || typeof value === 'number') {
    const dirty = md.renderInline(`${value}`);
    const clean = DOMPurify.sanitize(dirty, options);
    return clean;
  }
  return null;
}

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
    value.toString().toLowerCase().trim().replace(/_/g, '') !==
    verbatim.toString().toLowerCase().trim().replace(/_/g, '')
  ) {
    return 'ALTERED';
  }
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
  const field2issues = occurrence.issues.reduce((map, issue) => {
    if (remarkMap[issue]) {
      remarkMap[issue].simpleRelatedTerms.forEach((term) => {
        // eslint-disable-next-line no-param-reassign
        map[term] = map[term] || [];
        map[term].push(pick(remarkMap[issue], ['id', 'severity']));
      });
    }
    return map;
  }, {});

  const enrichedTerms = terms
    .filter(({ qualifiedName, esField, simpleName }) => {
      // remove terms that have no value (neither verbatim or interpreted)
      return (
        typeof occurrence[esField || simpleName] !== 'undefined' ||
        typeof verbatim[qualifiedName] !== 'undefined'
      );
    })
    .map(
      ({
        qualifiedName,
        esField,
        simpleName,
        group = 'other',
        source,
        compareWithVerbatim,
      }) => {
        // enrich the used terms with related issues, remarks and both verbatim and GBIF view of the value
        const camelGroup = camelize(group);
        const value = occurrence[esField || simpleName];
        return {
          qualifiedName,
          simpleName,
          group: camelGroup,
          source,
          label: simpleName,
          issues: field2issues[simpleName],
          remarks: getRemarks({
            value: occurrence[esField || simpleName],
            verbatim: verbatim[qualifiedName],
            compareWithVerbatim,
          }),
          value,
          verbatim: verbatim[qualifiedName],
          htmlValue: getHtmlValue({ value, allowedTags: ['i', 'a', 'b'] }),
        };
      },
    );
  return enrichedTerms;
};
