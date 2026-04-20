import { useContext } from 'react';
import AboutBackbone from './AboutBackbone';
import { TaxonKeyContext } from './taxonKeyPresentation';

export default function About() {
  const { data } = useContext(TaxonKeyContext);
  const { taxonInfo } = data;
  const isPrimary = taxonInfo?.taxon?.datasetKey === import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY;
  return isPrimary ? <AboutBackbone /> : <h1>Not backbone </h1>;
}
