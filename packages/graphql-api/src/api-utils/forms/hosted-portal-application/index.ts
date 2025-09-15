import { Router } from 'express';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';
import { createGitHubIssue } from '../helpers/create-github-issue';
import { createMarkdown } from './create-markdown';
import {
  RequiredStringSchema,
  RequiredEmailSchema,
  OptionalStringSchema,
} from '../validation';
import logger from '#/logger';
import config from '#/config';
import { isAuthenticated } from '../../../middleware';

const Schema = {
  body: z.object({
    primaryContact: z.object({
      name: RequiredStringSchema,
      email: RequiredEmailSchema,
      github: OptionalStringSchema,
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
    isAuthenticated,
    validateRequest(Schema),
    async (req, res) => {
      try {
        await createGitHubIssue({
          owner: config.hostedPortals.owner,
          repo: config.hostedPortals.repository,
          title: req.body.hostedPortalName,
          body: createMarkdown(req.body),
        });
        res.status(201).json({ success: true });
      } catch (error) {
        logger.error({
          message: 'Failed to submit "hosted-portal-application" form',
          error,
        });
        res.status(500).send({ success: false });
      }
    },
  );
}
