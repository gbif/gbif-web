import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import logger from '../../config/logger.mjs';
import { getByUserName, getClientUser } from '../user/user.model.mjs';
import { disableCache, generateToken, setNoCache, setTokenCookie } from './utils.mjs';

dotenv.config();

export function register(app) {
  // on any get or post to routes strting with /auth/ disable caching
  app.use('/auth', disableCache);

  // Routes
  app.post('/auth/basic/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).json({ messageId: 'SERVER_ERROR' });
      }
      if (!user) {
        return res.status(401).json({ messageId: 'AUTH_ERROR' });
      }
      getByUserName(user.userName)
        .then((user) => {
          if (user) {
            const clientUser = getClientUser(user);
            const token = generateToken(clientUser);
            setTokenCookie(res, token);
            setNoCache(res); // is set at parent route, but just in case

            res.json({ user: clientUser });
          } else {
            // we should never get here since the user exists
            return res.status(500).json({ messageId: 'SERVER_ERROR' });
          }
        })
        .catch((err) => {
          logger.logError(err, { context: 'basic_login', userName: user.userName });
          res.status(500).json({ messageId: 'SERVER_ERROR' });
        });
    })(req, res, next);
  });
}

// GBIF API authentication
const authenticateGBIF = async (email, password) => {
  try {
    const response = await fetch(`${process.env.REGISTRY_API_V1}/user/login`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${email}:${password}`).toString('base64'),
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      return null;
    } else if (!response.ok) {
      throw new Error('UNHANDLED_ERROR');
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    logger.logError(error, { context: 'gbif_authentication', email });
    throw new Error('UNHANDLED_ERROR');
  }
};

// Passport Local Strategy
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await authenticateGBIF(email, password);
      if (!user) {
        return done(null, false, { messageId: 'AUTH_ERROR' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);
