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
  const taxon = data?.taxonInfo?.taxon;

  const isFamilyOrAbove = useIsFamilyOrAbove(taxon?.taxonRank ?? '');

  const predicate = {
    type: 'equals',
    key: 'taxonKey',
    value: taxon?.taxonID,
    checklistKey: taxon?.datasetKey,
  };

  if (!taxon) return null;
  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <ClientSideOnly>
          {isFamilyOrAbove && (
            <DashBoardLayout>
              {/* <charts.OccurrenceSummary predicate={predicate} className="g-mb-4" /> */}

              {/* TODO taxonpi: this chart no longer works as it relies on the old API. IT looks like it is a copy pasted version of the existing taxon chart, si I'm not sure what the benefit is. For now I've replaced it with the one below */}
              {/* <Taxa predicate={predicate} className="g-mb-4" /> */}
              <charts.Taxa predicate={predicate} className="g-mb-4" />

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
