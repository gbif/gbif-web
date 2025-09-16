import jwt from 'jsonwebtoken';
import NodeCache from 'node-cache';
import config from '#/config';
import { authenticatedGet } from './authenticatedGet';

// users are cached for 30 seconds
const userCache = new NodeCache({ stdTTL: 30, checkperiod: 40 });

const { jwtSecret } = config;

/**
 * Fetch user by username from the registry API
 * @param {string} userName
 * @param {object} config
 */
export async function getUserByUserName(userName) {
  try {
    const response = await authenticatedGet({
      canonicalPath: `admin/user/${userName}`,
      config,
      query: {},
    });
    return response;
  } catch (error) {
    return null;
  }
}

/**
 * Attach user based on various authentication schemes Basic, Bearer, ApiKey
 * @param {string} authorization
 * @param {object} config
 */
async function resolveUser(authorization) {
  const [type, value] = authorization.split(' ');
  switch (type) {
    case 'Bearer':
      try {
        // Verify JWT token
        const decoded = jwt.verify(value, jwtSecret, {
          algorithms: ['HS256'],
        });

        if (decoded.userName) {
          // Fetch user from registry API
          const user = await getUserByUserName(decoded.userName);
          return user;
        }
        return null;
      } catch (error) {
        return null;
      }
    default:
      return undefined;
  }
}

async function extractUser(authorization) {
  if (typeof authorization !== 'string' || authorization === '')
    return undefined;

  const storedUser = userCache.get(authorization);
  if (storedUser) return storedUser;

  const user = await resolveUser(authorization);
  userCache.set(authorization, user);
  return user;
}

export default extractUser;
