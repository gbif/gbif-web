import config from '#/config';
import logger from '#/logger';
import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';
import { createGitHubIssue } from '../helpers/create-github-issue';
import { RequiredEmailSchema, RequiredStringSchema } from '../validation';
import { createMarkdown } from './create-markdown';

const Schema = {
  body: z.object({
    person_name: RequiredStringSchema,
    email: RequiredEmailSchema,
    installation_name: RequiredStringSchema,
    description: z.string().max(2000).optional(),
    participantTitle: z.string(),
    participantCountry: z.string(),
    type: z.enum([
      'National_installation',
      'Thematic_node_installation',
      'Regional_installation',
      'Group_installation',
    ]),
    group_publisher_description: z.string().max(2000).optional(),
    Mode_of_operation: z.enum(['publishing', 'conversion_only']),
    content_providers: z.string().max(2000).optional(),
    timeline: z.string().max(2000).optional(),
    domain: z.string().optional(),
    have_read_the_service_agreement: z.boolean().default(false),
    will_provide_feedback: z.boolean().default(false),
    will_participate_in_quarterly_webinars: z.boolean().default(false),
    will_ensure_datasets_published_will_remain_online: z
      .boolean()
      .default(false),
  }),
};

export type MdtApplicationDTO = z.infer<typeof Schema['body']>;

export function registerMdtApplicationForm(router: Router) {
  router.post('/mdt-application', validateRequest(Schema), async (req, res) => {
    try {
      await createGitHubIssue({
        owner: config.mdt.owner,
        repo: config.mdt.repository,
        title: req.body.installation_name,
        body: createMarkdown(req.body as MdtApplicationDTO),
        labels: ['REVIEW MANAGER NEEDED'],
      });
      // console.log(createMarkdown(req.body as MdtApplicationDTO));
      res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
      logger.error({
        message: 'Failed to submit "mdt-application" form',
        error,
      });
      console.error(error);
      res.status(500).json({ message: 'Form submission failed' });
    }
  });
}
z;
