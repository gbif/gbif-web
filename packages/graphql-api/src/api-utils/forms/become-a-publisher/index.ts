import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';
import { Router } from 'express';
import {
  OptionalStringSchema,
  RequiredEmailSchema,
  RequiredStringSchema,
} from '../validation';
import { createPublisher } from './create-publisher';
import logger from '#/logger';
import { isAuthenticated } from '../../../middleware';

const ContactSchema = z.object({
  firstName: RequiredStringSchema,
  lastName: RequiredStringSchema,
  email: RequiredEmailSchema,
  phone: OptionalStringSchema,
});

const Schema = {
  body: z.object({
    checkRegistration: z.boolean(),
    termsAndConditions: z.object({
      dataPublishederAgreement: z.boolean(),
      confirmRegistration: z.boolean(),
      dataWillBePublic: z.boolean(),
    }),
    organizationDetails: z.object({
      name: RequiredStringSchema,
      homePage: z.string().url().optional().or(z.literal('')),
      email: z.string().email().optional().or(z.literal('')),
      phone: OptionalStringSchema,
      logo: z.string().url().optional().or(z.literal('')),
      description: RequiredStringSchema,
    }),
    organizationAddress: z.object({
      address: RequiredStringSchema,
      city: RequiredStringSchema,
      province: OptionalStringSchema,
      postalCode: OptionalStringSchema,
      country: RequiredStringSchema,
      coordinates: z.object({
        lat: z.number(),
        lon: z.number(),
      }),
    }),
    endorsingNode: z.string(),
    gbifProjects: z.discriminatedUnion('type', [
      z.object({
        type: z.literal('yes'),
        projectIdentifier: OptionalStringSchema,
      }),
      z.object({ type: z.literal('no') }),
    ]),
    mainContact: ContactSchema,
    extraContacts: z.object({
      administrative: z.boolean().optional(),
      technical: z.boolean().optional(),
    }),
    administrativeContact: ContactSchema.optional(),
    technicalContact: ContactSchema.optional(),
    whatAndHow: z.object({
      resourceMetadata: z.boolean().optional(),
      checklistData: z.boolean().optional(),
      occurrenceOnlyData: z.boolean().optional(),
      samplingEventData: z.boolean().optional(),
      description: RequiredStringSchema,
      serverCapable: z.enum(['yes', 'no']),
      toolPlanned: z.enum(['yes', 'no']),
      doYouNeedHelpPublishing: z.enum(['yes', 'no']),
    }),
  }),
};

export type CreatePublisherDTO = z.infer<typeof Schema['body']>;

export function registerBecomeAPublisherForm(router: Router) {
  router.post(
    '/become-a-publisher',
    isAuthenticated,
    validateRequest(Schema),
    async (req, res) => {
      try {
        await createPublisher(req.body);
        res.status(201).json({ success: true });
      } catch (error) {
        logger.error({
          message: 'Failed to create publisher',
          error,
          body: req.body,
        });
        res.status(500).send({ success: false });
      }
    },
  );
}
