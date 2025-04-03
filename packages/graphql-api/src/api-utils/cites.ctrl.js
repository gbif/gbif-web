import axios from 'axios';
import { Router } from 'express';
import { isbot } from 'isbot';
import _ from 'lodash';
import config from '../config';

const router = Router();

export default (app) => {
  app.use('/unstable-api', router);
};

router.get('/cites/:kingdom/:name', async (req, res) => {
  const userAgent = req.get('user-agent');
  const itIsABot = isbot(userAgent);
  if (itIsABot) {
    return res
      .status(418)
      .send(
        'Thirdparty endpoints are not available for bots to avoid overloading external services.',
      );
  }

  const { name } = req.params;
  const { kingdom } = req.params;

  try {
    const data = await getCitesStatus(name);
    if (data.pagination.total_entries > 0) {
      // just to have some assurance that it is in fact the same species we are talking about since we only match on canonical name
      const matchedTaxon = _.find(data.taxon_concepts, (e) => {
        // ['higher_taxa.kingdom', kingdom]
        return (
          _.get(e, 'higher_taxa.kingdom', '').toLowerCase() ===
          kingdom.toLowerCase()
        );
      });
      if (matchedTaxon) {
        return res.status(200).json({
          ...matchedTaxon,
          _reference: `https://speciesplus.net/#/taxon_concepts/${matchedTaxon.id}/legal`,
        });
      }
    }
    // no entries found or it didn't match kingdom
    res.status(404).send('No entry found');
  } catch (err) {
    res.status(err.statusCode || 500);
    res.send('unable to process');
  }
});

async function getCitesStatus(name) {
  const response = await axios.get(`${config.cites.api}?name=${name}`, {
    headers: { 'X-Authentication-Token': config.cites.token },
  });
  if (response.status !== 200) {
    throw response;
  }

  return response.data;
}
