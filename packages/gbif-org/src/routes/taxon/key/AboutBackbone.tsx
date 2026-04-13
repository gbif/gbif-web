import { MapThumbnail, MapTypes, useHasMap } from '@/components/maps/mapThumbnail';
import { MapWidget } from '@/components/maps/mapWidget';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useContext, useState, useCallback } from 'react';
import TaxonBreakdown from './BreakDown';
import { InvasiveInCountries } from './InvasiveInCountries';
import { TaxonKeyContext } from './taxonKeyPresentation';
import { useIsFamilyOrAbove, useIsSpeciesOrBelow } from './taxonUtil';
import TreatmentsCard from './Treatments';
import TypeMaterial from './TypeSpecimens';
import { NotFoundError } from '@/errors';
import { useConfig } from '@/config/config';
import BibliographyCard from './sections/BibliographyCard';
import CitationCard from './sections/CitationCard';
import ClassificationCard from './sections/ClassificationCard';
import OccurrenceMediaGalleryCard from './sections/OccurrenceMediaGalleryCard';
import SynonymsCard from './sections/SynonymsCard';
import TaxonIdentifiersCard from './sections/TaxonIdentifiersCard';
import VernacularNamesCard from './sections/VernacularNamesCard';
import { GbifLinkCard, TocLi as Li, Separator } from '@/components/TocHelp';
import { Card } from '@/components/ui/largeCard';
import useBelow from '@/hooks/useBelow';
import { FormattedMessage } from 'react-intl';
import { Aside, AsideSticky, SidebarLayout } from '../../occurrence/key/pagelayouts';
import BreakdownCard from './BreakdownCard';

export default function AboutBackbone() {
  const config = useConfig();
  const { slowTaxon, data } = useContext(TaxonKeyContext);
  const hideSidebar = useBelow(1000);
  const [hasTypeMaterial, setHasTypeMaterial] = useState(false);
  const onTypeMaterialData = useCallback((hasData: boolean) => setHasTypeMaterial(hasData), []);

  const taxon = data?.taxonInfo?.taxon;
  const taxonInfo = data?.taxonInfo;
  if (!taxonInfo || !taxon) throw new NotFoundError();

  const isFamilyOrAbove = useIsFamilyOrAbove(taxon?.taxonRank);
  const isSpeciesOrBelow = useIsSpeciesOrBelow(taxon?.taxonRank);

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
  const hasInvasiveData = !!taxonInfo?.taxon?.relatedInfo?.griis?.length;
  const hasWikiDataIdentifiers = !!(
    slowTaxon && (slowTaxon?.taxonInfo?.taxon?.wikiData?.identifiers?.length ?? 0) > 0
  );

  if (!taxon) return null;
  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <SidebarLayout
          // reverse
          className="g-grid-cols-[250px_minmax(0,1fr)] xl:g-grid-cols-[300px_minmax(0,1fr)]"
          stack={false}
        >
          <div className="g-order-last">
            <ClassificationCard datasetKey={taxon.datasetKey} taxonKey={taxon.taxonID} />
            {showTaxonBreakdown && (
              <div id="breakdown">
                {/* <TaxonBreakdown taxon={taxon} /> */}

                <BreakdownCard taxonKey={taxon.taxonID} datasetKey={taxon.datasetKey} />
              </div>
            )}
            {hasPreprocessedMap && (
              <div id="map">
                <MapWidget
                  className="g-mb-4"
                  capabilitiesParams={{ taxonKey: taxon.taxonID, checklistKey: taxon.datasetKey }}
                  mapStyle="CLASSIC_HEX"
                  persistStyleSelection
                />
              </div>
            )}
            {hasOccurrenceImages && <OccurrenceMediaGalleryCard taxon={taxon} />}
            {showSynonyms && <SynonymsCard taxonInfo={taxonInfo} />}
            {hasVernacularNames && <VernacularNamesCard taxonInfo={taxonInfo} />}
            {isSpeciesOrBelow && (
              <TypeMaterial taxonInfo={taxonInfo} onHasData={onTypeMaterialData} />
            )}
            {hasInvasiveData && <InvasiveInCountries taxonInfo={taxonInfo} />}
            {hasTreatments && <TreatmentsCard taxonInfo={taxonInfo} />}
            {hasBibliography && <BibliographyCard taxonInfo={taxonInfo} />}
            {hasWikiDataIdentifiers && <TaxonIdentifiersCard slowTaxon={slowTaxon} />}
            <CitationCard taxonInfo={taxonInfo} />
          </div>
          {!hideSidebar && (
            <Aside>
              {hasPreprocessedMap && (
                <>
                  <MapThumbnail
                    blend
                    hexPerTile={48}
                    capabilitiesParams={{ taxonKey: taxon.taxonID, checklistKey: taxon.datasetKey }} // Pass taxonKey to check if there is data to show on the map for this taxon
                    overlayStyle="classic-noborder.poly"
                    className="g-mb-4 g-rounded"
                  />
                </>
              )}
              <AsideSticky>
                <Card>
                  <nav>
                    <ul className="g-list-none g-m-0 g-p-0 g-my-2">
                      <Li to="#classification">
                        <FormattedMessage
                          id="taxon.classification"
                          defaultMessage="Classification"
                        />
                      </Li>
                      {showTaxonBreakdown && (
                        <Li to="#breakdown">
                          <FormattedMessage id="taxon.breakdown" defaultMessage="Breakdown" />
                        </Li>
                      )}
                      {hasPreprocessedMap && (
                        <Li to="#map">
                          <FormattedMessage id="taxon.map" defaultMessage="Map" />
                        </Li>
                      )}
                      {hasOccurrenceImages && (
                        <Li to="#occurrence-images">
                          <FormattedMessage id="taxon.occurrenceImages" defaultMessage="Images" />
                        </Li>
                      )}
                      {showSynonyms && (
                        <Li to="#synonyms">
                          <FormattedMessage id="taxon.synonyms" defaultMessage="Synonyms" />
                        </Li>
                      )}
                      {hasVernacularNames && (
                        <Li to="#vernacularNames">
                          <FormattedMessage
                            id="taxon.vernacularNames"
                            defaultMessage="Vernacular names"
                          />
                        </Li>
                      )}
                      {hasTypeMaterial && (
                        <Li to="#typeMaterial">
                          <FormattedMessage
                            id="taxon.typeMaterial"
                            defaultMessage="Type material"
                          />
                        </Li>
                      )}
                      {hasInvasiveData && (
                        <Li to="#invasiveInCountries">
                          <FormattedMessage id="taxon.invasive" defaultMessage="Invasive species" />
                        </Li>
                      )}
                      {hasTreatments && (
                        <Li to="#treatments">
                          <FormattedMessage id="taxon.treatments" defaultMessage="Treatments" />
                        </Li>
                      )}
                      {hasBibliography && (
                        <Li to="#bibliography">
                          <FormattedMessage id="taxon.bibliography" defaultMessage="Bibliography" />
                        </Li>
                      )}
                      {hasWikiDataIdentifiers && (
                        <Li to="#taxonIdentifiers">
                          <FormattedMessage id="taxon.identifiers" defaultMessage="Identifiers" />
                        </Li>
                      )}
                      <Separator />
                      <Li to="#citation">
                        <FormattedMessage id="phrases.citation" />
                      </Li>
                    </ul>
                  </nav>
                </Card>
                {config.linkToGbifOrg && (
                  <GbifLinkCard className="g-mt-4" path={`/species/${taxon.taxonID}`} />
                )}
              </AsideSticky>
            </Aside>
          )}
        </SidebarLayout>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
