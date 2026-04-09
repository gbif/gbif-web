import { ClientSideOnly } from '@/components/clientSideOnly';
import { useCount } from '@/components/count';
import * as charts from '@/components/dashboard';
import { MapTypes, useHasMap } from '@/components/maps/mapThumbnail';
import { MapWidget } from '@/components/maps/mapWidget';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useContext } from 'react';
import TaxonBreakdown from './BreakDown';
import { InvasiveInCountries } from './InvasiveInCountries';
import { TaxonKeyContext } from './taxonKeyPresentation';
import { useIsFamilyOrAbove, useIsSpeciesOrBelow, useNextMajorRank } from './taxonUtil';
import TreatmentsCard from './Treatments';
import TypeMaterial from './TypeSpecimens';
import { NotFoundError } from '@/errors';
import { useConfig } from '@/config/config';
import BibliographyCard from './sections/BibliographyCard';
import CitationCard from './sections/CitationCard';
import ClassificationCard from './sections/ClassificationCard';
import OccurrenceImagesCard from './sections/OccurrenceImagesCard';
import SynonymsCard from './sections/SynonymsCard';
import TaxonIdentifiersCard from './sections/TaxonIdentifiersCard';
import VernacularNamesCard from './sections/VernacularNamesCard';

export default function AboutBackbone() {
  const config = useConfig();
  const { slowTaxon, slowTaxonLoading, data } = useContext(TaxonKeyContext);

  const { count, loading } = useCount({
    v1Endpoint: '/occurrence/search',
    params: {
      taxonKey: data.taxonInfo?.taxon?.taxonID,
      checklistKey: data.taxonInfo?.taxon?.datasetKey,
    },
  });

  const taxon = data?.taxonInfo?.taxon;
  const taxonInfo = data?.taxonInfo;
  if (!taxonInfo || !taxon) throw new NotFoundError();

  const isFamilyOrAbove = useIsFamilyOrAbove(taxon?.taxonRank);
  const isSpeciesOrBelow = useIsSpeciesOrBelow(taxon?.taxonRank);
  const nextMajorRank = useNextMajorRank(taxon?.taxonRank);
  const predicate = {
    type: 'equals',
    key: 'taxonKey',
    value: taxon?.taxonID,
    checklistKey: taxon?.datasetKey,
  };

  const hasSynonyms =
    (taxonInfo.synonyms?.homotypic?.length ?? 0) > 0 ||
    (taxonInfo.synonyms?.heterotypic?.flat().length ?? 0) > 0;

  const hasPreprocessedMap = useHasMap({
    [MapTypes.TaxonKey]: taxon?.taxonID,
    checklistKey: config.defaultChecklistKey,
  });

  const showTaxonBreakdown = isFamilyOrAbove && taxon.taxonomicStatus === 'ACCEPTED';
  const showSynonyms = taxon.taxonomicStatus === 'ACCEPTED' && hasSynonyms;
  const hasVernacularNames = (taxonInfo?.vernacularNames?.length ?? 0) > 0;
  const hasTreatments = (taxonInfo?.taxon?.treatments?.length ?? 0) > 0;
  const hasOccurrenceImages = !!(
    taxon?.occurrenceMedia?.results && (taxon?.occurrenceMedia?.count ?? 0) > 0
  );
  const hasBibliography = (taxonInfo?.bibliography?.length ?? 0) > 0;
  const hasCount = !!count && count > 0;
  const showTaxaChart = hasCount && isFamilyOrAbove;
  const hasWikiDataIdentifiers = !!(
    slowTaxon && (slowTaxon?.taxonInfo?.taxon?.wikiData?.identifiers?.length ?? 0) > 0
  );

  if (!taxon) return null;
  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        {/* create a 2 columns grid  layout that stacks on mobile */}
        <div className="g-grid g-grid-cols-1 lg:g-grid-cols-2 g-gap-4">
          <div>
            <ClassificationCard datasetKey={taxon.datasetKey} taxonKey={taxon.taxonID} />
            {showTaxonBreakdown && <TaxonBreakdown taxon={taxon} />}
            {showSynonyms && <SynonymsCard taxonInfo={taxonInfo} />}
            {hasVernacularNames && <VernacularNamesCard taxonInfo={taxonInfo} />}
            {hasTreatments && <TreatmentsCard taxonInfo={taxonInfo} />}
          </div>
          <div>
            {hasOccurrenceImages && <OccurrenceImagesCard taxon={taxon} />}
            {hasPreprocessedMap && (
              <MapWidget
                className="g-mb-4"
                capabilitiesParams={{ taxonKey: taxon.taxonID, checklistKey: taxon.datasetKey }}
                mapStyle="CLASSIC_HEX"
              />
            )}
            {isSpeciesOrBelow && <TypeMaterial taxonInfo={taxonInfo} />}
            {isSpeciesOrBelow && <InvasiveInCountries taxonInfo={taxonInfo} />}
            {showTaxaChart && (
              <ClientSideOnly>
                <charts.Taxa
                  defaultRank={nextMajorRank?.toLowerCase() || 'family'}
                  predicate={predicate}
                  className="g-mb-2"
                />
              </ClientSideOnly>
            )}
            {hasBibliography && <BibliographyCard taxonInfo={taxonInfo} />}
          </div>
        </div>

        <div className="g-flex">
          <div className="g-flex-grow">
            {hasWikiDataIdentifiers && <TaxonIdentifiersCard slowTaxon={slowTaxon} />}
            <CitationCard taxonInfo={taxonInfo} />
          </div>
        </div>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
