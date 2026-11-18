export interface ChartRow {
  label: string;
  count: number;
}

/** What gets drawn. Plain data: the renderer, not the model, decides how it looks. */
export interface ChartSpec {
  type: 'bar' | 'line';
  /** Horizontal bars for long category labels, vertical columns or a line for ordered ones. */
  orientation: 'horizontal' | 'vertical';
  title: string;
  xLabel: string;
  rows: ChartRow[];
  total: number;
  /** e.g. "showing the top 20 of 197 values" */
  note?: string;
}

export interface CanvasItem {
  id: string;
  ts: number;
  kind: 'chart';
  title: string;
  chart: ChartSpec;
  /** The same text the model got, for people who open the page. */
  text: string;
  links: { see: string; api: string };
}
