import { useTaxonKeyLoaderData } from '.';
import AboutBackbone from './AboutBackbone';
import AboutNonBackbone from './AboutNonBackbone';

export default function About() {
  const { data } = useTaxonKeyLoaderData();
  const { taxon } = data;
  const isNub = taxon?.nubKey === taxon?.key;
  return isNub ? <AboutBackbone /> : <AboutNonBackbone />;
}
