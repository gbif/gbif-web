import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';
import { Router } from 'express';
import nodemailer from 'nodemailer';
import { OptionalStringSchema, RequiredStringSchema } from '../validation';
import logger from '@/logger';
import isAuthenticated, { AuthRequest } from '@/middleware/auth';
import config from '@/config';

const PUBLICATION_TYPES = [
  'JOURNAL_ARTICLE',
  'BOOK',
  'BOOK_CHAPTER',
  'CONFERENCE_PAPER_PROCEEDINGS',
  'PREPRINT_WORKING_PAPER',
  'REPORT',
  'WEB_PAGE',
  'THESIS_DISSERTATION',
  'COURSE_TEACHING_MATERIALS',
  'MAGAZINE_ARTICLE',
  'STATUTE',
  'PATENT',
  'NEWSPAPER_ARTICLE',
  'SOFTWARE_COMPUTER_PROGRAM',
  'HEARING',
  'TELEVISION_BROADCAST',
  'ENCYCLOPEDIA_ARTICLE',
  'CASE',
  'FILM',
  'BILL',
  'OTHER',
] as const;

const Schema = {
  body: z.object({
    downloadKey: RequiredStringSchema,
    doi: OptionalStringSchema,
    title: RequiredStringSchema,
    type: z.enum(PUBLICATION_TYPES),
    authors: RequiredStringSchema,
    link: z.string().url().optional().or(z.literal('')),
    date: RequiredStringSchema,
    comments: OptionalStringSchema,
  }),
};

export type DownloadUsageDTO = z.infer<typeof Schema['body']>;

// Initialize nodemailer transporter
let transporter: nodemailer.Transporter | null = null;

try {
  if (config.downloadUsage?.host) {
    transporter = nodemailer.createTransport({
      host: config.downloadUsage.host,
      port: config.downloadUsage.port,
      secure: false,
      auth: config.downloadUsage.sender
        ? {
            user: config.downloadUsage.sender,
          }
        : undefined,
    });
  }
} catch (error) {
  logger.error({
    message: 'Failed to initialize nodemailer transporter for download usage',
    error,
  });
}

const removeLineBreaks = (txt: string | undefined): string =>
  txt ? txt.replace(/(\r\n|\n|\r)/gm, ' ') : '';

interface User {
  userName: string;
  email: string;
}

async function sendMail(data: DownloadUsageDTO, user: User): Promise<void> {
  if (!transporter) {
    throw new Error('Email transporter not configured');
  }

  const envPrefix =
    config.environment === 'prod'
      ? ''
      : `[${config.environment.toUpperCase()}] `;
  const sender = config.downloadUsage?.sender;
  const recipient = config.downloadUsage?.recipient;

  const mailOptions = {
    from: `"${envPrefix}GBIF portal" <${sender}>`,
    to: recipient,
    subject: `${envPrefix}GBIF Download usage`,
    text: `download: ${data.downloadKey}
username: ${user.userName}
email: ${user.email}
title: ${removeLineBreaks(data.title)}
type: ${data.type}
authors: ${removeLineBreaks(data.authors)}
link: ${data.link || ''}
date: ${data.date}
comments: ${removeLineBreaks(data.comments) || ''}`,
  };

  await transporter.sendMail(mailOptions);
}

export function registerDownloadUsageForm(router: Router) {
  router.post(
    '/download-usage',
    isAuthenticated,
    validateRequest(Schema),
    async (req, res) => {
      const authReq = req as AuthRequest;

      // Check if email is configured
      if (!transporter) {
        logger.error({
          message: 'Download usage email not configured',
        });
        return res.status(501).json({
          message: 'Download usage reporting is not configured',
        });
      }

      try {
        const payload: DownloadUsageDTO = req.body;

        await sendMail(payload, {
          userName: authReq.user.userName,
          email: authReq.user.email,
        });

        return res.status(201).json({
          message: 'Usage report submitted successfully',
        });
      } catch (error) {
        logger.error({
          message: 'Failed to submit download usage report',
          error,
          downloadKey: req.body.downloadKey,
        });
        return res.status(500).json({
          message: 'Failed to submit usage report',
        });
      }
    },
  );
}
