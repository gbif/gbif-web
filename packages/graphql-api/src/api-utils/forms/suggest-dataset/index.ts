import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';
import { Router } from 'express';
import { OptionalStringSchema, RequiredStringSchema } from '../validation';
import { createGitHubIssue } from '../helpers/create-github-issue';
import logger from '#/logger';
import { createMarkdown } from './create-markdown';
import config from '#/config';

const Schema = {
  body: z.object({
    title: RequiredStringSchema,
    datasetLink: z.string().url().optional().or(z.literal('')),
    region: RequiredStringSchema,
    taxon: RequiredStringSchema,
    datasetImportance: OptionalStringSchema,
    priority: z.enum(['high', 'medium', 'low']).optional(),
    datasetBibliographicDoi: z.string().url().optional().or(z.literal('')),
    type: z.enum([
      'undefined',
      'OCCURRENCE',
      'CHECKLIST',
      'SAMPLING_EVENT',
      'METADATA',
    ]),
    license: z.enum([
      'CC0_1_0',
      'CC_BY_4_0',
      'CC_BY_NC_4_0',
      'UNSPECIFIED',
      'UNSUPPORTED',
    ]),
    datasetHolderContact: OptionalStringSchema,
    userContact: OptionalStringSchema,
    comments: OptionalStringSchema,
  }),
};

export type SuggestDatasetDTO = z.infer<typeof Schema['body']>;

export function registerSuggestDatasetForm(router: Router) {
  router.post('/suggest-dataset', validateRequest(Schema), async (req, res) => {
    try {
      const issue = await createGitHubIssue({
        owner: config.suggestDataset.owner,
        repo: config.suggestDataset.repository,
        title: req.body.title,
        body: createMarkdown(req.body),
      });
      res.status(201).json({
        message: 'From submitted succesfully',
        link: issue?.html_url,
      });
    } catch (error) {
      logger.error({
        message: 'Failed to submit "suggest-dataset" form',
        error,
      });
      res.status(500).json({ message: 'From submitted succesfully' });
    }
  });
}
