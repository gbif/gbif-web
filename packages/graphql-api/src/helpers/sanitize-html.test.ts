import assert from 'node:assert';
import { prefixLinkUrl } from "./sanitize-html";
import config from '#/config';

describe('prefixLinkUrl', () => {
  it("should not edit urls that don't link to gbif.org", () => {
    const url = "https://github.com/gbif/gbif-web"
    assert.equal(prefixLinkUrl(url), url);
  })

  it("should replace the gbif origin with the one from the config", () => {
    const expected = `${config.gbifLinkTargetOrigin}/occurrence/1234`;
    assert.equal(prefixLinkUrl("https://www.gbif-dev.org/occurrence/1234"), expected);
    assert.equal(prefixLinkUrl("https://www.gbif-uat.org/occurrence/1234"), expected);
  })

  it("should localize gbif.org links", () => {
    const locale = "es";
    const url = "https://gbif.org/news/6qTuv5Xf1qa05arROvx7Y1";
    const expected = `${config.gbifLinkTargetOrigin}/${locale}/news/6qTuv5Xf1qa05arROvx7Y1`;
    assert.equal(prefixLinkUrl(url, locale), expected);
  })

  it("should not localize gbif.org links if the selected locale is en-GB", () => {
    const locale = "en-GB";
    const url = `${config.gbifLinkTargetOrigin}/news/6qTuv5Xf1qa05arROvx7Y1`;
    assert.equal(prefixLinkUrl(url, locale), url);
  })

  it("should not change the localization of gbif.org links that already have a local specified", () => {
    const url = `${config.gbifLinkTargetOrigin}/es/news/6qTuv5Xf1qa05arROvx7Y1`;
    assert.equal(prefixLinkUrl(url, 'en-GB'), url);
  });

  it("should localize links to the root page", () => {
    const locale = "es";
    const url = "https://gbif.org";
    const expected = `${config.gbifLinkTargetOrigin}/${locale}`;
    assert.equal(prefixLinkUrl(url, locale), expected);
  })
})