import axios from 'axios';
import { Router } from 'express';
import ip3country from 'ip3country';
import config from '../config';

const router = Router();
ip3country.init();
const minute = 60;
const translationEndpoint = config.translations || 'https://react-components.gbif.org/lib/translations';

export default (app) => {
  app.use('/unstable-api', router);
};

// x-forwarded-for is a comma separated list ("client, proxy1, proxy2"), and may include a port or
// an IPv4-mapped IPv6 prefix. Only the first entry is the original client.
function getClientIP(req) {
  const forwarded = req.header('x-forwarded-for');
  let ip = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;
  if (!ip) return ip;
  ip = ip.replace(/^::ffff:/i, '');
  // strip port from "1.2.3.4:5678" (but leave IPv6 untouched)
  if (/^\d+\.\d+\.\d+\.\d+:\d+$/.test(ip)) ip = ip.split(':')[0];
  return ip;
}

router.get('/user-info', async (req, res, next) => {
  const { lang } = req.query; // Extract the "lang" query parameter from the URL.
  const clientIP = getClientIP(req);

  // The response depends on the caller's IP, so it must never be shared by a CDN/proxy.
  res.setHeader('Vary', 'X-Forwarded-For');

  // Check if the IP address is "localhost" or "127.0.0.1" and handle it
  if (clientIP === '::1' || clientIP === '127.0.0.1') {
    res.setHeader('Cache-Control', 'no-store');
    return res.json({ country: null, error: 'Localhost' });
  }

  // Get the country code for the client's IP address
  try {
    const countryCode = ip3country.lookupStr(clientIP);
    // Short browser-only cache, so switching network/VPN is picked up quickly
    res.setHeader('Cache-Control', `private, max-age=${minute}`);
    if (countryCode) {
      const translation = {};
      let countryName;

      // get the country name for the given language code
      if (lang) {
        countryName = await getCountryName(lang, countryCode);
      }
      // if no language code is provided or it doesn't exist, get the country name in English
      if (!countryName) {
        countryName = await getCountryName('en', countryCode);
      }
      if (!countryName) {
        translation.translationError = 'Unable to find a translation for that language code and language';
      } else {
        translation.countryName = countryName;
      }
      res.json({ country: countryCode, ...translation });
    } else {
      res.json({ country: null, error: 'No country code found' });
    }
  } catch (err) {
    res.setHeader('Cache-Control', 'no-cache');
    res.status(500).json({ country: null, error: 'Internal Server Error' });
  }
});

// get translation for a given language code
async function getCountryName(lang, countryCode) {
  const apiUrl = `${translationEndpoint}/${lang}.json`;
  try {
    const response = await axios.get(apiUrl);
    const countryName = response.data[`enums.countryCode.${countryCode}`];
    return countryName;
  } catch (error) {
    return null;
  }
}
