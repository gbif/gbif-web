#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const SERVER_NAME = 'gbif-mcp-server';
const SERVER_VERSION = '1.0.0';
const CONFIG_URL = 'http://localhost:4002/mcp/config';
const HANDLER_URL = 'http://localhost:4002/mcp/execute';

class GBIFMCPServer {
  constructor() {
    this.server = new Server(
      { name: SERVER_NAME, version: SERVER_VERSION },
      { capabilities: { tools: {} } },
    );

    this.toolsCache = null;
    this.cacheTimestamp = 0;

    this.setupHandlers();
    this.setupErrorHandling();
  }

  async fetchToolDefinitions() {
    const now = Date.now();

    try {
      const response = await fetch(CONFIG_URL);
      if (!response.ok) {
        throw new Error(`Config fetch failed: ${response.status}`);
      }

      const config = await response.json();
      return config.tools;
      // this.cacheTimestamp = now;

      // return this.toolsCache;
    } catch (error) {
      console.error('Failed to fetch tool definitions:', error);

      // Fallback to cached tools if available
      if (this.toolsCache) {
        console.error('Using cached tool definitions');
        return this.toolsCache;
      }

      throw new Error('No tool definitions available');
    }
  }

  setupHandlers() {
    // List available tools (from remote)
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = await this.fetchToolDefinitions();
      return { tools };
    });

    // Forward tool calls to remote handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        const response = await fetch(HANDLER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tool: name,
            arguments: args,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return {
            content: [
              {
                type: 'text',
                text: `Remote handler error: ${errorData.message || response.statusText}`,
              },
            ],
            isError: true,
          };
        }

        const result = await response.json();
        return result;
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing tool: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Remote MCP Server running on stdio');
  }
}

const server = new GBIFMCPServer();
server.run().catch(console.error);
