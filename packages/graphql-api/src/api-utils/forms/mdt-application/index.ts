import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';
import logger from '@/logger';
import config from '@/config';
import isAuthenticated, { AuthRequest } from '@/middleware/auth';
import { createGitHubIssue } from '../helpers/create-github-issue';
import { RequiredEmailSchema, RequiredStringSchema } from '../validation';
import { createMarkdown } from './create-markdown';

const Schema = {
  body: z
    .object({
      person_name: RequiredStringSchema,
      email: RequiredEmailSchema,
      installation_name: RequiredStringSchema,
      description: RequiredStringSchema,
      participant: z.object({
        title: z.string(),
        country: z.string().optional(),
      }),
      Mode_of_operation: z.enum(['publishing', 'conversion_only']),
      content_providers: RequiredStringSchema,
      timeline: z.string().optional(),
      domain: z.string().optional(),
      have_read_the_service_agreement: z.boolean().default(false),
      will_provide_feedback: z.boolean().default(false),
      will_participate_in_quarterly_webinars: z.boolean().default(false),
      will_ensure_datasets_published_will_remain_online: z.boolean().default(false),
    })
    .and(
      z.discriminatedUnion('type', [
        z.object({
          type: z.literal('Group_installation'),
          group_publisher_description: RequiredStringSchema,
        }),
        z.object({ type: z.literal('National_installation') }),
        z.object({ type: z.literal('Thematic_node_installation') }),
        z.object({ type: z.literal('Regional_installation') }),
      ]),
    ),
};

export type MdtApplicationDTO = z.infer<typeof Schema['body']>;

export function registerMdtApplicationForm(router: Router) {
  router.post('/mdt-application', isAuthenticated, validateRequest(Schema), async (req, res) => {
    const userName = (req as AuthRequest).user?.userName;
    try {
      const issue = await createGitHubIssue({
        owner: config.mdt.owner,
        repo: config.mdt.repository,
        title: req.body.installation_name,
        body: createMarkdown(req.body as MdtApplicationDTO),
        labels: ['REVIEW MANAGER NEEDED'],
      });
      logger.info({
        message: 'Submitted "mdt-application" form',
        userName,
        issue: issue?.html_url,
      });
      res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
      logger.error({
        message: 'Failed to submit "mdt-application" form',
        userName,
        error,
      });
      res.status(500).json({ message: 'Form submission failed' });
    }
  });
}
