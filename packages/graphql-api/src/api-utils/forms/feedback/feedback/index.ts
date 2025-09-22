import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';
import { UAParser } from 'ua-parser-js';
import _ from 'lodash';
import logger from '#/logger';
import config from '#/config';
import { createGitHubIssue } from '../forms/helpers/create-github-issue';
import { createMarkdown } from './create-markdown';
import { isAuthenticated } from '../../middleware';
import { AuthRequest } from '../../middleware/auth';
import { encryptJSON } from '../../helpers/encrypt';
import { getFeedbackContentType } from './feedbackContentType.js';

const FormSchema = {
  body: z
    .object({
      title: z.string().optional(), // markdown-safe title
      description: z.string().optional(), // assumed already HTML/Markdown-safe if needed
      location: z.string().optional(),
      width: z.number().min(0).optional(),
      height: z.number().min(0).optional(),
    })
    .partial(), // allow missing fields
};

/**
 * Schema for timestamp range used in the log links.
 * Uses ISO 8601 datetime strings.
 */
const TimestampSchema = z
  .object({
    before: z.string().datetime().optional(),
    after: z.string().datetime().optional(),
  })
  .partial();

/**
 * Main schema for the payload used to render the template.
 */
export const FeedbackPayloadSchema = z.object({
  form: FormSchema.body,

  // meta / user info
  __githubUserName: z.string().optional(),
  __user: z.string().optional(), // could be uid or email; change to z.string().email() if always email
  __domain: z.string().url().optional(),
  __agent: z.string().optional(),
  __referer: z.string().optional(),

  // window dimensions
  width: z.number().int().nonnegative().optional(),
  height: z.number().int().nonnegative().optional(),

  // timestamps for the log links
  __timestamp: TimestampSchema.optional(),

  // system / dataset fields
  _health: z.union([z.string(), z.record(z.unknown())]).optional(), // string or object
  datasetKey: z.string().optional(),
  publishingOrgKey: z.string().optional(),

  // arrays
  networkKeys: z.array(z.string()).optional(),
  mention: z.array(z.string()).optional(),
});

/**
 * TypeScript type inferred from the schema
 */
export type FeedbackDTO = z.infer<typeof FeedbackPayloadSchema>;

function getDescription({
  form,
  agent,
  referer,
  user,
  githubUserName,
  mention,
  datasetKey,
  publishingOrgKey,
  networkKeys,
}) {
  // add contact type
  const __data = {
    form,
    mention,
    datasetKey,
    publishingOrgKey,
    networkKeys,
  } as FeedbackDTO;

  __data.__agent = agent.toString();
  __data.__user = user;
  __data.__githubUserName = githubUserName;
  __data.__domain = config.gbifLinkTargetOrigin;
  __data.__referer = referer;

  // set timestamps 5 minuttes before and 1 minute after for linking to relevant logs
  __data.__timestamp = {};
  __data.__timestamp.before = new Date(
    Date.now() - 1000 * 60 * 5,
  ).toISOString();
  __data.__timestamp.after = new Date(Date.now() + 1000 * 60 * 6).toISOString();

  return createMarkdown(__data as FeedbackDTO);
}

function getLabels(data) {
  const labels = _.union(
    ['Under review'],
    _.intersection(
      ['bug', 'idea', 'content', 'data content', 'question'],
      [data.type],
    ),
  );
  if (data.publishingCountry) {
    labels.push(data.publishingCountry);
  }
  return _.uniq(labels);
}
const feedbackRouter = Router();
export default (app) => {
  app.use('/forms/feedback', feedbackRouter);
};

function isGbifDomainOrLocalhost(href: string | undefined) {
  if (!_.isString(href)) {
    return false;
  }
  const location = new URL(href);
  const { hostname } = location;

  const allowedDomains = [
    'localhost',

    'www.gbif.org',
    'demo.gbif.org',
    'gbif.org',

    'www.gbif-dev.org',
    'demo.gbif-dev.org',
    'gbif-dev.org',

    'www.gbif-test.org',
    'demo.gbif-test.org',
    'gbif-test.org',

    'www.gbif-uat.org',
    'demo.gbif-uat.org',
    'gbif-uat.org',

    'demo.gbif-staging.org',
    'www.gbif-staging.org',
    'gbif-staging.org',

    'demo.gbif-preview.org',
    'www.gbif-preview.org',
    'gbif-preview.org',
  ];

  if (!allowedDomains.includes(hostname)) {
    return false;
  }
  return true;
}

feedbackRouter.post(
  '/bug',
  isAuthenticated,
  validateRequest(FormSchema),
  async (req, res) => {
    const authReq = req as AuthRequest;
    try {
      const agentObject = new UAParser(req.headers['user-agent']).getResult();
      const agent = `${agentObject.browser.name} ${agentObject.browser.version} / ${agentObject.os.name} ${agentObject.os.version}`;
      let feedbackType;
      if (!req?.body?.location) {
        // fail if no location is provided
        return res.status(400).json({ message: 'No location provided' });
      }
      // check that the domain is allowed. We accept only our own domains which are gbif.org gbif-dev.org gbif-test.org gbif-staging.org
      // this isn't about security, but simply to avoid spam linking to other domains.
      if (!isGbifDomainOrLocalhost(req?.body?.location)) {
        return res.status(400).json({ message: 'Domain not allowed' });
      }
      if (req?.body?.location) {
        // parse location to get domain and path
        const location = new URL(req?.body?.location);
        const path = location.pathname;
        feedbackType = await getFeedbackContentType(path);
      }
      const { datasetKey, publishingOrgKey, networkKeys, mention } =
        feedbackType || {};

      const user = encryptJSON({
        userName: authReq.user.userName,
        email: authReq.user.email,
        firstName: authReq.user.firstName,
        lastName: authReq.user.lastName,
        date: new Date(),
      });
      const githubUserName =
        authReq?.user?.systemSettings?.['auth.github.username'];
      const result = {
        owner: config.feedback.owner,
        repo: config.feedback.repository,
        title: req?.body?.title || '',
        body: getDescription({
          form: req.body,
          agent,
          referer: req?.body?.location,
          user,
          githubUserName,
          mention,
          datasetKey,
          publishingOrgKey,
          networkKeys,
        }),
        labels: getLabels(req.body),
      };
      const issue = await createGitHubIssue(result);

      return res
        .status(200)
        .json({ message: 'From submitted succesfully', link: issue?.html_url });
    } catch (error) {
      logger.error({
        message: 'Failed to submit feedback form',
        error,
      });
      return res.status(500).json({ message: 'Form submission failed' });
    }
  },
);
