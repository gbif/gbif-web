import { useContext } from 'react';
import AboutBackbone from './AboutBackbone';
import { TaxonKeyContext } from './taxonKeyPresentation';
import { NonBackboneTaxon } from './taxonKey';
import { useConfig } from '@/config/config';

export default function About() {
  const config = useConfig();
  const { data } = useContext(TaxonKeyContext);
  const { taxonInfo } = data;
  const isPrimary =
    taxonInfo?.datasetKey === (config.taxonSearch?.checklistKey ?? config.defaultChecklistKey);
  return isPrimary ? <AboutBackbone /> : <NonBackboneTaxon />;
}
