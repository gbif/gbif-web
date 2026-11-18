// A minimal MCP Apps host for checking the widget in a real browser: it runs the SDK's own AppBridge,
// loads the widget into a sandboxed iframe, and sends it a tool result like a chat client would.
import { AppBridge, PostMessageTransport } from '@modelcontextprotocol/ext-apps/app-bridge';

declare global {
  interface Window {
    runHost(html: string, toolResult: unknown): Promise<{ openedLinks: string[] }>;
  }
}

window.runHost = async (html, toolResult) => {
  const openedLinks: string[] = [];
  const iframe = document.createElement('iframe');
  iframe.setAttribute('sandbox', 'allow-scripts');
  iframe.style.cssText = 'width:640px;height:480px;border:0';
  document.body.appendChild(iframe);
  const bridge = new AppBridge(null, { name: 'test-host', version: '0' }, { openLinks: {} });
  bridge.onopenlink = async ({ url }) => {
    openedLinks.push(url);
    return {};
  };
  const ready = new Promise<void>((resolve) => (bridge.oninitialized = () => resolve()));
  await bridge.connect(new PostMessageTransport(iframe.contentWindow!, iframe.contentWindow!));
  iframe.srcdoc = html;
  await ready;
  await bridge.sendToolResult(toolResult as any);
  // give the widget a moment to draw
  await new Promise((r) => setTimeout(r, 300));
  (window as any).__openedLinks = openedLinks;
  return { openedLinks };
};
