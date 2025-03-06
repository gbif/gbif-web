import { useContext } from 'react';
import AboutBackbone from './AboutBackbone';
import AboutNonBackbone from './AboutNonBackbone';
import { TaxonKeyContext } from './taxonKeyPresentation';

export default function About({ headLess = false }: { headLess?: boolean }) {
  const { data } = useContext(TaxonKeyContext);
  // const { data } = useTaxonKeyLoaderData();
  const { taxon } = data;
  const isNub = taxon?.nubKey === taxon?.key;
  return isNub ? <AboutBackbone /> : <AboutNonBackbone headLess={headLess} />;
}
