import { z } from 'zod';
import { OptionalStringSchema, RequiredStringSchema } from '../validation';
import { validateRequest } from 'zod-express-middleware';
import { Router } from 'express';
import { CreateIssueArgs, createGitHubIssue } from '../helpers/create-github-issue';
import logger from '#/logger';
import { createMarkdown } from './create-markdown';

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
      'CC0 1.0',
      'CC-BY 4.0',
      'CC-BY-NC 4.0',
      'Unspecified',
      'Not open',
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
      const issueArgs: CreateIssueArgs = {
        owner: 'danielvdm2000',
        repo: 'github-api-test',
        title: req.body.title,
        body: createMarkdown(req.body),
        token:
          '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',
      };

      await createGitHubIssue(issueArgs);
      res.status(200).json({ message: 'From submitted succesfully' });
    } catch (error) {
      logger.error({ message: 'Failed to submit "suggest-dataset" form', error });
      res.status(200).json({ message: 'From submitted succesfully' });
    }
  });
}