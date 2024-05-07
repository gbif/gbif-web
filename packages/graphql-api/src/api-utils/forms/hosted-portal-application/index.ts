import { Router } from 'express';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';
import {
  CreateIssueArgs,
  createGitHubIssue,
} from '../helpers/create-github-issue';
import { createMarkdown } from './create-markdown';
import {
  RequiredStringSchema,
  RequiredEmailSchema,
  OptionalStringSchema,
} from '../validation';
import logger from '#/logger';

const Schema = {
  body: z.object({
    primaryContact: z.object({
      name: RequiredStringSchema,
      email: RequiredEmailSchema,
    }),
    hostedPortalName: RequiredStringSchema,
    applicationType: z.discriminatedUnion(
      'type',
      [
        z.object({
          type: z.literal('National_portal'),
          participantNode: z.object({
            name: RequiredStringSchema,
            countryCode: RequiredStringSchema,
          }),
        }),
        z.object({
          type: z.literal('Other_type_of_portal'),
          publisherDescription: RequiredStringSchema,
        }),
      ],
      {
        required_error: 'validation.mustSelectOneOption',
        invalid_type_error: 'validation.mustSelectOneOption',
      },
    ),
    nodeContact: z.discriminatedUnion(
      'type',
      [
        z.object({ type: z.literal('I_am_the_node_manager') }),
        z.object({
          type: z.literal('Node_manager_contacted'),
          nodeManager: RequiredStringSchema,
        }),
        z.object({ type: z.literal('No_contact_to_node_manager') }),
      ],
      {
        required_error: 'validation.mustSelectOneOption',
        invalid_type_error: 'validation.mustSelectOneOption',
      },
    ),
    nodeManager: OptionalStringSchema,
    dataScope: RequiredStringSchema,
    userGroup: RequiredStringSchema,
    timelines: OptionalStringSchema,
    languages: RequiredStringSchema,
    experience: z.enum(
      ['has_plenty_experience', 'has_limited_experience', 'has_no_experience'],
      {
        required_error: 'validation.mustSelectOneOption',
        invalid_type_error: 'validation.mustSelectOneOption',
      },
    ),
    termsAccepted: z.literal(true, {
      invalid_type_error: 'validation.mustAcceptTerms',
      required_error: 'validation.mustAcceptTerms',
    }),
  }),
};

export type HostedPortalApplicationDTO = z.infer<typeof Schema['body']>;

export function registerHostedPortalApplicationForm(router: Router) {
  router.post(
    '/hosted-portal-application',
    validateRequest(Schema),
    async (req, res) => {
      try {
        const issueArgs: CreateIssueArgs = {
          owner: 'danielvdm2000',
          repo: 'github-api-test',
          title: req.body.hostedPortalName,
          body: createMarkdown(req.body),
          token:
            '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',
        };

        await createGitHubIssue(issueArgs);
        res.status(200).json({ message: 'From submitted succesfully' });
      } catch (error) {
        logger.error({ message: 'Failed to submit "hosted-portal-application" form', error });
        res.status(200).json({ message: 'From submitted succesfully' });
      }
    },
  );
}
