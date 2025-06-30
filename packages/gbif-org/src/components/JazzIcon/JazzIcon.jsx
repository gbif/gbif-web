//actual used
export function getJazzicon(seed, diameter, className) {
  diameter = diameter || 100;
  seed = seed || Math.random() * Number.MAX_SAFE_INTEGER;
  if (typeof seed !== 'number') seed = hash(seed);

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
    '#F19E02', // gold
  ];

  let random = mulberry32(seed);

  function getRectangle(remainingColors, total, i) {
    const center = diameter / 2;
    const firstRot = random();
    const angle = Math.PI * 2 * firstRot;
    const velocity = (diameter / total) * random() + (i * diameter) / total;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    const translate = 'translate(' + tx + ' ' + ty + ')';

    // Third random is a shape rotation on top of all of that.
    const secondRot = random();
    const rot = firstRot * 360 + secondRot * 180;
    const rotate = 'rotate(' + rot.toFixed(1) + ' ' + center + ' ' + center + ')';
    const transform = translate + ' ' + rotate;
    const fill = genColor(remainingColors, random);

    return `<rect x="0" y="0" width="${diameter}" height="${diameter}" transform="${transform}" fill="${fill}"></rect>`;
  }

  var jazzicon = `<div class="${className}" style="overflow: hidden; background: ${genColor(
    colors,
    random
  )};">
		<svg x="0" y="0" viewBox="0 0 ${diameter} ${diameter}" class="g-w-full g-h-full">
			${getRectangle(colors, 3, 0)}
			${getRectangle(colors, 3, 1)}
			${getRectangle(colors, 3, 2)}
		</svg>
	</div>`;
  return jazzicon;
}

//a hash value based on the username could be used as the seed value
var hash = function (str) {
  var hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let genColor = (colors, random) => {
  const idx = Math.floor(colors.length * random());
  const color = colors.splice(idx, 1)[0];
  return color;
};
