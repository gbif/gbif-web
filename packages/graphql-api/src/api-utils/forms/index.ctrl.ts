import { Router, Express } from "express";
import { registerHostedPortalApplication } from "./hosted-portal-application";

export const formRouter = Router();

export default (app: Express) => {
  registerHostedPortalApplication(formRouter);
  app.use('/forms', formRouter);
}

