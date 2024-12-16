/* eslint-disable */
import { Router } from 'express';
import axios from 'axios';
import parseNexus from './parseNexus.js';
const router = Router();

export default (app) => {
    app.use('/unstable-api', router);
  };

router.get('/source-archive/:datasetKey/phylogeny/:fileName', async (req, res, next) => {
    try {
        const {datasetKey, fileName} = req?.params
        const fileExtension = (fileName || "").split('.').pop()
        const nexExtensions = ['nex', 'nexus']
        const nwkExtensions = ['phy', 'nwk', 'newick', 'tree']

        if(![...nexExtensions, ...nwkExtensions].includes(fileExtension)){
          res.sendStatus(415) //unsupported
        } else {
        let nwk, tipTranslation;
        const url = "https://source-archive.gbif.org/"
        const file = await axios(`${url}/${datasetKey}/${fileName}`)
        if (['nex', 'nexus'].includes(fileExtension)) {
          var parsedNexus = parseNexus(file.data);
              nwk = parsedNexus?.treesblock?.trees?.[0]?.newick;
              tipTranslation = parsedNexus?.treesblock?.translate;
          } else if (['phy', 'nwk', 'newick', 'tree'].includes(fileExtension)) {
              nwk = file.data;
              tipTranslation = null
          } 
        res.json({nwk, tipTranslation})
        }
    } catch (error) {
      res.sendStatus(error?.response?.status || 500)
    }
  });