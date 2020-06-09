const NodeCache = require( "node-cache" );
// users are cached for 30 seconds
const userCache = new NodeCache( { stdTTL: 30, checkperiod: 40 } );

const { authenticatedGet } = require('./authenticatedGet');

async function extractUser(authorization) {
  if (typeof authorization !== 'string' || authorization === '') return undefined;
  
  const storedUser = userCache.get(authorization);
  if (storedUser) {
    return storedUser;
  }

  const user = await resolveUser(authorization);
  userCache.set(authorization, user);
  return user;
}

/**
 * Attach user based on various authentication schemes Basic, Bearer, ApiKey (the idea with introducing ApiKeys is that they are public for a web app)
 * @param {string} authorization 
 */
async function resolveUser(authorization) {
  const [type, value] = authorization.split(' ');
  switch(type) {
    case 'ApiKey-v1':
      return authenticatedGet({
        canonicalPath: 'admin/user/find',
        query: {'auth.facebook.id': value}
      });
    default:
       return undefined
  }
}

module.exports = extractUser;