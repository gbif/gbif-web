import logger from '../../config/logger.mjs';
import {
  generateGraphQLToken,
  generateToken,
  removeTokenCookie,
  setNoCache,
  setTokenCookie,
} from '../auth/utils.mjs';
import {
  changePassword,
  confirm as confirmUser,
  create as createUser,
  getClientUser,
  resetPassword as resetUserPassword,
  sanitizeUpdatedUser,
  updateForgottenPassword,
  update as updateUser,
} from './user.model.mjs';

/**
 * Gets the user associated with the token in the cookie
 */
export function whoAmI(req, res) {
  try {
    if (!req.user) {
      return res.sendStatus(204);
    }
    const user = getClientUser(req.user);
    let graphqlToken = generateGraphQLToken(user);
    res.json({ user, graphqlToken });
  } catch (err) {
    res.sendStatus(err.status ?? 500);
  }
}

/*
 * Logs the user out by removing the token cookie
 */
export function logout(req, res, next) {
  removeTokenCookie(res);
  res.send('Logged out');
}

/**
 * Ask for a new password to be sent to the user associated with the username or email
 */
export async function resetPassword(req, res) {
  try {
    const { userNameOrEmail } = req.body;

    if (!userNameOrEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Call the resetPassword function from user model
    await resetUserPassword(userNameOrEmail);

    res.json({ message: 'MAIL_CONFIRMATION' });
  } catch (error) {
    logger.logError(error, { context: 'password_reset', userNameOrEmail });
    // Always return success to prevent email enumeration attacks
    res.json({ message: 'MAIL_CONFIRMATION' });
  }
}

/**
 * Confirm user creation from mail link
 */
export async function confirmAccount(req, res) {
  const { code: challengeCode, username } = req.body;
  confirmUser(challengeCode, username)
    .then(function (user) {
      let token = generateToken(user); // Generate token with a 7-day expiration
      const clientUser = getClientUser(user);
      setTokenCookie(res, token);
      res.json({ user: clientUser });
    })
    .catch(handleError(res));
}

/**
 * Updates the password from a short lived token sent to the users email previously.
 * The token is validated and the new password is set.
 */
export async function updatePasswordFromChallengeCode(req, res) {
  updateForgottenPassword(req.body)
    .then(function (user) {
      let token = generateToken(user);
      user = getClientUser(user);
      setTokenCookie(res, token);
      res.json({ user });
    })
    .catch(handleError(res, 422));
}

/**
 * Change my password using the existing as authentication
 */
export function updateKnownPassword(req, res) {
  changePassword(req.get('authorization'), req.body.password)
    .then(function () {
      res.status(204);
      res.json({ type: 'PASSWORD_CHANGED' });
    })
    .catch(handleError(res, 401));
}

/**
 * Updates the user profile information
 */
export async function updateProfile(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    // Sanitize the user input first, similar to portal16
    let user = sanitizeUpdatedUser(req.body);
    // Preserve critical fields from the original user, users are not allowed to change username and system settings
    user.userName = req.user.userName;
    user.roles = req.user.roles;
    user.systemSettings = req.user.systemSettings;

    const response = await updateUser(req.user.userName, user);

    // Return the response from the API
    res.json(response);
  } catch (error) {
    logger.logError(error, { context: 'profile_update', userName: req.user?.userName });
    const status = error.status || error.statusCode || 500;
    res.status(status).json({ message: 'Profile update failed' });
  }
}

/**
 * Creates a new user
 */
export function create(req, res) {
  setNoCache(res);
  let user = {
    userName: req.body.user.username,
    email: req.body.user.email,
    password: req.body.user.password,
    settings: {
      country: req.body.user.settings.country,
      locale: req.body.user.settings.locale ?? 'en',
    },
  };
  if (!user.userName || !user.email || !user.password || !user.settings.country) {
    res.status(400);
    return res.json({ error: 'username, email and password and country are required' });
  }
  createUser(user)
    .then(function () {
      res.status(201);
      res.json({ type: 'CONFIRM_MAIL' });
    })
    .catch(function (err) {
      if (err.statusCode < 500) {
        res.status(err.statusCode || 422);
        res.json({ error: err.message ?? 'INVALID_REQUEST' });
      } else {
        logger.logError(err, { context: 'user_creation', userName: user.userName });
        res.sendStatus(500);
      }
    });
}

/*
General handler for errors. Essentially return no information but an error code and log the error. 
The front end will have to provide generic error handling.
*/
function handleError(res, statusCode = 500) {
  return function (err) {
    const status = err.status || err.statusCode || statusCode;
    if (status < 500) {
      logger.warn('Request error (client side)', { error: err.message, status });
    } else {
      logger.logError(err, { context: 'server_error', status });
    }
    res.sendStatus(status);
  };
}
