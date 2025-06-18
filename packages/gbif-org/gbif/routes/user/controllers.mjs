import { generateToken, removeTokenCookie, setTokenCookie } from '../auth/utils.mjs';
import {
  confirm as confirmUser,
  getClientUser,
  resetPassword as resetUserPassword,
  updateForgottenPassword,
} from './user.model.mjs';

const log = console; // TODO: Replace with proper logging mechanism

/**
 * Gets the user associated with the token in the cookie
 */
export function whoAmI(req, res) {
  try {
    if (!req.user) {
      return res.sendStatus(204);
    }
    const user = getClientUser(req.user);
    res.json({ user });
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
    log.error('Password reset error:', error);
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
      let token = generateToken(user, '7d'); // Generate token with a 7-day expiration
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

/*
General handler for errors. Essentially return no information but an error code and log the error. 
The front end will have to provide generic error handling.
*/
function handleError(res, statusCode = 500) {
  return function (err) {
    const status = err.status || err.statusCode || statusCode;
    if (status < 500) {
      log.warn(err);
    } else {
      log.error(err);
    }
    res.sendStatus(status);
  };
}
