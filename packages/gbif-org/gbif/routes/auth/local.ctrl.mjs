import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

dotenv.config();

export function register(app) {
  // Routes
  app.post('/api/user/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (!user) {
        return res.status(401).json({ message: info.message || 'Authentication failed' });
      }

      // Generate token and set it as httpsOnly cookie
      const token = generateToken(user);
      res.cookie('token', token, { httpOnly: true });
      res.json({ user });
    })(req, res, next);
  });
}

// GBIF API authentication
const authenticateGBIF = async (email, password) => {
  try {
    console.log('Authenticating with GBIF API...');
    const response = await fetch('https://registry-api.gbif.org/user/login', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${email}:${password}`).toString('base64'),
        'Content-Type': 'application/json',
      },
    });

    console.log(response);
    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('GBIF authentication error:', error);
    return null;
  }
};

// Passport Local Strategy
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await authenticateGBIF(email, password);
      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);
