import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import passport from 'passport';

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.userName,
    },
    process.env.JWT_SECRET || 'your-jwt-secret',
    { expiresIn: '24h' }
  );
};

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
