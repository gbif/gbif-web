// https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)#micro-functions-version-4
export function shadeHexColor(color: string, percent: number): string {
  const f = parseInt(color.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = f >> 16,
    G = (f >> 8) & 0x00ff,
    B = f & 0x0000ff;
  return (
    '#' +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
}

export function blendHexColors(c0: string, c1: string, p: number): string {
  const f = parseInt(c0.slice(1), 16),
    t = parseInt(c1.slice(1), 16),
    R1 = f >> 16,
    G1 = (f >> 8) & 0x00ff,
    B1 = f & 0x0000ff,
    R2 = t >> 16,
    G2 = (t >> 8) & 0x00ff,
    B2 = t & 0x0000ff;
  return (
    '#' +
    (
      0x1000000 +
      (Math.round((R2 - R1) * p) + R1) * 0x10000 +
      (Math.round((G2 - G1) * p) + G1) * 0x100 +
      (Math.round((B2 - B1) * p) + B1)
    )
      .toString(16)
      .slice(1)
  );
}

export function shadeBlend(p: number, c0: string, c1: any): string {
  const n = p < 0 ? p * -1 : p,
    u = Math.round,
    w = parseInt;
  if (c0.length > 7) {
    const f = c0.split(','),
      t = (c1 ? c1 : p < 0 ? 'rgb(0,0,0)' : 'rgb(255,255,255)').split(','),
      R = w(f[0].slice(4)),
      G = w(f[1]),
      B = w(f[2]);
    return (
      'rgb(' +
      (u((w(t[0].slice(4)) - R) * n) + R) +
      ',' +
      (u((w(t[1]) - G) * n) + G) +
      ',' +
      (u((w(t[2]) - B) * n) + B) +
      ')'
    );
  } else {
    const f = w(c0.slice(1), 16),
      t = w((c1 ? c1 : p < 0 ? '#000000' : '#FFFFFF').slice(1), 16),
      R1 = f >> 16,
      G1 = (f >> 8) & 0x00ff,
      B1 = f & 0x0000ff;
    return (
      '#' +
      (
        0x1000000 +
        (u(((t >> 16) - R1) * n) + R1) * 0x10000 +
        (u((((t >> 8) & 0x00ff) - G1) * n) + G1) * 0x100 +
        (u(((t & 0x0000ff) - B1) * n) + B1)
      )
        .toString(16)
        .slice(1)
    );
  }
}

export function rgbToHex(r: number, g: number, b: number) {
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

export function hexToRgb(hex: string) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (_, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

// function to get the best contrasting color for a given background color
// https://stackoverflow.com/questions/1855884/determine-font-color-based-on-background-color
// https://codepen.io/WebSeed/pen/pvgqEq
export function colourIsLight(hex: string) {
  const { r, g, b } = hexToRgb(hex.replace('#', ''));
  // Counting the perceptive luminance
  // human eye favors green color...
  const a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return a < 0.4; // originally 0.5, but since we do not use black, we can go a bit lower
}
