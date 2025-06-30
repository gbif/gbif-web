import dotenv from 'dotenv';
import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { getByUserName, getClientUser } from '../user/user.model.mjs';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const useSecureCookie = process.env.USE_SECURE_COOKIE !== 'false';
const minute = 60000;
const hour = 60 * minute;
const day = 24 * hour;

const JWT_SECRET = process.env.JWT_SECRET;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Generate JWT token
export const generateToken = (user, ttl) => {
  const tokenContent = {
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  if (user.roles) {
    tokenContent.roles = JSON.stringify(user.roles);
  }
  return jwt.sign(tokenContent, JWT_SECRET, {
    expiresIn: ttl || '24h',
    algorithm: 'HS256',
  });
};

/**
 * Sets the token as a secure cookie
 */
export function setTokenCookie(res, token) {
  let options = {
    maxAge: day * 7,
    secure: useSecureCookie,
    httpOnly: true,
    sameSite: 'lax',
  };
  res.cookie('token', token, options);
}

/**
 * Remove token cookie
 */
export function removeTokenCookie(res) {
  let options = {
    maxAge: 1,
    secure: useSecureCookie,
    httpOnly: true,
    sameSite: 'lax',
  };
  res.cookie('token', '', options);
}

/**
 * Don't cache anything if it is an authorized endpoint
 */
export function setNoCache(res) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  res.header('Surrogate-Control', 'no-store');
}

export function logUserIn(res, user) {
  let clientUser = getClientUser(user);
  let token = generateToken(clientUser);
  setTokenCookie(res, token);
  setNoCache(res);
}

export async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.status >= 500) throw new Error(`HTTP error! Status: ${response.status}`);
      return response;
    } catch (error) {
      if (attempt < retries) {
        // failed attempt. retry in delay ms
        console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw new Error(`Fetch failed after ${retries} attempts: ${error.message}`);
      }
    }
  }
}

const validateJwt = expressjwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'], // Algorithm used to sign the JWT
  getToken: (req) => req.cookies.token, // Extract token from cookies
});

export function appendUser(req, res, next) {
  try {
    setNoCache(res);
    validateJwt(req, res, function () {
      if (req?.auth?.userName) {
        getByUserName(req.auth.userName)
          .then((user) => {
            if (user) {
              req.user = user;
            } else {
              removeTokenCookie(res);
              delete req.user;
            }
            next();
          })
          .catch(function (err) {
            removeTokenCookie(res);
            delete req.user;
            next();
          });
      } else {
        removeTokenCookie(res);
        delete req.user;
        next();
      }
    });
  } catch (err) {
    delete req.user;
    delete req.auth;
    removeTokenCookie(res);
    next();
  }
}

function invalidOrNoToken(req, res) {
  removeTokenCookie(res);
  delete req.user;
  delete req.auth;
  res.status(403);
  return res.json({ message: 'INVALID' });
}
/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated(req, res, next) {
  try {
    setNoCache(res);
    validateJwt(req, res, function () {
      if (req?.auth?.userName) {
        getByUserName(req.auth.userName)
          .then((user) => {
            if (user) {
              req.user = user;
              next();
            } else {
              return invalidOrNoToken(req, res);
            }
          })
          .catch(function (err) {
            return invalidOrNoToken(req, res);
          });
      } else {
        return invalidOrNoToken(req, res);
      }
    });
  } catch (err) {
    return invalidOrNoToken(req, res);
  }
}

// Middleware to disable caching
export const disableCache = (req, res, next) => {
  setNoCache(res);
  next();
};
