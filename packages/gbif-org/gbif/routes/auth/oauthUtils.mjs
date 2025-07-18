// import locales from 'config/locales';
import _ from 'lodash';
import URL from 'url';
import logger from '../../config/logger.mjs';
import * as userModel from '../user/user.model.mjs';
import { getByUserName } from '../user/user.model.mjs';
import { base64ToJson, logUserIn, setNoCache } from './utils.mjs';

/**
 * generic wrapper for handling callback from auth providers. Will either connect, login or create a new account based on the state included in the initial request
 * @param req
 * @param res
 * @param next
 * @param err
 * @param profile
 * @param info
 * @param setProviderValues
 * @param providerEnum
 * @param identificationKey
 */
export function authCallback(
  req,
  res,
  next,
  err,
  profile,
  info,
  setProviderValues,
  providerEnum,
  identificationKey
) {
  if (!identificationKey || !providerEnum) {
    throw new Error('Missing provider or id key');
  }
  setNoCache(res);
  if (!err) {
    try {
      // assume that there is always a state associated with the call
      let state = base64ToJson(req.query.state);
      // LOGIN
      if (state.action === 'LOGIN') {
        login(req, res, next, state, profile, providerEnum, identificationKey);
      } else if (state.action === 'CONNECT') {
        connect(req, res, next, state, profile, setProviderValues, providerEnum, identificationKey);
      } else {
        next(new Error('Invalid callback state'));
      }
    } catch (err) {
      logger.logError(err, { context: 'auth_callback', state: req.query.state });
      // something went wrong - probably while trying to parse the base 64 encoded state
      next(err);
    }
  } else {
    logger.logError(err, { context: 'auth_callback_final' });
    next(err);
    return;
  }
}

function getFirstVerifiedEmail(profile) {
  // if not found by provider id, then the user hasn't commected.
  // But we might be able to find the user by email instead.
  let profileEmails = _.get(profile, 'emails', []);
  let profileEmail = _.find(profileEmails, function (email) {
    // Trust the email if:
    // 1) the claim is that it has been verified
    // 2) exception for facebook as they do not expose the verified claim, but does so according to tests and the wisdom of the internet.
    return email.value && (email.verified === true || profile.provider === 'github');
    // NB exception for gihub as the flag is missing and otherwise will prevent account creation using GitHub
  });
  return profileEmail;
}

class LoginError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LoginError';
    this.statusCode = 204;
  }
}

async function getUserFromProvider(profile, identificationKey) {
  try {
    // check to see if the profile is linked to any users
    let findQuery = {};
    findQuery[identificationKey] = profile.id;
    let user = await userModel.find(findQuery);

    if (!user) {
      throw new Error('Recieved empty response from API');
    }
    return user;
  } catch (err) {
    if (err.statusCode == 204) {
      // if not found by provider id, then the user hasn't connected.
      // But we might be able to find the user by email instead.
      let profileEmail = getFirstVerifiedEmail(profile);
      if (!profileEmail) {
        throw new LoginError('No verified email in profile');
      }
      return getByUserName(profileEmail.value);
    } else {
      logger.logError(err, { context: 'get_user_from_provider', profileId: profile.id });
      throw err;
    }
  }
}

/**
 * Log in with auth provider
 * @param req
 * @param res
 * @param next
 * @param state
 * @param profile
 */
function login(req, res, next, state, profile, providerEnum, identificationKey) {
  getUserFromProvider(profile, identificationKey)
    .then(function (user) {
      let pathWithLocale = state.target;
      if (user && typeof user === 'object' && !_.get(user, 'userName')) {
        logger.debug('User has no userName', { userKeys: Object.keys(user) });
      }
      // the user was found - log in
      logUserIn(res, user);

      // if path ends with "/user/login" then redirect to profile page
      if (pathWithLocale.endsWith('/user/login')) {
        pathWithLocale = pathWithLocale.replace('/user/login', '/user/profile');
      }
      res.redirect(302, pathWithLocale);
    })
    .catch(function (err) {
      if (err.statusCode === 204) {
        // the profile isn't known to us
        // tell the user to login and connect
        res.cookie(
          'loginFlashInfo',
          JSON.stringify({ authProvider: providerEnum, error: 'LOGIN_UNKNOWN' }),
          {
            maxAge: 60000, // 1 minute
            secure: false,
            httpOnly: false,
          }
        );
        res.redirect(302, '/user/login');
      } else {
        // something went wrong while searching for the user - this shouldn't happen and is likely an API failure or an app secret error
        // we cannot do anything but show an error message to the user
        logger.logError(err, { context: 'login_user_search', profileId: profile.id });
        res.status(500).send('Internal server error');
      }
    });
}

/**
 * Connect logged in user to auth provider
 * @param req
 * @param res
 * @param next
 * @param state
 * @param profile
 */
function connect(
  req,
  res,
  next,
  state,
  profile,
  setProviderValues,
  providerEnum,
  identificationKey
) {
  // ensure user is logged in before connecting accounts
  if (req.user) {
    // check if the profile is already connected to another account
    let findQuery = {};
    findQuery[identificationKey] = profile.id;
    userModel
      .find(findQuery)
      .then(function (user) {
        // the profile is already connected to another user account
        res.cookie(
          'profileFlashInfo',
          JSON.stringify({ authProvider: providerEnum, error: 'PROVIDER_ACCOUNT_ALREADY_IN_USE' }),
          {
            maxAge: 60000, // 1 minute
            secure: false,
            httpOnly: false,
          }
        );
        res.redirect(302, '/user/profile');
      })
      .catch(function (err) {
        if (err.statusCode == 204) {
          // the profile isn't in our systems
          // connect it to the user account
          setProviderValues(req.user, profile);
          userModel
            .update(req.user.userName, req.user)
            .then(function () {
              res.redirect(302, state.target || '/');
            })
            .catch(function (err) {
              if (err.statusCode === 401) {
                res.cookie(
                  'profileFlashInfo',
                  JSON.stringify({
                    authProvider: providerEnum,
                    error: 'EMAIL_USED_BY_OTHER_ACCOUNT',
                  }),
                  {
                    maxAge: 60000, // 1 minute
                    secure: false,
                    httpOnly: false,
                  }
                );
                res.redirect(302, '/user/profile');
              } else {
                next(new Error('Unable to connect account'));
              }
            });
        } else {
          // something went wrong while searching for the user - this shouldn't happen and is likely an API failure or an app secret error
          // we cannot do anything but show an error message to the user
          next(err);
        }
      });
  } else {
    next(new Error('user is not logged in while trying to connect accounts'));
  }
}
