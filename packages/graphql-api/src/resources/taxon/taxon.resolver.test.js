/* eslint-env mocha */
import assert from 'assert';
import resolvers from './taxon.resolver';

const dirty = '<i onclick="alert(1)">Puma</i> concolor<img src=x onerror=alert(1)>';
const clean = '<i>Puma</i> concolor';

describe('taxon label resolvers', () => {
  // every type that carries a taxon label the portal renders as HTML
  const typesWithLabel = [
    'TaxonResult',
    'TaxonInfo',
    'TaxonSimple',
    'TaxonChild',
    'TaxonTreeItem',
    'TaxonClassification',
    'Synonym',
    'Redlist',
  ];

  typesWithLabel.forEach((type) => {
    it(`sanitises ${type}.label`, () => {
      assert.equal(typeof resolvers[type]?.label, 'function', `${type} has no label resolver`);
      assert.equal(resolvers[type].label({ label: dirty }), clean);
    });
  });

  it('keeps the italics in a normal label', () => {
    const label = '<i>Puma concolor</i> (Linnaeus, 1771)';
    assert.equal(resolvers.TaxonResult.label({ label }), label);
  });

  it('passes missing labels through', () => {
    assert.equal(resolvers.TaxonResult.label({ label: null }), null);
    assert.equal(resolvers.TaxonResult.label({}), undefined);
  });

  it('sanitises ClbBreakdownTaxon.labelHtml', () => {
    assert.equal(resolvers.ClbBreakdownTaxon.labelHtml({ labelHtml: dirty }), clean);
  });
});
