import { Card } from '@/components/ui/largeCard';
import { TaxonResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';

fragmentManager.register(/* GraphQL */ `
  fragment TaxonResult on Taxon {
    key
    nubKey
    scientificName
    formattedName(useFallback: true)
    kingdom
    phylum
    class
    order
    family
    genus
    taxonomicStatus
  }
`);

export function TaxonResult({ taxon }: { taxon: TaxonResultFragment }) {
  return (
    <div className="g-mb-4">
      <Card className="g-max-w-full">{JSON.stringify(taxon)}</Card>
    </div>
  );
}
