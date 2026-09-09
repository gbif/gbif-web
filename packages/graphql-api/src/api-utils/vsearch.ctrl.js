import axios from 'axios';
import { Router } from 'express';
import { isbot } from 'isbot';
import VsearchParser from '../helpers/vsearch/vsearchParser';
import config from '../config';

const router = Router();

/**
 * Response format:
 * {
    "query id": "search",
    "target id": "e03e0fceb4f77999cebb42dee6af5b27",
    "identity": 99.9,
    "target length": 862,
    "alignment": " Query 905nt >search\nTarget 862nt >e03e0fceb4f77999cebb42dee6af5b27\n\nQry  23 + AAGTCGTAACAAGGTTTCCGTAGGTGAACCTGCGGAAGGATCA......... ",
    "alignmentLength": 863,
    "accession": "",
    "scientificName": "",
    "qcovs": 95.4
  }
 *
 * "target id" will be searchable in occurrence search as nucleotideSequence.nucleotideSequenceID in ES / APIv1
 */

const { sanitizeSequence, vsearchResultToJson, vsearchResultToJsonWithAligment } = new VsearchParser({
  MATCH_THRESHOLD: 99,
  MATCH_CLOSE_THRESHOLD: 97,
});

// The upstream vsearch server rejects sequences longer than its max_sequence_length.
// Guard here (on the sanitized sequence we forward) to fail fast with a clear message
// instead of passing an oversized query through.
const MAX_SEQUENCE_LENGTH = 2048;

export default (app) => {
  app.use('/unstable-api', router);
};

router.get('/vsearch', async (req, res) => {
  const userAgent = req.get('user-agent');
  const itIsABot = isbot(userAgent);
  if (itIsABot) {
    return res
      .status(418)
      .send('Thirdparty endpoints are not available ;for bots to avoid overloading external services.');
  }
  const { sequence, outfmt } = req.query;
  if (!config?.vsearch?.occurrence) {
    console.log('Vsearch server not configured');
    res.sendStatus(501);
    return;
  }
  if (!sequence) {
    res.sendStatus(400);
    return;
  }
  const sanitizedSequence = sanitizeSequence(sequence);

  if (sanitizedSequence.length > MAX_SEQUENCE_LENGTH) {
    return res
      .status(400)
      .send(`Sequence exceeds the maximum length of ${MAX_SEQUENCE_LENGTH}.`);
  }

  const response = await axios.get(
    `${config?.vsearch?.occurrence}?sequence=${sanitizedSequence}&outfmt=${outfmt || 'alnout'}`,
  );
  if (response.status !== 200) {
    throw response;
  }

  try {
    const { data } = response;
    const vsearchJson =
      outfmt === 'blast6out'
        ? vsearchResultToJson(data, { search: sanitizedSequence })
        : vsearchResultToJsonWithAligment(data, { search: sanitizedSequence });
    res.json(vsearchJson);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
