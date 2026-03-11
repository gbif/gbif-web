import { useContext } from 'react';
import AboutBackbone from './AboutBackbone';
// import AboutNonBackbone from './AboutNonBackbone';
import { TaxonKeyContext } from './taxonKeyPresentation';

export default function About({ headLess = false }: { headLess?: boolean }) {
  const { data } = useContext(TaxonKeyContext);
  // const { data } = useTaxonKeyLoaderData();
  const { taxonInfo } = data;
  const isPrimary = taxonInfo?.taxon?.datasetKey === '7ddf754f-d193-4cc9-b351-99906754a03b'; // TODO taxonapi :remove hardcoding of nub datasetKey
  return isPrimary ? <AboutBackbone /> : <h1>Not backbone </h1>;
  // return isPrimary ? <AboutBackbone /> : <AboutNonBackbone headLess={headLess} />;
}
