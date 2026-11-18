// One renderer for both surfaces: the MCP App widget in the chat and the canvas page. Plain SVG, no
// libraries, text escaped. Colours come from CSS variables so light and dark both work.
import type { ChartSpec } from '../types.js';

export const esc = (s: unknown) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const compact = (n: number) =>
  n >= 1e9 ? `${+(n / 1e9).toFixed(1)}B` : n >= 1e6 ? `${+(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${+(n / 1e3).toFixed(1)}k` : String(n);

function niceMax(v: number): number {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  const f = v / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
}

export function chartSvg(spec: ChartSpec): string {
  if (!spec.rows.length) return '<p class="empty">No records to chart.</p>';
  return spec.orientation === 'horizontal' ? horizontal(spec) : vertical(spec);
}

function horizontal(spec: ChartSpec): string {
  const rows = spec.rows;
  const rowH = 26;
  const labelW = 190;
  const w = 640;
  const barW = w - labelW - 70;
  const h = rows.length * rowH + 8;
  const max = Math.max(...rows.map((r) => r.count));
  const body = rows
    .map((r, i) => {
      const y = i * rowH + 4;
      const bw = Math.max(1, (r.count / max) * barW);
      const label = r.label.length > 30 ? `${r.label.slice(0, 29)}…` : r.label;
      return `<g><title>${esc(r.label)}: ${r.count.toLocaleString('en-US')}</title>
        <text x="${labelW - 8}" y="${y + 16}" text-anchor="end" class="lbl">${esc(label)}</text>
        <rect x="${labelW}" y="${y + 3}" width="${bw}" height="${rowH - 8}" rx="2" class="bar"/>
        <text x="${labelW + bw + 6}" y="${y + 16}" class="val">${compact(r.count)}</text></g>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(spec.title)}" class="chart">${body}</svg>`;
}

function vertical(spec: ChartSpec): string {
  const rows = spec.rows;
  const w = 640;
  const h = 280;
  const m = { l: 52, r: 12, t: 12, b: 34 };
  const iw = w - m.l - m.r;
  const ih = h - m.t - m.b;
  const max = niceMax(Math.max(...rows.map((r) => r.count)));
  const step = iw / rows.length;
  const x = (i: number) => m.l + step * i + step / 2;
  const y = (v: number) => m.t + ih - (v / max) * ih;
  const ticks = [0, max / 2, max];
  const every = Math.ceil(rows.length / 10);
  const grid = ticks
    .map((t) => `<line x1="${m.l}" x2="${w - m.r}" y1="${y(t)}" y2="${y(t)}" class="grid"/><text x="${m.l - 6}" y="${y(t) + 4}" text-anchor="end" class="lbl">${compact(t)}</text>`)
    .join('');
  const labels = rows
    .map((r, i) => (i % every === 0 ? `<text x="${x(i)}" y="${h - 12}" text-anchor="middle" class="lbl">${esc(r.label)}</text>` : ''))
    .join('');
  let marks: string;
  if (spec.type === 'line') {
    const pts = rows.map((r, i) => `${x(i).toFixed(1)},${y(r.count).toFixed(1)}`).join(' ');
    const dots = rows.length <= 60 ? rows.map((r, i) => `<circle cx="${x(i)}" cy="${y(r.count)}" r="2.5" class="dot"><title>${esc(r.label)}: ${r.count.toLocaleString('en-US')}</title></circle>`).join('') : '';
    marks = `<polyline points="${pts}" class="line" fill="none"/>${dots}`;
  } else {
    const bw = Math.max(2, step * 0.7);
    marks = rows
      .map((r, i) => `<rect x="${x(i) - bw / 2}" y="${y(r.count)}" width="${bw}" height="${m.t + ih - y(r.count)}" rx="1.5" class="bar"><title>${esc(r.label)}: ${r.count.toLocaleString('en-US')}</title></rect>`)
      .join('');
  }
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(spec.title)}" class="chart">${grid}${marks}${labels}</svg>`;
}

export const CHART_CSS = `
  :root { --fg:#1f2933; --muted:#616e7c; --bg:#ffffff; --card:#f7f9fb; --line:#d9e2ec; --accent:#2f7d4f; --link:#1d5fa8; }
  @media (prefers-color-scheme: dark) { :root { --fg:#e4e7eb; --muted:#9aa5b1; --bg:#14181d; --card:#1c222a; --line:#323b46; --accent:#5cc58a; --link:#7ab7ff; } }
  :root[data-theme="light"] { --fg:#1f2933; --muted:#616e7c; --bg:#ffffff; --card:#f7f9fb; --line:#d9e2ec; --accent:#2f7d4f; --link:#1d5fa8; }
  :root[data-theme="dark"] { --fg:#e4e7eb; --muted:#9aa5b1; --bg:#14181d; --card:#1c222a; --line:#323b46; --accent:#5cc58a; --link:#7ab7ff; }
  * { box-sizing: border-box; }
  body { margin:0; font:14px/1.45 system-ui, sans-serif; color:var(--fg); background:var(--bg); }
  .chart { width:100%; height:auto; display:block; }
  .chart .bar { fill:var(--accent); } .chart .line { stroke:var(--accent); stroke-width:2; }
  .chart .dot { fill:var(--accent); } .chart .grid { stroke:var(--line); stroke-width:1; }
  .chart .lbl { fill:var(--muted); font-size:11px; } .chart .val { fill:var(--fg); font-size:11px; }
  .empty { color:var(--muted); }
  a { color:var(--link); }
`;
