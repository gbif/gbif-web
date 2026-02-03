import { Express, Router } from 'express';
import { registerBecomeAPublisherForm } from './become-a-publisher';
import { registerHostedPortalApplicationForm } from './hosted-portal-application';
import { registerMdtApplicationForm } from './mdt-application';
import { registerConfirmEndorsement } from './publisher-endorsement';
import { registerSuggestDatasetForm } from './suggest-dataset';
import { registerDownloadUsageForm } from './download-usage';

export const formRouter = Router();

export default (app: Express) => {
  registerHostedPortalApplicationForm(formRouter);
  registerMdtApplicationForm(formRouter);
  registerBecomeAPublisherForm(formRouter);
  registerConfirmEndorsement(formRouter);
  registerSuggestDatasetForm(formRouter);
  registerDownloadUsageForm(formRouter);
  app.use('/forms', formRouter);
};
