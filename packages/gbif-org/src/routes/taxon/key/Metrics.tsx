import { ClientSideOnly } from '@/components/clientSideOnly';
import { useCount } from '@/components/count';
import * as charts from '@/components/dashboard';
import DashBoardLayout from '@/components/dashboard/DashboardLayout';
import { Taxa } from '@/components/dashboard/Taxonomy';
import useBelow from '@/hooks/useBelow';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useTaxonKeyLoaderData } from '.';
import { TaxonKeyContext } from './taxonKeyPresentation';
import { useIsFamilyOrAbove, useIsSpeciesOrBelow } from './taxonUtil';

export default function About() {
  const { slowTaxon, slowTaxonLoading } = useContext(TaxonKeyContext);

  const { key } = useParams();
  const { data } = useTaxonKeyLoaderData();
  const { count, loading } = useCount({
    v1Endpoint: '/occurrence/search',
    params: { taxonKey: key },
  });
  const removeSidebar = useBelow(1100);
  const useInlineImage = useBelow(700);
  const {
    taxon,
    typesSpecimenCount: {
      documents: { total: numberOfTypeSpecimens },
    },
    imagesCount: {
      documents: { total: numberOfImages },
    },
  } = data;
  const isFamilyOrAbove = useIsFamilyOrAbove(taxon?.rank);
  const isSpeciesOrBelow = useIsSpeciesOrBelow(taxon?.rank);

  const predicate = {
    type: 'equals',
    key: 'taxonKey',
    value: taxon?.key,
  };

  if (!taxon) return null;
  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <ClientSideOnly>
          <DashBoardLayout>
            {/* <charts.OccurrenceSummary predicate={predicate} className="g-mb-4" /> */}
            {isFamilyOrAbove && <Taxa predicate={predicate} className="g-mb-4" />}

            <charts.DataQuality predicate={predicate} className="g-mb-4" />
            <charts.Months predicate={predicate} className="g-mb-4" />
            <charts.Datasets predicate={predicate} className="g-mb-4" />
            <charts.Country predicate={predicate} className="g-mb-4" />
            <charts.BasisOfRecord predicate={predicate} className="g-mb-4" />
            <charts.Synonyms predicate={predicate} className="g-mb-4" />
          </DashBoardLayout>
        </ClientSideOnly>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
