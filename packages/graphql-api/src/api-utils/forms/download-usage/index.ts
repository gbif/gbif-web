import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';
import { Router } from 'express';
import { OptionalStringSchema, RequiredStringSchema } from '../validation';
import logger from '@/logger';
import config from '@/config';
import { isAuthenticated } from '@/middleware';
import { authenticatedRequest } from '../helpers/gbifAuthRequest';

const PUBLICATION_TYPES = [
  'JOURNAL_ARTICLE',
  'BOOK',
  'BOOK_CHAPTER',
  'CONFERENCE_PAPER_PROCEEDINGS',
  'PREPRINT_WORKING_PAPER',
  'REPORT',
  'WEB_PAGE',
  'THESIS_DISSERTATION',
  'COURSE_TEACHING_MATERIALS',
  'MAGAZINE_ARTICLE',
  'STATUTE',
  'PATENT',
  'NEWSPAPER_ARTICLE',
  'SOFTWARE_COMPUTER_PROGRAM',
  'HEARING',
  'TELEVISION_BROADCAST',
  'ENCYCLOPEDIA_ARTICLE',
  'CASE',
  'FILM',
  'BILL',
  'OTHER',
] as const;

const Schema = {
  body: z.object({
    downloadKey: RequiredStringSchema,
    doi: OptionalStringSchema,
    title: RequiredStringSchema,
    type: z.enum(PUBLICATION_TYPES),
    authors: RequiredStringSchema,
    link: z.string().url().optional().or(z.literal('')),
    date: RequiredStringSchema,
    comments: OptionalStringSchema,
  }),
};

export type DownloadUsageDTO = z.infer<typeof Schema['body']>;

export function registerDownloadUsageForm(router: Router) {
  router.post(
    '/download-usage',
    isAuthenticated,
    validateRequest(Schema),
    async (req, res) => {
      try {
        const payload: DownloadUsageDTO = req.body;

        // Submit to GBIF API
        // Note: The actual GBIF API endpoint may need to be adjusted based on the final API design
        const response = await authenticatedRequest({
          method: 'POST',
          url: `${config.apiv1}/occurrence/download/${payload.downloadKey}/usage`,
          canonicalPath: `occurrence/download/${payload.downloadKey}/usage`,
          body: {
            title: payload.title,
            type: payload.type,
            authors: payload.authors,
            link: payload.link || undefined,
            date: payload.date,
            comments: payload.comments || undefined,
            ...(payload.doi && { doi: payload.doi }),
          },
        });

        res.status(201).json({
          message: 'Usage report submitted successfully',
          data: response,
        });
      } catch (error) {
        logger.error({
          message: 'Failed to submit download usage report',
          error,
          downloadKey: req.body.downloadKey,
        });
        res.status(500).json({
          message: 'Failed to submit usage report',
        });
      }
    },
  );
}
