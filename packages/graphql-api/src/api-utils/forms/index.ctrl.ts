import { Router, Express } from "express";
import { registerHostedPortalApplicationForm } from "./hosted-portal-application";
import { registerBecomeAPublisherForm } from "./become-a-publisher";

export const formRouter = Router();

export default (app: Express) => {
  registerHostedPortalApplicationForm(formRouter);
  registerBecomeAPublisherForm(formRouter);
  app.use('/forms', formRouter);
}

