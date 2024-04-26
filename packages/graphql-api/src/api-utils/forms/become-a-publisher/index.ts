import { z } from 'zod';
import {
  OptionalStringSchema,
  RequiredEmailSchema,
  RequiredStringSchema,
} from '../validation';
import { validateRequest } from 'zod-express-middleware';
import { Router } from 'express';

const ContactSchema = z.object({
  firstName: RequiredStringSchema,
  lastName: RequiredStringSchema,
  email: RequiredEmailSchema,
  phone: OptionalStringSchema,
});

const Schema = {
  body: z.object({
    myOrganizationInNotAPublisher: z.boolean(),
    termsAndConditions: z.object({
      dataPublishederAgreement: z.boolean(),
      confirmRegistration: z.boolean(),
      dataWillBePublic: z.boolean(),
    }),
    organizationDetails: z.object({
      name: RequiredStringSchema,
      homePage: z.string().url().optional(),
      email: z.string().email().optional(),
      phone: OptionalStringSchema,
      address: RequiredStringSchema,
      city: RequiredStringSchema,
      province: OptionalStringSchema,
      postalCode: OptionalStringSchema,
      country: RequiredStringSchema,
      logo: z.string().url().optional(),
      description: RequiredStringSchema,
      coordinates: z.object({
        lat: z.number(),
        lon: z.number(),
      }),
    }),
    endorsingNode: z.object({
      type: z.enum(['help_me_with_endorsement', 'marine_data_publishers']),
      organization: z.object({ id: z.string(), name: z.string() }),
    }),
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
      externalServer: z.enum(['yes', 'no']),
      planningToUsePublishingSoftware: z.enum(['yes', 'no']),
      needHelp: z.enum(['yes', 'no']),
    }),
  }),
};

export function registerBecomeAPublisherForm(router: Router) {
  router.post(
    '/become-a-publisher',
    validateRequest(Schema),
    async (req, res) => {
      console.log(req.body);

      try {
        res.status(200).send({ success: true });
      } catch (error) {
        res.status(500).send({ success: false, error });
      }
    }
  );
}