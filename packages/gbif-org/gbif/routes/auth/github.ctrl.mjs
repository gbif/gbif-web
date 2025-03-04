import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { generateToken } from './utils.mjs';

dotenv.config();

export function register(app) {
  // GitHub OAuth routes
  app.get('/auth/github/login', (req, res, next) => {
    let state = { action: 'LOGIN', target: req.headers.referer || '/' };
    let stateB64 = btoa(JSON.stringify(state));
    passport.authenticate('github', { scope: ['user:email'], state: stateB64 })(req, res, next);
  });

  app.get(
    '/auth/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: '/login' }),
    (req, res) => {
      console.log(req.user);
      console.log(req.query);
      console.log(req.query.state);
      let state = JSON.parse(atob(req.query.state));
      console.log(JSON.stringify(state, null, 2));
      const token = generateToken(req.user);
      // set the token as a cookie
      res.cookie('token', token, { httpOnly: true });
      // Redirect to the profile page /user/profile
      res.redirect('/user/profile');
    }
  );
}

// Passport GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback', // TODO replace with actual domain
      scope: 'user:email',
    },
    async (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);
