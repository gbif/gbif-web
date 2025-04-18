export function getCss(lookup: Record<string, string>) {
  // generate country colors css
  const countryColorsCss = Object.entries(lookup ?? {})
    .map(([iso, color]) => {
      return `path#${iso}, g#${iso} > path, g#${iso} > circle, g#${iso}- > path { fill: ${color}; opacity: 1; }`;
    })
    .join('\n');

  return `
/*
 * Below are Cascading Style Sheet (CSS) definitions in use in this file,
 * which allow easily changing how countries are displayed.
 *
 * The styles are applied in the order in which they are defined (and re-defined) here in the preamble.
 */

/*
 * Circles around small countries and territories
 *
 * Change opacity to 1 to display all circles
 */
.circlexx
{
   opacity:0;
   fill:#fbfbfb;
   stroke:#d3d3d3;
   stroke-width:0.5;
}

/*
 * Smaller circles around subnational territories: Australian external territories, Chinese SARs, Dutch special municipalities, and French DOMs (overseas regions/departments) [but not French COMs (overseas collectivities)]
 *
 * Change opacity to 1 to display all circles
 */
.subxx
{
   opacity:0;
   fill:#fbfbfb;
   stroke:#d3d3d3;
   stroke-width:0.3;
}


/*
 * Land
 * (all land, as opposed to water, should belong to this class; in order to modify the coastline for land pieces with no borders on them a special class "coastxx" has been added below)
 */
.landxx
{
   fill:#fbfbfb;
   stroke:#d3d3d3;
   stroke-width:0.5;
   fill-rule:evenodd;
}

/*
 * Styles for coastlines of islands and continents with no borders on them
 * (all of them should also belong to the class "landxx" - to allow for all land to be modified at once by refining "landxx" style's definition further down)
 */
.coastxx
{
   stroke-width:0.5;
}


/*
 * Styles for territories without permanent population (the largest of which is Antarctica)
 *
 * Change opacity to 0 to hide all territories
 */
.antxx
{
   opacity:1;
   fill:#fbfbfb;
}

/*
 * Circles around small countries without permanent population
 *
 * Change opacity to 1 to display all circles
 */
.noxx
{
   opacity:0;
   fill:#fbfbfb;
   stroke:#000000;
   stroke-width:0.5;
}


/*
 * Styles for territories with limited or no recognition
 * (all of them - including Taiwan - are overlays (i.e. duplicate layers) over their "host" countries, and so not showing them doesn't leave any gaps on the map)
 *
 * Change opacity to 1 to display all territories
 */
.limitxx
{
   opacity:0;
   fill:#fbfbfb;
   stroke:#ffffff;
   stroke-width:0.2;
   fill-rule:evenodd;
}

/*
 * Smaller circles around small territories with limited or no recognition
 *
 * Change opacity to 1 to display all circles
 */
.unxx
{
   opacity:0;
   fill:#fbfbfb;
   stroke:#000000;
   stroke-width:0.3;
}


/*
 * Oceans, seas, and large lakes
 */
.oceanxx
{
   opacity:1;
   fill:#f2f2f2;
   stroke:#000000;
   stroke-width:0.5;
}

/*
 * Reserved class names:
 *
 * .eu - for members of European Union
 * .eaeu - for members of Eurasian Economic Union
 */


/* "Limited recognition" to display */
path.limitxx.ps, path.limitxx.tw, path.limitxx.xk { opacity: 1; }

/* Colour scale:
Land: #fbfbfb
≥  1 #cbdbc5
≥  2 #b8ceb0
≥  4 #a6c19b
≥ 10 #94b487
≥ 40 #82a872
≥100 #5a964d
*/

/* Begin calculated styles */
${countryColorsCss}
`;
}
