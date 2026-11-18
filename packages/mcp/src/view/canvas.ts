// The canvas page script: reads /canvas/<id>, polls the API and draws every item. Read-only.
import { chartSvg, esc } from './render.js';
import type { CanvasItem } from '../types.js';

const id = location.pathname.split('/').filter(Boolean).pop() ?? '';
const root = document.getElementById('items')!;
const status = document.getElementById('status')!;
let shown = -1;

function card(item: CanvasItem): string {
  return `<article class="card">
    <h2>${esc(item.title)}</h2>
    ${chartSvg(item.chart)}
    ${item.chart.note ? `<p class="sub">${esc(item.chart.note)}</p>` : ''}
    <details><summary>Details and the API call</summary><pre>${esc(item.text)}</pre></details>
    <p class="links"><a href="${esc(item.links.see)}" target="_blank" rel="noopener">See the records on gbif.org</a>
      · <a href="${esc(item.links.api)}" target="_blank" rel="noopener">API call</a>
      · <span class="sub">${new Date(item.ts).toLocaleString()}</span></p>
  </article>`;
}

async function poll() {
  try {
    const res = await fetch(`/api/canvas?id=${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (res.status === 404) {
      status.textContent = 'This canvas does not exist or has expired.';
      return false;
    }
    const { items } = (await res.json()) as { items: CanvasItem[] };
    if (items.length !== shown) {
      shown = items.length;
      root.innerHTML = items.length ? items.map(card).reverse().join('') : '<p class="sub">Nothing here yet. Ask for a chart in your chat and it will appear.</p>';
      status.textContent = items.length ? `${items.length} chart${items.length === 1 ? '' : 's'}, newest first. Updates by itself.` : 'Waiting for the first chart. Updates by itself.';
    }
  } catch {
    status.textContent = 'Could not reach the server. Trying again.';
  }
  return true;
}

(async function loop() {
  if (await poll()) setTimeout(loop, 3000);
})();
