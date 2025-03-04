import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import passport from 'passport';

dotenv.config();

const useSecureCookie = process.env.USE_SECURE_COOKIE !== 'false';
const minute = 60000;
const hour = 60 * minute;
const day = 24 * hour;

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
  return jwt.sign(tokenContent, process.env.JWT_SECRET || 'your-jwt-secret', {
    expiresIn: ttl || '24h',
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
    sameSite: useSecureCookie,
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
    httpOnly: false,
    sameSite: useSecureCookie,
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
    let user = await User.find(findQuery);
    if (!user) {
      throw new Error('Recieved empty response from API');
    }
    return user;
  } catch (err) {
    if (err.statusCode == 204) {
      // if not found by provider id, then the user hasn't commected.
      // But we might be able to find the user by email instead.
      let profileEmail = getFirstVerifiedEmail(profile);
      if (!profileEmail) {
        throw new LoginError('No verified email in profile');
      }
      return User.getByUserName(profileEmail.value);
    } else {
      log.error(err);
      throw err;
    }
  }
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
