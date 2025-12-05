import { css } from '@emotion/react';

const pallettes = [
  ['#DE4D86', '#F29CA3'],
  ['#F29CA3', '#F7CACD'],
  ['#C57B57', '#F1AB86'],
  ['#F1AB86', '#F7DBA7'],
  ['#919098', '#897C80'],
  ['#A69888', '#FCBFB7'],
  ['#0094C6', '#005E7C'],
  ['#EF476F', '#FFC43D'],
];

function hash(str) {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function mulberry32(a) {
  return function () {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

let genColor = (colors, random) => {
  const idx = Math.floor(colors.length * random());
  const color = colors.splice(idx, 1)[0];
  return color;
}

function getPallette(id) {
  let colors = [
    '#01888C', // teal
    '#FC7500', // bright orange
    '#034F5D', // dark teal
    '#F73F01', // orangered
    '#FC1960', // magenta
    '#C7144C', // raspberry
    '#F3C100', // goldenrod
    '#1598F2', // lightning blue
    '#2465E1', // sail blue
    '#F19E02' // gold
  ];

  const seed = hash(id);
  let random = mulberry32(seed);
  // const color1 = genColor(colors, random);
  // const color2 = genColor(colors, random);
  // return { color1, color2 };
  const idx = Math.floor(pallettes.length * random());
  return {
    color1: pallettes[idx][0],
    color2: pallettes[idx][1],
  }
}

export const textThumbnail = ({ fontModifier = 1, id = '', ...props }) => {
  const colors = getPallette(id);
  return css`
    display: inline-flex;
    width: 80px;
    height: 80px;
    overflow: hidden;
    background: ${colors.color1};
    color: ${colors.color2};
    border-radius: 5px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > div {
      line-height: 0.8em;
      flex: 0 0 auto;
      font-weight: 900;
      /* font-size: calc(80px / ${fontModifier}); */
      font-size: 26px;
    }
  `
};