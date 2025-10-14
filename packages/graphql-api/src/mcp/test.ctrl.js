import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express, { Router } from 'express';

const router = Router();

const server = new Server(
  {
    name: 'my-simple-server',
    version: '1.0.0',
  },
  {
    capabilities: { tools: {} },
  },
);

// Track active transports by session ID
const transports = new Map();

// Define your tool
server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'get_time',
      description: 'Get current time',
      inputSchema: { type: 'object', properties: {} },
    },
  ],
}));

server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'get_time') {
    return { content: [{ type: 'text', text: new Date().toISOString() }] };
  }
});

export default (app) => {
  app.use('/mcp', router);

  // // SSE endpoint - client connects here and gets a session ID
  // router.get('/sse', async (req, res) => {
  //   const sessionId = Math.random().toString(36).substring(7);

  //   res.setHeader('X-Session-Id', sessionId);

  //   const transport = new SSEServerTransport('/mcp/message', res);
  //   transports.set(sessionId, transport);

  //   await server.connect(transport);

  //   // Clean up when connection closes
  //   req.on('close', () => {
  //     transports.delete(sessionId);
  //   });
  // });

  // // Message endpoint - client sends requests here with session ID
  // router.post('/message', express.json(), async (req, res) => {
  //   const sessionId = req.headers['x-session-id'];
  //   const transport = transports.get(sessionId);

  //   if (!transport) {
  //     return res.status(404).json({ error: 'Session not found' });
  //   }

  //   try {
  //     // Pass the request body directly to the transport
  //     await transport.handleMessage(req.body);
  //     res.sendStatus(200);
  //   } catch (error) {
  //     console.error('Error handling message:', error);
  //     res.status(500).json({ error: error.message });
  //   }
  // });
};
