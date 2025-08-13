const max = 4;
let dpr = 1;
if (typeof window !== 'undefined') {
  dpr = window?.devicePixelRatio || 1;
}

export const pixelRatio = Math.min(Math.ceil(dpr), max);
