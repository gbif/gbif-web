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
      contact: z.string().optional(), // assumed already HTML/Markdown-safe if needed
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

function getDescription(data, agent, referer, user, githubUserName) {
  // add contact type
  const contact = data?.form?.contact;

  if (contact && !contact.match(/[@\s]/gi)) {
    // if defined and not containing @ or spaces then assume it is a github username
    data.__contact = `@${contact}`;
  } else {
    data.__contact = contact;
  }
  // data.__contact = contact; //simply use the raw value instead of prefacing with @ so that the user isn't poked in github

  data.__agent = agent.toString();
  data.__user = user;
  data.__githubUserName = githubUserName;
  data.__domain = config.gbifLinkTargetOrigin;
  data.__referer = referer;

  // set timestamps 5 minuttes before and 1 minute after for linking to relevant logs
  data.__timestamp = {};
  data.__timestamp.before = new Date(Date.now() - 1000 * 60 * 5).toISOString();
  data.__timestamp.after = new Date(Date.now() + 1000 * 60 * 6).toISOString();

  return createMarkdown(data as FeedbackDTO);
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
  app.use('/feedback', feedbackRouter);
};

feedbackRouter.post(
  '/bug',
  isAuthenticated,
  validateRequest(FormSchema),
  async (req, res) => {
    const authReq = req as AuthRequest;
    try {
      const agentObject = new UAParser(req.headers['user-agent']).getResult();
      const agent = `${agentObject.browser.name} ${agentObject.browser.version} / ${agentObject.os.name} ${agentObject.os.version}`;
      const { referer } = req.headers;

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
        body: getDescription(req.body, agent, referer, user, githubUserName),
        labels: getLabels(req.body),
      };
      await createGitHubIssue(result);
      res.status(200).json(result);
    } catch (error) {
      logger.error({
        message: 'Failed to submit feedback form',
        error,
      });
      console.error(error);
      res.status(500).json({ message: 'Form submission failed' });
    }
  },
);

feedbackRouter.get('/content', function (req, res) {
  const { path } = req.query;
  getFeedbackContentType(path, function feedbackTypeHandler(feedbackType) {
    res.json(feedbackType);
  });
});
