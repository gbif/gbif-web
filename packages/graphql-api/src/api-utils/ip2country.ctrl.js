import { Router } from 'express';
import ip3country from 'ip3country';
const router = Router();
ip3country.init();

export default (app) => {
  app.use('/unstable-api/ip', router);
};

router.get('/get-country', (req, res, next) => {
  const clientIP = req.ip;

  // Check if the IP address is "localhost" or "127.0.0.1" and handle it
  if (clientIP === '::1' || clientIP === '127.0.0.1') {
    res.json({ country: 'unknown' });
    return;
  }

  // Get the country code for the client's IP address
  try {
    const countryCode = ip3country.lookupStr(clientIP);
    if (countryCode) {
      res.json({ country: countryCode });
    } else {
      res.json({ country: 'unknown' });
    }
  } catch(err) {
    res.status(500).json({ country: 'unknown', error: 'Internal Server Error' });
  }
});