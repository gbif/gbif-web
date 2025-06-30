import dotenv from 'dotenv';
import _ from 'lodash';
import queryString from 'query-string';
import { authenticatedRequest } from '../auth/gbifAuthRequest.mjs';
import { fetchWithRetry } from '../auth/utils.mjs';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const identityBaseUrl = process.env.REGISTRY_API_V1;

const apiConfig = {
  user: {
    url: identityBaseUrl + '/user',
    canonical: 'user',
  },
  userCreate: {
    url: identityBaseUrl + '/admin/user/',
    canonical: 'admin/user/',
  },
  userAdmin: {
    url: identityBaseUrl + '/admin/user/',
    canonical: 'admin/user/',
  },
  userConfirm: {
    url: identityBaseUrl + '/admin/user/confirm',
    canonical: 'admin/user/confirm',
  },
  userLogin: {
    url: identityBaseUrl + '/user/login',
  },
  userResetPassword: {
    url: identityBaseUrl + '/admin/user/resetPassword',
    canonical: 'admin/user/resetPassword',
  },
  userUpdateForgottenPassword: {
    url: identityBaseUrl + '/admin/user/updatePassword',
    canonical: 'admin/user/updatePassword',
  },
  userChallengeCodeValid: {
    url: identityBaseUrl + '/admin/user/confirmationKeyValid',
    canonical: 'admin/user/confirmationKeyValid',
  },
  userChangePassword: {
    url: identityBaseUrl + '/user/changePassword',
    canonical: 'user/changePassword',
  },
  userChangeEmail: {
    url: identityBaseUrl + '/admin/user/changeEmail',
    canonical: 'admin/user/changeEmail',
  },
  userFind: {
    url: identityBaseUrl + '/admin/user/find',
    canonical: 'admin/user/find',
  },
};

export async function create(body) {
  let options = {
    method: 'POST',
    body: body,
    url: apiConfig.userCreate.url,
    canonicalPath: apiConfig.userCreate.canonical,
  };
  let response = await authenticatedRequest(options);
  if (response.statusCode !== 201) {
    throw response;
  }

  return response.body;
}

export async function confirm(challengeCode, userName) {
  let options = {
    method: 'POST',
    body: {
      confirmationKey: challengeCode,
    },
    url: apiConfig.userConfirm.url,
    canonicalPath: apiConfig.userConfirm.canonical,
    userName: userName,
  };
  let response = await authenticatedRequest(options);
  if (response.statusCode !== 201) {
    throw response;
  }
  return response.body;
}

/**
 * Provides admin access to user management, so make sure to only expose this to authenticated users
 */
async function changeEmail(body) {
  let options = {
    method: 'PUT',
    body: {
      challengeCode: body.challengeCode,
      email: body.email,
    },
    url: apiConfig.userChangeEmail.url,
    canonicalPath: apiConfig.userChangeEmail.canonical,
    userName: body.userName,
  };
  let response = await authenticatedRequest(options);
  if (response.statusCode !== 204) {
    throw response;
  }
  return response.body;
}

/**
 * Provides admin access to user management, so make sure to only expose this to authenticated users
 */
export async function update(userName, body) {
  let options = {
    method: 'PUT',
    body: body,
    url: apiConfig.userAdmin.url + userName,
    canonicalPath: apiConfig.userAdmin.canonical + userName,
  };
  let response = await authenticatedRequest(options);
  if (response.statusCode > 299) {
    throw response;
  }
  return response;
}

export async function resetPassword(userNameOrEmail) {
  let options = {
    method: 'POST',
    body: {},
    url: apiConfig.userResetPassword.url,
    canonicalPath: apiConfig.userResetPassword.canonical,
    userName: userNameOrEmail,
  };
  console.log('resetPassword called for', options);
  let response = await authenticatedRequest(options);
  if (response.statusCode > 299) {
    throw response;
  }
  return response.body;
}

export async function updateForgottenPassword(body) {
  let challengeCode = body.challengeCode,
    password = body.password;
  // TODO test challengeCode and password is present

  let options = {
    method: 'POST',
    body: {
      challengeCode: challengeCode,
      password: password,
    },
    url: apiConfig.userUpdateForgottenPassword.url,
    canonicalPath: apiConfig.userUpdateForgottenPassword.canonical,
    userName: body.userName,
  };
  let response = await authenticatedRequest(options);

  if (response.statusCode !== 201) {
    throw response;
  }
  return response.body;
}

async function isValidChallenge(userName, challengeCode) {
  let options = {
    method: 'GET',
    url: apiConfig.userChallengeCodeValid.url + '?confirmationKey=' + challengeCode,
    userName: userName,
  };
  let response = await authenticatedRequest(options);
  if (response.statusCode !== 204) {
    throw response;
  }
  return response;
}

async function isValidChallengeEmail(userName, email, challengeCode) {
  let options = {
    method: 'GET',
    url:
      apiConfig.userChallengeCodeValid.url +
      '?confirmationKey=' +
      challengeCode +
      '&email=' +
      encodeURIComponent(email),
    userName: userName,
  };
  let response = await authenticatedRequest(options);
  if (response.statusCode !== 204) {
    throw response;
  }
  return response;
}

/**
 * Provides admin access to user management, so make sure to only expose this to authenticated users
 */
export async function getByUserName(userName) {
  let options = {
    method: 'GET',
    url: apiConfig.userAdmin.url + userName,
    json: true,
  };
  const response = await authenticatedRequest(options);
  if (response.statusCode !== 200) {
    throw response;
  }
  return response.body;
}

export async function find(query) {
  let options = {
    method: 'GET',
    url: apiConfig.userFind.url + '?' + queryString.stringify(query),
    json: true,
  };
  const response = await authenticatedRequest(options);
  if (response.statusCode !== 200) {
    throw response;
  }
  return response.body;
}

/**
 * Provides admin access to user management, so make sure to only expose this to authenticated users
 */
async function getDownloads(userName, query) {
  query = query || {};
  ensureString(userName, 'user name');
  ensureObject(query, 'download query');
  let options = {
    url: apiConfig.occurrenceDownloadUser.url + userName + '?' + queryString.stringify(query),
    userName: userName,
    method: 'GET',
    json: true,
  };
  const response = await authenticatedRequest(options);
  if (response.statusCode !== 200) {
    throw response;
  }
  return response.body;
}

/**
 * Provides admin access to user management, so make sure to only expose this to authenticated users
 */
async function createSimpleDownload(user, query) {
  query = query || {};
  ensureString(user.userName, 'user name');
  ensureObject(query, 'download query');

  query.notification_address = user.email || 'an_email_is_required_despite_not_needing_it';

  let options = {
    url: apiConfig.occurrenceSearchDownload.url + '?' + queryString.stringify(query),
    userName: user.userName,
    type: 'PLAIN',
    method: 'GET',
    json: false,
  };
  const response = await authenticatedRequest(options);
  if (response.statusCode !== 200) {
    throw response;
  }
  return response.body;
}

/**
 * Provides admin access to user management, so make sure to only expose this to authenticated users
 */
async function createPredicateDownload(user, query, source) {
  query = query || {};
  ensureString(user.userName, 'user name');
  ensureObject(query, 'download query');

  let email = user.email;

  let url = apiConfig.occurrenceSearchDownload.url;
  if (source) {
    url += '?source=' + encodeURIComponent(source);
  }
  let options = {
    url: url,
    canonicalPath: apiConfig.occurrenceSearchDownload.canonical,
    body: {
      creator: user.userName,
      notificationAddresses: email ? [email] : undefined,
      sendNotification: true,
      format: query.format || 'SIMPLE_CSV',
      predicate: query.predicate,
    },
    userName: user.userName,
    method: 'POST',
    json: true,
  };
  return authenticatedRequest(options);
}

/**
 * Provides admin access to user management, so make sure to only expose this to authenticated users
 */
async function createSqlDownload(user, query, source) {
  query = query || {};
  ensureString(user.userName, 'user name');
  ensureObject(query, 'download query');

  let email = user.email;

  let url = apiConfig.occurrenceSearchDownload.url;
  if (source) {
    url += '?source=' + encodeURIComponent(source);
  }
  let options = {
    url: url,
    canonicalPath: apiConfig.occurrenceSearchDownload.canonical,
    body: {
      creator: user.userName,
      notificationAddresses: email ? [email] : undefined,
      sendNotification: true,
      format: query.format || 'SQL_TSV_ZIP',
      sql: query.sql,
      machineDescription: query.machineDescription,
    },
    userName: user.userName,
    method: 'POST',
    json: true,
  };
  return authenticatedRequest(options);
}

/**
 * Provides admin access to user management, so make sure to only expose this to authenticated users
 */
async function cancelDownload(user, key) {
  ensureString(user.userName, 'user name');
  ensureObject(query, 'download query');

  let options = {
    url: apiConfig.occurrenceCancelDownload.url + key,
    userName: user.userName,
    method: 'DELETE',
  };
  return authenticatedRequest(options);
}

async function login(auth) {
  // use plain fetch
  return await fetchWithRetry(apiConfig.userLogin.url, {
    headers: {
      authorization: auth,
      contentType: 'application/json',
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      throw new Error('Failed to login');
    });
}

export async function changePassword(auth, newPassword) {
  return fetchWithRetry(apiConfig.userChangePassword.url, {
    method: 'PUT',
    headers: {
      authorization: auth,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: newPassword,
    }),
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error('Unauthorized, wrong password');
      }
      if (response.status !== 204) {
        throw new Error('Failed to change password');
      }
      return; // 204 No Content response has no body
    })
    .catch((err) => {
      throw err;
    });
}

export function getClientUser(user) {
  // sanitize user somehow? iThere isn't anything in the response that cannot go out at this point. later perhaps some configurations that are for internal only
  if (!user) {
    return;
  }
  return {
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    roles: user.roles,
    settings: {
      country: user?.settings?.country,
      locale: user?.settings?.locale,
      has_read_gdpr_terms: user.settings.has_read_gdpr_terms,
    },
    connectedAcounts: {
      google: _.has(user, 'systemSettings["auth.google.id"]'),
      github: _.has(user, 'systemSettings["auth.github.id"]'),
      orcid: _.has(user, 'systemSettings["auth.orcid.id"]'),
    },
    photo:
      _.get(user, 'systemSettings["auth.google.photo"]') ||
      _.get(user, 'systemSettings["auth.github.photo"]'),
    githubUserName: _.get(user, 'systemSettings["auth.github.username"]'),
    orcid: _.get(user, 'systemSettings["auth.orcid.id"]'),
  };
}

export function sanitizeUpdatedUser(user) {
  const firstName = user?.firstName?.trim();
  const lastName = user?.lastName?.trim();
  return {
    userName: user.userName,
    firstName: firstName ? firstName : undefined,
    lastName: lastName ? lastName : undefined,
    email: user.email,
    settings: {
      country: user.country,
      locale: user.locale,
      has_read_gdpr_terms: user.has_read_gdpr_terms,
    },
  };
}

function ensureString(value, name) {
  if (typeof value !== 'string') {
    throw new TypeError(`${name} must be a string, but got ${typeof value}`);
  }
}

function ensureObject(value, name) {
  if (typeof value !== 'object' || value === null) {
    throw new TypeError(`${name} must be an object, but got ${typeof value}`);
  }
}
