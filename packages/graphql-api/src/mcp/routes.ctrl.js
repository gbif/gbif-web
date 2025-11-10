import { Router } from 'express';
import chatMcpCtrl from './chat/chatMcp.ctrl';
import chartMcpCtrl from './chart/chartMcp.ctrl';

const router = Router();

export default (app, server) => {
  // add chat mcp routes
  app.use('/mcp', router);

  // chatMcpCtrl(router, server);
  chartMcpCtrl(router, server);
};
