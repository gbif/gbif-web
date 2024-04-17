import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { CreateIssueArgs, createGitHubIssue } from "./create-github-issue";
import { createMarkdown } from "./create-markdown";
import { RequiredStringSchema, RequiredEmailSchema, OptionalStringSchema } from "../validation";

export const Schema = {
  body: z.object({
    primaryContact: z.object({
      name: RequiredStringSchema,
      email: RequiredEmailSchema,
    }),
    hostedPortalName: RequiredStringSchema,
    applicationType: z.discriminatedUnion('type', [
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
    ]),
    nodeContact: z.discriminatedUnion('type', [
      z.object({ type: z.literal('I_am_the_node_manager') }),
      z.object({
        type: z.literal('Node_manager_contacted'),
        nodeManager: RequiredStringSchema,
      }),
      z.object({ type: z.literal('No_contact_to_node_manager') }),
    ]),
    nodeManager: OptionalStringSchema,
    dataScope: RequiredStringSchema,
    userGroup: RequiredStringSchema,
    timelines: OptionalStringSchema,
    languages: RequiredStringSchema,
    experience: z.enum([
      'has_plenty_experience',
      'has_limited_experience',
      'has_no_experience',
    ]),
    termsAccepted: z.literal(true),
  }),
};

export type Inputs = z.infer<typeof Schema['body']>;

export function registerHostedPortalApplication(router: Router) {
  router.post(
    '/hosted-portal-application',
    validateRequest(Schema),
    async (req, res) => {
      const issueArgs: CreateIssueArgs = {
        owner: 'danielvdm2000',
        repo: 'github-api-test',
        title: req.body.hostedPortalName,
        body: createMarkdown(req.body),
        token:
          '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',
      };

      try {
        await createGitHubIssue(issueArgs);
        res.status(200).json({ message: 'From submitted succesfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to submit form' });
      }
    },
  );
}