import { HyperText } from '@/components/hyperText';
import Properties, { Term, Value } from '@/components/properties';
import { FormattedMessage } from 'react-intl';

// --- Static bounding-box map URL builder ---------------------------------

const TILE_BASE = import.meta.env.PUBLIC_TILE_API ?? 'https://tiles.gbif.org';

type BoundingBox = {
  minLongitude: number;
  minLatitude: number;
  maxLongitude: number;
  maxLatitude: number;
};

type StaticMapOptions = {
  /** Projection segment. GBIF serves 3857 (Web Mercator); 4326 is not published on this server. */
  srs?: string;
  /** Published style id, e.g. 'gbif-geyser', 'gbif-classic', 'gbif-light'. */
  style?: string;
  width?: number;
  height?: number;
  /** Pixel density suffix. '' | '@2x' | '@3x'. */
  scale?: '' | '@2x' | '@3x';
  /** Fraction of margin around the box, 0..1. Keeps the outline off the image edge. */
  padding?: number;
  /** Outline colour (any CSS colour, hex or named). */
  stroke?: string;
  strokeWidth?: number;
  /**
   * Optional fill. Omit for outline-only (recommended for a bbox indicator).
   * Because the fill lives in its own `|`-delimited segment, an rgba() value with
   * commas is fine, e.g. 'rgba(230,77,25,0.15)'.
   */
  fill?: string;
};

/**
 * Build a TileServer GL static-image URL that frames a bounding box.
 *
 * https://tileserver.readthedocs.io/en/latest/endpoints.html#static-images
 */
export function bboxStaticMapUrl(
  { minLongitude, minLatitude, maxLongitude, maxLatitude }: BoundingBox,
  {
    srs = '3857',
    style = 'gbif-geyser',
    width = 600,
    height = 300,
    scale = '@2x',
    padding = 0.1,
    stroke = '#555555',
    strokeWidth = 2,
    fill,
  }: StaticMapOptions = {}
): string {
  const ring: Array<[number, number]> = [
    [minLongitude, minLatitude],
    [maxLongitude, minLatitude],
    [maxLongitude, maxLatitude],
    [minLongitude, maxLatitude],
    [minLongitude, minLatitude],
  ];

  const styleParts = [`stroke:${stroke}`, `width:${strokeWidth}`];
  if (fill) styleParts.push(`fill:${fill}`);

  const path = [...styleParts, ...ring.map(([lng, lat]) => `${lng},${lat}`)].join('|');

  // URLSearchParams handles encoding of | : , # for us.
  const params = new URLSearchParams({ path, padding: String(padding) });

  return `${TILE_BASE}/${srs}/${style}/static/auto/${width}x${height}${scale}.png?${params.toString()}`;
}

// -------------------------------------------------------------------------

export function GeographicCoverages({ geographicCoverages, ...props }) {
  return (
    <>
      {geographicCoverages.map((coverage, idx) => (
        <GeographicCoverage coverage={coverage} key={idx} />
      ))}
    </>
  );
}

function GeographicCoverage({ coverage }) {
  const bbox = coverage?.boundingBox;
  const hasMappableBbox =
    bbox && bbox.minLatitude > -85 && bbox.maxLatitude < 85 && bbox.minLatitude < bbox.maxLatitude;

  let Bbox;

  if (coverage?.boundingBox?.minLatitude) {
    const { minLongitude, minLatitude, maxLongitude, maxLatitude } = coverage.boundingBox;
    Bbox = (
      <Properties useDefaultTermWidths>
        <Term>
          <FormattedMessage id="dataset.latitude" />
        </Term>
        <Value>
          <FormattedMessage
            id="intervals.description.between"
            values={{ from: minLatitude, to: maxLatitude }}
          />
        </Value>
        <Term>
          <FormattedMessage id="dataset.longitude" />
        </Term>
        <Value>
          <FormattedMessage
            id="intervals.description.between"
            values={{ from: minLongitude, to: maxLongitude }}
          />
        </Value>
      </Properties>
    );
  } else {
    Bbox = null;
  }

  return (
    <Properties useDefaultTermWidths>
      <Term>
        <FormattedMessage id="dataset.description" />
      </Term>
      <Value>
        <HyperText
          className="g-prose"
          text={coverage.description}
          fallback
          disableMarkdownParsing
        />
      </Value>
      {hasMappableBbox && (
        <>
          <Term></Term>
          <Value style={{ width: '100%' }}>
            <img
              style={{ marginTop: 24, maxWidth: '100%', marginBottom: 24 }}
              src={bboxStaticMapUrl(coverage.boundingBox)}
              alt=""
            />
            {Bbox}
          </Value>
        </>
      )}
      {!hasMappableBbox && (
        <>
          <Term>
            <FormattedMessage id="dataset.boundingBox" />
          </Term>
          <Value>{Bbox}</Value>
        </>
      )}
    </Properties>
  );
}
