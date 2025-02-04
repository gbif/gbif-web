import axios from 'axios';
import { Router } from 'express';
import ip3country from 'ip3country';
import config from '../config';

const router = Router();
ip3country.init();
const minute = 60;
const translationEndpoint =
  config.translations || 'https://react-components.gbif.org/lib/translations';

export default (app) => {
  app.use('/unstable-api', router);
};

router.get('/user-info', async (req, res, next) => {
  const lang = req.query.lang; // Extract the "lang" query parameter from the URL.
  const clientIP = req.header('x-forwarded-for') || req.socket.remoteAddress;

  // Check if the IP address is "localhost" or "127.0.0.1" and handle it
  if (clientIP === '::1' || clientIP === '127.0.0.1') {
    return res.json({ country: null, error: 'Localhost' });
  }

  // Get the country code for the client's IP address
  try {
    const countryCode = ip3country.lookupStr(clientIP);
    res.setHeader('Cache-Control', 'private, max-age=' + 10 * minute);
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
        translation.translationError =
          'Unable to find a translation for that language code and language';
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
