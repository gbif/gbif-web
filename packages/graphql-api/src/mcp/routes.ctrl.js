import { Router } from 'express';
import chartMcpCtrl from './chart/chartMcp.ctrl';

const router = Router();

export default (app, server) => {
  // add chat mcp routes
  app.use('/mcp', router);

  chartMcpCtrl(router, server);
};
