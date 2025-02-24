import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config();

export function register(app) {
  // Google OAuth routes
  app.get('/auth/google/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      const token = generateToken(req.user);
      // Redirect to frontend with token
      res.cookie('token', token, { httpOnly: true });
      // Redirect to the profile page /user/profile
      res.redirect('/user/profile');
    }
  );
}

// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Here you would typically:
      // 1. Check if user exists in your database
      // 2. Create user if they don't exist
      // 3. Return user object
      return done(null, profile);
    }
  )
);
