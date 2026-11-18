// The MCP App widget: shown inline by clients that support MCP Apps. It receives the same chart data the
// canvas page draws, in the tool result's structuredContent, and never fetches anything itself.
import { App } from '@modelcontextprotocol/ext-apps';
import { chartSvg, esc } from './render.js';
import type { ChartSpec } from '../types.js';

interface Payload {
  chart: ChartSpec;
  summary: string;
  see?: string;
  live?: string;
}

const root = document.getElementById('root')!;
const app = new App({ name: 'gbif-chart', version: '0.0.1' });

function show(p: Payload) {
  root.innerHTML = `
    <section class="card">
      <h1>${esc(p.chart.title)}</h1>
      <p class="sub">${esc(p.summary)}</p>
      ${chartSvg(p.chart)}
      ${p.chart.note ? `<p class="sub">${esc(p.chart.note)}</p>` : ''}
      <p class="links">
        ${p.see ? `<a href="${esc(p.see)}" data-open>See the records on gbif.org</a>` : ''}
        ${p.live ? `<a href="${esc(p.live)}" data-open>Open the live canvas</a>` : ''}
      </p>
    </section>`;
  root.querySelectorAll<HTMLAnchorElement>('a[data-open]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      void app.openLink({ url: a.href });
    }),
  );
}

app.ontoolresult = (result) => {
  const data = result.structuredContent as unknown as Payload | undefined;
  if (data?.chart) show(data);
  else root.textContent = 'No chart data in this result.';
};

void app.connect();
