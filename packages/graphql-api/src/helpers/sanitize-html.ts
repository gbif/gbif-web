import config from '#/config';
import logger from '#/logger';
import * as cheerio from 'cheerio';
import { ParserOptions } from 'htmlparser2';
import { merge } from 'lodash';
import sanitize, {
  AllowedAttribute,
  IOptions,
  Transformer,
} from 'sanitize-html';

const DEFAULT_TRUST_LEVEL = 'untrusted';

const GBIF_ORIGINS = [
  'gbif.org',
  'gbif-dev.org',
  'gbif-uat.org',
  'gbif-staging.org',
].flatMap((origin) => [origin, `www.${origin}`]);

type DefaultOptions = {
  allowedTags: string[];
  allowedAttributes: Record<string, AllowedAttribute[]>;
  allowedIframeHostnames?: string[];
  transformTags?: Record<string, string | Transformer>;
  parser?: ParserOptions;
};

const untrustedDefaultOptions: DefaultOptions = {
  allowedTags: ['a', 'p', 'i', 'ul', 'ol', 'li', 'strong', 'em', 'br', 'span'],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
  },
};

export const untrustedHeaderOptions: DefaultOptions = {
  allowedTags: ['i', 'strong', 'em', 'span'],
  allowedAttributes: {},
};

// The trustedDefaultOptions inherits from the untrustedDefaultOptions
const trustedDefaultOptions = merge<unknown, DefaultOptions, DefaultOptions>(
  {},
  untrustedDefaultOptions,
  {
    allowedTags: [
      'iframe',
      'img',
      // SVG content
      'svg',
      'g',
      'defs',
      'path',
      'rect',
      'circle',
      'ellipse',
      'line',
      'polyline',
      'polygon',
      'linearGradient',
      'radialGradient',
      'stop',
      'text',
      'tspan',
      'textPath',
      'image',
      'clipPath',
      'pattern',
      'mask',
      'use',
      'symbol',
      'desc',
      'title',
      // The default allowed tags from the sanitize-html library
      'address',
      'article',
      'aside',
      'footer',
      'header',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'hgroup',
      'main',
      'nav',
      'section',
      // Text content
      'blockquote',
      'dd',
      'div',
      'dl',
      'dt',
      'figcaption',
      'figure',
      'hr',
      'li',
      'main',
      'ol',
      'p',
      'pre',
      'ul',
      // Inline text semantics
      'a',
      'abbr',
      'b',
      'bdi',
      'bdo',
      'br',
      'cite',
      'code',
      'data',
      'dfn',
      'em',
      'i',
      'kbd',
      'mark',
      'q',
      'rb',
      'rp',
      'rt',
      'rtc',
      'ruby',
      's',
      'samp',
      'small',
      'span',
      'strong',
      'sub',
      'sup',
      'time',
      'u',
      'var',
      'wbr',
      // Table content
      'caption',
      'col',
      'colgroup',
      'table',
      'tbody',
      'td',
      'tfoot',
      'th',
      'thead',
      'tr',
    ],
    allowedAttributes: {
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
      iframe: [
        'width',
        'height',
        'src',
        'title',
        'frameborder',
        'allow',
        'allowfullscreen',
      ],
      '*': ['class', 'style'],
      // We add the id and tabindex attribute to the heading tags to be able to link to it
      h1: ['id', 'tabindex'],
      h2: ['id', 'tabindex'],
      h3: ['id', 'tabindex'],
      h4: ['id', 'tabindex'],
      h5: ['id', 'tabindex'],
      h6: ['id', 'tabindex'],
      // Adding SVG-specific attributes
      g: ['id'],
      svg: ['width', 'height', 'viewBox', 'xmlns', 'fill'],
      path: ['d', 'fill'],
      rect: ['x', 'y', 'width', 'height', 'rx', 'ry'],
      circle: ['cx', 'cy', 'r'],
      ellipse: ['cx', 'cy', 'rx', 'ry'],
      line: ['x1', 'y1', 'x2', 'y2'],
      polyline: ['points'],
      polygon: ['points'],
      text: ['x', 'y', 'font-family', 'font-size', 'text-anchor', 'transform'],
      tspan: ['x', 'y'],
      linearGradient: ['id', 'x1', 'y1', 'x2', 'y2', 'gradientUnits'],
      radialGradient: ['id', 'cx', 'cy', 'r', 'fx', 'fy', 'gradientUnits'],
      stop: ['offset', 'stop-color', 'stop-opacity'],
      use: ['href', 'xlink:href'],
    },
    allowedIframeHostnames: [
      'www.youtube.com',
      'player.vimeo.com',
      'vimeo.com',
      'eepurl.com',
      ...GBIF_ORIGINS,
    ],
    transformTags: {
      img(tagName, attr) {
        attr.src = prefixLinkUrl(attr.src);
        return {
          tagName,
          attribs: attr,
        };
      },
    },
    // Needed for svg support (https://github.com/apostrophecms/sanitize-html?tab=readme-ov-file#what-if-i-want-to-maintain-the-original-case-for-svg-elements-and-attributes)
    parser: {
      lowerCaseTags: false,
      lowerCaseAttributeNames: false,
    },
  },
);

const defaultOptionsMap = {
  trusted: trustedDefaultOptions,
  untrusted: untrustedDefaultOptions,
};

type SanitizeOptions = {
  trustLevel?: keyof typeof defaultOptionsMap;
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  wrapTables?: boolean;
  locale?: string;
};

// This function creates the IOptions object that is required by the sanitize-html library based on a set of options provided by the user
function createIOptions(options: SanitizeOptions): IOptions {
  let trustLevel: keyof typeof defaultOptionsMap = DEFAULT_TRUST_LEVEL;

  // Extract the trustLevel from the options. Give a warning if the trustLevel is provided but not valid
  if (options.trustLevel) {
    if (options.trustLevel in defaultOptionsMap) {
      trustLevel = options.trustLevel;
    } else {
      logger.warn(
        `The trustLevel provided is not valid. Using the default trustLevel: ${DEFAULT_TRUST_LEVEL}`,
      );
    }
  }

  // Get the default options for the trustLevel
  const defaultOptions = defaultOptionsMap[trustLevel];

  // Get the allowedTags by the trustLevel
  let { allowedTags } = defaultOptions;

  // If the user has provided a custom list of allowedTags, pick the ones that are allowed by the trustLevel
  if (options.allowedTags) {
    allowedTags = options.allowedTags.filter((tag) =>
      allowedTags.includes(tag),
    );
  }

  // Get the allowedAttributes by the trustLevel
  let { allowedAttributes } = defaultOptions;

  // If the user has provided a custom list of allowedAttributes, pick the ones that are allowed by the trustLevel
  if (options.allowedAttributes) {
    allowedAttributes = Object.entries(options.allowedAttributes).reduce(
      (acc, [tag, attributes]) => {
        // If the tag is not present in the allowedAttributes, skip it
        if (!allowedAttributes[tag]) return acc;

        // Filter the attributes that are not allowed by the trustLevel
        acc[tag] = attributes.filter((attr) =>
          allowedAttributes[tag].includes(attr),
        );

        return acc;
      },
      allowedAttributes,
    );
  }

  // Lozalize links
  let { transformTags } = defaultOptions;
  if (transformTags == null) transformTags = {};

  transformTags.a = function (tagName, attr) {
    attr.href = prefixLinkUrl(attr.href, options.locale);
    return {
      tagName,
      attribs: attr,
    };
  };

  return {
    allowedTags,
    allowedAttributes,
    allowedIframeHostnames: defaultOptions.allowedIframeHostnames,
    transformTags,
    parser: defaultOptions.parser,
  };
}

function wrapTables(html: string): string {
  const $ = cheerio.load(html, null, false);

  $('table').each((_, element) => {
    const table = $(element);
    const div = $('<div class="gbif-table-wrapper"></div>');

    table.replaceWith(div.append(table.clone()));
  });

  return $.html();
}

export function sanitizeHtml(dirty: string, options: SanitizeOptions): string {
  const sanitizeOptions = createIOptions(options);
  const clean = sanitize(dirty, sanitizeOptions);

  if (options.wrapTables) return wrapTables(clean);

  return clean;
}

const supportedLocales = ['en-GB', 'da', 'fr', 'es', 'ar'];

export function prefixLinkUrl(str = '', locale?: string) {
  if (typeof str !== 'string') return str;

  // Normalize the URL by ensuring it ends with a slash for consistent processing
  let hasAddedEndSlash = false;
  if (!str.endsWith('/')) {
    str += '/';
    hasAddedEndSlash = true;
  }

  // Replace the gbif origin with the one from the config
  str = str.replace(
    /^http(s)?:\/\/(www\.)?gbif((-dev)|(-uat))?\.org\//,
    `${config.gbifLinkTargetOrigin}/`,
  );

  // Add the gbif origin to relative links
  if (str.startsWith('/') && !str.startsWith('//')) {
    str = config.gbifLinkTargetOrigin + str;
  }

  // Locale handling
  if (locale && locale !== 'en-GB' && supportedLocales.includes(locale)) {
    // Construct a regex pattern to check if the URL is already localized
    const localePattern = new RegExp(
      `${config.gbifLinkTargetOrigin}/(${supportedLocales.join('|')})/`,
    );
    // Check if the URL is already localized by looking for any of the supported locales
    if (!localePattern.test(str)) {
      // Insert the locale into the path if not localized
      str = `${config.gbifLinkTargetOrigin}/${locale}${str.substring(
        config.gbifLinkTargetOrigin.length,
      )}`;
    }
  }

  // Remove the end slash if it was added
  if (hasAddedEndSlash && str.endsWith('/')) {
    str = str.slice(0, -1);
  }

  return str;
}
