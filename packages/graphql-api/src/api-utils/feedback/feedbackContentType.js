import _ from 'lodash';
import config from '#/config';
import { contentfulLocaleToGbifLocaleMap } from '../../helpers/utils';
// request = rootRequire('app/helpers/request'),
// const getAnnotations = require('../../../models/gbifdata/occurrence/occurrenceAnnotate');
import { authenticatedGet } from '../../helpers/auth/authenticatedGet.js';
import getAnnotations from './occurrenceAnnotate.js';

const locales = Object.keys(contentfulLocaleToGbifLocaleMap)
  .map((key) => contentfulLocaleToGbifLocaleMap[key])
  .filter((x) => !!x);

function getLocaleFromUrl(url) {
  if (url === '') {
    return false;
  }
  const first = url.substring(1).split('/');
  const matchedIndex = locales.indexOf(first[0]);
  if (matchedIndex !== -1) {
    return locales[matchedIndex];
  }
  return undefined;
}

// remove locale from url. e.g. removeLocaleFromUrl('/en/blogpost/123', 'en') -> '/blogpost/123'
function removeLocaleFromUrl(url, locale) {
  // eslint-disable-next-line no-useless-escape
  const expr = `(^${locale}/)|(^${locale}$)`;
  const regex = new RegExp(expr);
  const strippedUrl = `/${url.substring(1).replace(regex, '')}`;
  return strippedUrl;
}
export const getFeedbackContentType = (path, cb) => {
  let path_ = path || '';
  const queryLocale = getLocaleFromUrl(path_);
  path_ = removeLocaleFromUrl(path_, queryLocale);
  // parse path
  // if occurrence then get occurrence and dataset
  // if select list of annotatable datasets, then refer to their site.
  // else extract relevant contacts and list them.

  // if not occurrence then simply show github form in frontend
  const occurrenceRegEx = /^(\/)?occurrence\/[0-9]+$/gi;
  if (path_.match(occurrenceRegEx)) {
    // is occurrence - extract id
    parseOccurrence(path_)
      .then(function (result) {
        cb(result);
      })
      .catch(function (err) {
        console.error('Error occurred while parsing occurrence:', err);
        cb(); // fail silently.
      });
  } else {
    cb();
  }
};

const getUserByUserName = async (username) => {
  // admin/user/
  try {
    const user = await authenticatedGet({
      canonicalPath: `/admin/user/${username}`,
      config,
    });
    return user;
  } catch (error) {
    // Handle error
  }
};

const getOccurrence = async (key) => {
  const response = await fetch(`${config.apiv1}/occurrence/${key}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  const occurrence = await response.json();
  const { publishingOrgKey, datasetKey } = occurrence;
  const datasetResponse = await fetch(`${config.apiv1}/dataset/${datasetKey}`);
  const dataset = await datasetResponse.json();
  const publisherResponse = await fetch(
    `${config.apiv1}/organization/${publishingOrgKey}`,
  );
  const publisher = await publisherResponse.json();
  return { ...occurrence, publisher, dataset };
};

const getNode = async (endorsingNodeKey) => {
  const response = await fetch(`${config.apiv1}/node/${endorsingNodeKey}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  const node = await response.json();
  return node;
};

async function parseOccurrence(path) {
  // let occurrenceKey;
  const contentType = {};

  const occurrenceKey = path.match(/[0-9]+$/)[0];

  // get occurrence, dataset and pubisher based on occurrence key
  const occurrence = await getOccurrence(occurrenceKey);

  // get endorsing node as node managers want to be cc'ed
  const node = await getNode(occurrence.publisher.endorsingNodeKey);
  contentType.ccContacts = getContacts(_.get(node, 'record.contacts', []));
  const mention = await getGithubHandlesToMention({ node });
  if (mention.length > 0) {
    contentType.mention = mention;
  }
  // has custom annotation system?
  occurrence._installationKey = occurrence.dataset.installationKey;
  contentType.annotation = getAnnotations(occurrence);

  /*   if (contentType.annotation && contentType.annotation.commentsUrl) {
    try {
      const comments = await getComments(contentType.annotation);
      contentType.comments = comments;
    } catch (err) {
      // ignore failed attempt to fetch comments - fail silently
    }
  } */

  // get administrative contacts
  contentType.contacts = getContacts(_.get(occurrence, 'dataset.contacts', []));

  // add the feedback contenttype
  if (contentType.annotation) {
    contentType.type = 'CUSTOM';
  } else if (contentType.contacts) {
    contentType.type = 'MAIL';
  }

  // add related keys to allow data providers to search for issues related to them
  contentType.datasetKey = occurrence.datasetKey;
  contentType.publishingOrgKey = occurrence.publishingOrgKey;
  contentType.publishingCountry = occurrence.publishingCountry;

  if (occurrence.networkKeys && occurrence.networkKeys.length > 0) {
    contentType.networkKeys = occurrence.networkKeys;
  }

  return contentType;
}

// yet another awful hack to fit Annosys in.
// async function getComments(config) {
//     let options = {
//         url: config.commentsUrl,
//         json: true,
//         maxAttempts: 1
//     };

//     let response = await request(options);
//     if (response.statusCode == 200 && _.get(response, 'body.' + config.commentsCountField, 0) > 0) {
//         let comments = {
//             results: response.body[config.commentsListField],
//             count: response.body[config.commentsCountField],
//             url: config.allCommentsUrl
//         };

//         comments.results = _.map(_.slice(comments.results, 0, 5), function(comment) {
//             let item = {
//                 title: comment[config.commentTitle],
//                 createdAt: comment[config.commentCreated]
//             };
//             let commentUrl = config.commentUrlTemplate;
//             for (let i = 0; i < config.keys.length; i++) {
//                 let key = config.keys[i];
//                 let val = comment[key] || '';
//                 commentUrl = commentUrl.replace('{{' + key + '}}', val);
//             }
//             item.url = commentUrl;
//             return item;
//         });
//         return comments;
//     }
//     return {
//         count: 0,
//         comments: []
//     };
// }

function getContacts(contacts) {
  const adminContacts = contacts.filter(function (contact) {
    return (
      (contact.type == 'ADMINISTRATIVE_POINT_OF_CONTACT' ||
        contact.type == 'NODE_MANAGER') &&
      !_.isEmpty(contact.email)
    );
  });

  if (adminContacts.length > 0) {
    // get first contact name and mail
    const firstContact = {
      firstName: adminContacts[0].firstName,
      lastName: adminContacts[0].lastName,
      organization: adminContacts[0].organization,
      email: adminContacts[0].email[0],
    };

    // get list of administrative contact mails
    let allMails = [];
    adminContacts.forEach(function (e) {
      allMails = allMails.concat(e.email);
    });
    return {
      firstContact,
      allMails,
    };
  }
}

async function getGithubHandlesToMention({ node }) {
  const nodeStaffEmails = _.get(node, 'record.contacts', [])
    .filter(function (contact) {
      return (
        (contact.type === 'NODE_MANAGER' || contact.type === 'NODE_STAFF') &&
        !_.isEmpty(contact.email)
      );
    })
    .map(function (contact) {
      return contact.email[0];
    });
  const githubHandles = await Promise.all(
    nodeStaffEmails.map(getGithubHandleFromEmail),
  );
  const mention = githubHandles.filter(function (name) {
    return name;
  });
  return mention;
}

async function getGithubHandleFromEmail(email) {
  try {
    const gbifUser = await getUserByUserName(email);
    return _.get(gbifUser, 'systemSettings["auth.github.username"]');
  } catch (err) {
    return null;
    // ignore errors - user just won't be mentioned.
  }
}

export default {
  getFeedbackContentType,
};
