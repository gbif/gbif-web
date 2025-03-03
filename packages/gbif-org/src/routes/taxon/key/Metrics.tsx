import { ClientSideOnly } from '@/components/clientSideOnly';
import * as charts from '@/components/dashboard';
import DashBoardLayout from '@/components/dashboard/DashboardLayout';
import { Taxa } from '@/components/dashboard/Taxonomy';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useTaxonKeyLoaderData } from '.';
import { useIsFamilyOrAbove } from './taxonUtil';
export default function Metrics() {
  const { data } = useTaxonKeyLoaderData();

  const { taxon } = data;
  const isFamilyOrAbove = useIsFamilyOrAbove(taxon?.rank);

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
          {isFamilyOrAbove && (
            <DashBoardLayout>
              {/* <charts.OccurrenceSummary predicate={predicate} className="g-mb-4" /> */}
              <Taxa predicate={predicate} className="g-mb-4" />

              <charts.DataQuality predicate={predicate} className="g-mb-4" />
              <charts.Months predicate={predicate} className="g-mb-4" />
              <charts.Datasets predicate={predicate} className="g-mb-4" />
              <charts.Country predicate={predicate} className="g-mb-4" />
              <charts.BasisOfRecord predicate={predicate} className="g-mb-4" />
              <charts.Synonyms predicate={predicate} className="g-mb-4" />
            </DashBoardLayout>
          )}
          {!isFamilyOrAbove && (
            <DashBoardLayout>
              {/* <charts.OccurrenceSummary predicate={predicate} className="g-mb-4" /> */}

              <charts.DataQuality predicate={predicate} className="g-mb-4" />
              <charts.Months predicate={predicate} className="g-mb-4" />
              <charts.Datasets predicate={predicate} className="g-mb-4" />
              <charts.Country predicate={predicate} className="g-mb-4" />
              <charts.BasisOfRecord predicate={predicate} className="g-mb-4" />
              <charts.Synonyms predicate={predicate} className="g-mb-4" />
            </DashBoardLayout>
          )}
        </ClientSideOnly>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
