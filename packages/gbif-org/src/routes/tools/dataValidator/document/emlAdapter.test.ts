import { describe, expect, it } from 'vitest';
import eml from '../data/__fixtures__/eml.json';
import { emlAdapter, hasEmlContent, safeLinkValue } from './emlAdapter';

describe('emlAdapter', () => {
  const view = emlAdapter(eml);

  it('keeps the text fields as they are, for HyperText to sanitise', () => {
    expect(view.title).toBe('Sample <b>dataset</b>');
    expect(view.description).toContain('<p>');
    expect(view.purpose).toBe('To test the adapter.');
    expect(view.additionalInfo).toBe('Extra notes.');
  });

  it('maps temporal coverages and moves a single date found in period to date', () => {
    expect(view.temporalCoverages).toEqual([
      {
        '@type': 'range',
        start: '2001-01-01T00:00:00.000+0000',
        end: '2002-12-31T00:00:00.000+0000',
        date: undefined,
        period: undefined,
      },
      {
        '@type': 'single',
        start: undefined,
        end: undefined,
        date: '2005-06-01T00:00:00.000+0000',
        period: '2005-06-01T00:00:00.000+0000',
      },
      {
        '@type': 'verbatim',
        start: undefined,
        end: undefined,
        date: undefined,
        period: 'Late Cretaceous',
      },
    ]);
  });

  it('keeps complete bounding boxes only', () => {
    expect(view.geographicCoverages[0].boundingBox).toEqual({
      minLatitude: 54.5,
      maxLatitude: 57.8,
      minLongitude: 8,
      maxLongitude: 15.2,
      globalCoverage: false,
    });
    expect(view.geographicCoverages[1]).toEqual({
      description: 'Somewhere',
      boundingBox: undefined,
    });
  });

  it('maps taxonomic coverages', () => {
    expect(view.taxonomicCoverages[0].coverages[0]).toEqual({
      scientificName: 'Aves',
      commonName: 'birds',
      rank: { verbatim: 'class', interpreted: 'CLASS' },
    });
  });

  it('drops empty sampling fields and non-text method steps', () => {
    expect(view.samplingDescription).toEqual({
      studyExtent: 'All of Denmark',
      sampling: 'Point counts',
      qualityControl: undefined,
      methodSteps: ['Walk', 'Count'],
    });
  });

  it('drops empty citations', () => {
    expect(view.bibliographicCitations).toHaveLength(2);
  });

  it('removes links that are not http(s) from contacts', () => {
    expect(view.contacts[0].homepage).toEqual(['https://example.org']);
    expect(view.contacts[0].userId).toEqual(['https://orcid.org/0000-0002-1825-0097', '0000-1111']);
  });

  it('maps the metadata and data languages', () => {
    expect(view.metadataLanguage).toBe('eng');
    expect(view.dataLanguage).toBe('dan');
  });

  it('keeps external data descriptions with an http(s) link or a name', () => {
    expect(view.dataDescriptions).toEqual([
      { name: 'Field protocol', url: 'https://example.org/protocol.pdf' },
      { name: 'Unsafe link', url: undefined },
      { name: undefined, url: 'http://example.org/plain' },
    ]);
  });

  it('accepts anything without crashing', () => {
    for (const input of [undefined, null, 'x', [], { contacts: 'x', temporalCoverages: {} }]) {
      expect(hasEmlContent(emlAdapter(input))).toBe(false);
    }
    expect(hasEmlContent(view)).toBe(true);
  });
});

describe('safeLinkValue', () => {
  it.each(['https://a.b', 'http://a.b', '0000-1111', 'orcid.org/0000'])('allows %s', (value) => {
    expect(safeLinkValue(value)).toBe(true);
  });

  it.each(['javascript:alert(1)', ' JavaScript:x', 'data:text/html,x', 'vbscript:x'])(
    'rejects %s',
    (value) => {
      expect(safeLinkValue(value)).toBe(false);
    }
  );
});
