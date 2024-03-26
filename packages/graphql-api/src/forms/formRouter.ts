import express from "express";
import { z } from "zod";

const formRouter = express.Router();

const RequiredStringSchemaFn = () => z.string().min(1, 'This field is required');
const RequiredEmailSchemaFn = () => RequiredStringSchemaFn().email('This is not a valid email');
const OptionalStringSchemaFn = () => z.string().optional();

// This is a function so we can inject the selected language for data validation
const HostedPortalApplicationFormSchemaFn = () => z.object({
  body: z.object({
    primaryContact: z.object({
      name: RequiredStringSchemaFn(),
      email: RequiredEmailSchemaFn(),
    }),
    hostedPortalName: RequiredStringSchemaFn(),
    applicationType: z.discriminatedUnion('type', [
      z.object({ type: z.literal('National_portal'), participantNode: RequiredStringSchemaFn() }),
      z.object({ type: z.literal('Other_type_of_portal'), publisherDescription: RequiredStringSchemaFn() }),
    ]),
    nodeContact: z.discriminatedUnion('type', [
      z.object({ type: z.literal('I_am_the_node_manager') }),
      z.object({ type: z.literal('Node_manager_contacted'), nodeManager: RequiredStringSchemaFn() }),
      z.object({ type: z.literal('No_contact_to_node_manager') }),
    ]),
    nodeManager: OptionalStringSchemaFn(),
    dataScope: RequiredStringSchemaFn(),
    userGroup: RequiredStringSchemaFn(),
    timelines: OptionalStringSchemaFn(),
    languages: RequiredStringSchemaFn(),
    experience: z.enum(['has_plenty_experience', 'has_limited_experience', 'has_no_experience']),
    termsAccepted: z.literal(true),
  })
})

formRouter.post('/hosted-portal-application-form', (req, res) => {
  const result = HostedPortalApplicationFormSchemaFn().safeParse(req);
  if (!result.success) {
    res.status(400).json({ errors: result.error.errors });
    return;
  }

  const { body } = result.data;

  


})