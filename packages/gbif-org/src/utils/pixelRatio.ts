const max = 4;
const dpr = window?.devicePixelRatio || 1;

export const pixelRatio = Math.min(Math.ceil(dpr), max);
