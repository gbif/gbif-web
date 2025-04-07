const max = 4;
const fallback = 1;

export const pixelRatio = Math.min(max, window?.devicePixelRatio || fallback);
