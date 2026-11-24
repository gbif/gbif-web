import path from 'node:path';
import { BUILD_INFO_FILE } from '../config/buildInfo.mjs';

// Cache-Control for the static client build, used as express.static's setHeaders. It has to be set
// there: the default Cache-Control middleware in server.js has already set the header, and send()
// only applies its own maxAge/immutable options when none is present.
// - Content-hashed files in assets/ are kept across releases on the host, so cache them forever.
// - build-info.json changes with every deploy and is used to check what is deployed, so it gets a
//   short cache: fresh within half a minute of a deploy, but cheap if something polls it.
// - Everything else (index.html, fallback.html, ...) keeps the default.
export function createStaticHeaders(clientDir) {
  const assetsDir = path.join(clientDir, 'assets') + path.sep;
  const buildInfoFile = path.join(clientDir, BUILD_INFO_FILE);
  return (res, filePath) => {
    if (filePath.startsWith(assetsDir)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (filePath === buildInfoFile) {
      res.setHeader('Cache-Control', 'public, max-age=30');
    }
  };
}
