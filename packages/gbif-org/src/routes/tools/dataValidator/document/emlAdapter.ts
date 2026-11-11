// The /validation/{key}/eml answer is the registry Dataset model parsed from an uploaded EML file.
// This turns it into the props of the dataset "about" components. The content is user-supplied:
// HTML goes through HyperText (sanitised) and URLs that would end up in an href are checked here.

type Json = Record<string, unknown>;

export type EmlTemporalCoverage = {
  '@type': 'range' | 'single' | 'verbatim' | string;
  start?: string;
  end?: string;
  date?: string;
  period?: string;
};

export type EmlBoundingBox = {
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
  globalCoverage?: boolean;
};

export type EmlGeographicCoverage = { description?: string; boundingBox?: EmlBoundingBox };

export type EmlTaxon = {
  scientificName?: string;
  commonName?: string;
  rank?: { verbatim?: string; interpreted?: string };
};

export type EmlTaxonomicCoverage = { description?: string; coverages: EmlTaxon[] };

export type EmlSamplingDescription = {
  sampling?: string;
  studyExtent?: string;
  qualityControl?: string;
  methodSteps?: string[];
};

export type EmlCitation = { text?: string; identifier?: string };

export type EmlDataDescription = { name?: string; url?: string };

export type EmlView = {
  title?: string;
  description?: string;
  purpose?: string;
  additionalInfo?: string;
  temporalCoverages: EmlTemporalCoverage[];
  geographicCoverages: EmlGeographicCoverage[];
  taxonomicCoverages: EmlTaxonomicCoverage[];
  samplingDescription?: EmlSamplingDescription;
  bibliographicCitations: EmlCitation[];
  contacts: Json[];
  // ISO 639-2 codes, e.g. "eng"
  metadataLanguage?: string;
  dataLanguage?: string;
  dataDescriptions: EmlDataDescription[];
};

function isObject(value: unknown): value is Json {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function list(value: unknown): Json[] {
  return Array.isArray(value) ? value.filter(isObject) : [];
}

function strings(value: unknown): string[] {
  if (typeof value === 'string') return text(value) ? [value] : [];
  return Array.isArray(value) ? value.filter((x): x is string => !!text(x)) : [];
}

function finite(value: unknown): number | undefined {
  const number = typeof value === 'string' ? Number(value) : value;
  return typeof number === 'number' && Number.isFinite(number) ? number : undefined;
}

const SCHEME = /^\s*([a-z][a-z0-9+.-]*):/i;

// plain identifiers and http(s) URLs only: anything else with a scheme (javascript:, data:) goes
export function safeLinkValue(value: string): boolean {
  const scheme = SCHEME.exec(value)?.[1]?.toLowerCase();
  return scheme === undefined || scheme === 'http' || scheme === 'https';
}

function temporalCoverage(raw: Json): EmlTemporalCoverage | undefined {
  const type = text(raw['@type']);
  if (!type) return undefined;
  const coverage: EmlTemporalCoverage = {
    '@type': type,
    start: text(raw.start),
    end: text(raw.end),
    date: text(raw.date),
    period: text(raw.period),
  };
  // some serialisations put a single date in `period`
  if (type === 'single' && !coverage.date && coverage.period) {
    coverage.date = coverage.period;
  }
  return coverage;
}

function boundingBox(raw: unknown): EmlBoundingBox | undefined {
  if (!isObject(raw)) return undefined;
  const box = {
    minLatitude: finite(raw.minLatitude),
    maxLatitude: finite(raw.maxLatitude),
    minLongitude: finite(raw.minLongitude),
    maxLongitude: finite(raw.maxLongitude),
  };
  if (Object.values(box).some((x) => x === undefined)) return undefined;
  return {
    ...(box as Omit<EmlBoundingBox, 'globalCoverage'>),
    globalCoverage: raw.globalCoverage === true,
  };
}

function taxon(raw: Json): EmlTaxon {
  const rank = isObject(raw.rank)
    ? { verbatim: text(raw.rank.verbatim), interpreted: text(raw.rank.interpreted) }
    : undefined;
  return { scientificName: text(raw.scientificName), commonName: text(raw.commonName), rank };
}

function samplingDescription(raw: unknown): EmlSamplingDescription | undefined {
  if (!isObject(raw)) return undefined;
  const sampling: EmlSamplingDescription = {
    sampling: text(raw.sampling),
    studyExtent: text(raw.studyExtent),
    qualityControl: text(raw.qualityControl),
    methodSteps: strings(raw.methodSteps),
  };
  const empty =
    !sampling.sampling &&
    !sampling.studyExtent &&
    !sampling.qualityControl &&
    sampling.methodSteps!.length === 0;
  return empty ? undefined : sampling;
}

const HTTP_URL = /^https?:\/\//i;

function dataDescription(raw: Json): EmlDataDescription {
  const url = text(raw.url)?.trim();
  return { name: text(raw.name), url: url && HTTP_URL.test(url) ? url : undefined };
}

function contact(raw: Json): Json {
  return {
    ...raw,
    homepage: strings(raw.homepage).filter(safeLinkValue),
    userId: strings(raw.userId).filter(safeLinkValue),
    email: strings(raw.email),
    phone: strings(raw.phone),
  };
}

export function emlAdapter(eml: unknown): EmlView {
  const raw = isObject(eml) ? eml : {};
  return {
    title: text(raw.title),
    description: text(raw.description),
    purpose: text(raw.purpose),
    additionalInfo: text(raw.additionalInfo),
    temporalCoverages: list(raw.temporalCoverages)
      .map(temporalCoverage)
      .filter((x): x is EmlTemporalCoverage => !!x),
    geographicCoverages: list(raw.geographicCoverages).map((coverage) => ({
      description: text(coverage.description),
      boundingBox: boundingBox(coverage.boundingBox),
    })),
    taxonomicCoverages: list(raw.taxonomicCoverages).map((coverage) => ({
      description: text(coverage.description),
      coverages: list(coverage.coverages).map(taxon),
    })),
    samplingDescription: samplingDescription(raw.samplingDescription),
    bibliographicCitations: list(raw.bibliographicCitations)
      .map((citation) => ({ text: text(citation.text), identifier: text(citation.identifier) }))
      .filter((citation) => citation.text || citation.identifier),
    contacts: list(raw.contacts).map(contact),
    metadataLanguage: text(raw.language),
    dataLanguage: text(raw.dataLanguage),
    dataDescriptions: list(raw.dataDescriptions)
      .map(dataDescription)
      .filter((description) => description.name || description.url),
  };
}

export function hasEmlContent(view: EmlView): boolean {
  return !!(
    view.title ||
    view.description ||
    view.purpose ||
    view.additionalInfo ||
    view.temporalCoverages.length ||
    view.geographicCoverages.length ||
    view.taxonomicCoverages.length ||
    view.samplingDescription ||
    view.bibliographicCitations.length ||
    view.contacts.length ||
    view.metadataLanguage ||
    view.dataLanguage ||
    view.dataDescriptions.length
  );
}
