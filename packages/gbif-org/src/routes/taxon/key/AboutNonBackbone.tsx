import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useIsFamilyOrAbove } from '@/hooks/taxonomyRankHooks';
import { NotFoundError } from '@/errors';
import BibliographyCard from './sections/BibliographyCard';
import CitationCard from './sections/CitationCard';
import ClassificationCard from './sections/ClassificationCard';
import SynonymsCard from './sections/SynonymsCard';
import VernacularNamesCard from './sections/VernacularNamesCard';
import { Card } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import { BreakdownCard, useTaxonBreakdown } from './sections/breakdown';
import { TaxonKeyQuery } from '@/gql/graphql';
import { HashLink } from 'react-router-hash-link';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Button } from '@/components/ui/button';
import { DynamicLink } from '@/reactRouterPlugins';
import { MdInfoOutline } from 'react-icons/md';
import { Classification } from '@/components/classification';

const sectionClass = 'g-border-0 g-shadow-none g-rounded-none g-mb-0 g-bg-transparent';
const dividerClass = 'g-border-t g-border-slate-200';
const pillClass =
  'g-rounded-full g-bg-white g-border g-border-slate-200 g-px-3 g-py-1.5 g-text-sm g-text-slate-700 hover:g-bg-slate-50 hover:g-text-slate-900 g-no-underline g-inline-block';

export default function AboutNonBackbone({ data }: { data: TaxonKeyQuery }) {
  const taxon = data?.taxonInfo?.taxon;
  const taxonInfo = data?.taxonInfo;
  if (!taxonInfo || !taxon) throw new NotFoundError();

  const isFamilyOrAbove = useIsFamilyOrAbove(taxon?.taxonRank);

  const hasSynonyms =
    (taxonInfo.synonyms?.homotypic?.length ?? 0) > 0 ||
    (taxonInfo.synonyms?.heterotypic?.flat().length ?? 0) > 0;

  const showTaxonBreakdown = isFamilyOrAbove && taxon.taxonomicStatus === 'ACCEPTED';
  const { hasData: hasBreakdownData } = useTaxonBreakdown({
    taxonKey: taxon.taxonID,
    datasetKey: taxon.datasetKey,
  });
  const showSynonyms = taxon.taxonomicStatus === 'ACCEPTED' && hasSynonyms;
  const hasVernacularNames = (taxonInfo?.vernacularNames?.length ?? 0) > 0;
  const hasBibliography = (taxonInfo?.bibliography?.length ?? 0) > 0;

  if (!taxon) return null;
  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        {/* Pills TOC */}
        {/* <nav className="g-mb-4 g-flex g-flex-wrap g-gap-2">
          <HashLink to="#classification" replace className={pillClass}>
            <FormattedMessage id="taxon.classification" defaultMessage="Classification" />
          </HashLink>
          {showTaxonBreakdown && hasBreakdownData && (
            <HashLink to="#breakdown" replace className={pillClass}>
              <FormattedMessage id="taxon.largestGroups" defaultMessage="Largest groups" />
            </HashLink>
          )}
          {showSynonyms && (
            <HashLink to="#synonyms" replace className={pillClass}>
              <FormattedMessage id="taxon.synonyms" defaultMessage="Synonyms" />
            </HashLink>
          )}
          {hasVernacularNames && (
            <HashLink to="#vernacularNames" replace className={pillClass}>
              <FormattedMessage id="taxon.vernacularNames" defaultMessage="Vernacular names" />
            </HashLink>
          )}
          {hasBibliography && (
            <HashLink to="#bibliography" replace className={pillClass}>
              <FormattedMessage id="taxon.bibliography" defaultMessage="Bibliography" />
            </HashLink>
          )}
          <HashLink to="#citation" replace className={pillClass}>
            <FormattedMessage id="phrases.citation" />
          </HashLink>
        </nav> */}

        {/* Single big card */}
        <Card className="g-overflow-hidden">
          {/* Taxon name */}
          <div className="g-p-4 lg:g-p-6">
            <div className="g-text-sm g-text-slate-500 g-mb-1">
              <FormattedMessage
                id={`enums.taxonRank.${taxon.taxonRank}`}
                defaultMessage={taxon.taxonRank || ''}
              />
              {taxon.taxonomicStatus && taxon.taxonomicStatus !== 'ACCEPTED' && (
                <span className="g-ml-2">
                  · <FormattedMessage id={`enums.taxonomicStatus.${taxon.taxonomicStatus}`} />
                </span>
              )}
            </div>
            <h2 className="g-text-2xl g-font-semibold g-mb-2">
              <span
                dangerouslySetInnerHTML={{
                  __html: taxon?.label || taxon?.scientificName || '',
                }}
              />
            </h2>
            {taxon.acceptedTaxon && (
              <div className="g-text-sm g-text-slate-600">
                <FormattedMessage id="taxon.synonymOf" defaultMessage="Synonym of" />{' '}
                <Button asChild variant="link" className="g-p-0 g-h-auto g-text-sm">
                  <DynamicLink
                    pageId="taxonKey"
                    variables={{ key: taxon.acceptedTaxon.taxonID.toString() }}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html:
                          taxon.acceptedTaxon.label || taxon.acceptedTaxon.scientificName || '',
                      }}
                    />
                  </DynamicLink>
                </Button>
              </div>
            )}
            {!taxon.acceptedTaxon && taxonInfo.vernacularName && (
              <div className="g-mb-2">
                <SimpleTooltip
                  asChild
                  title={
                    <FormattedMessage
                      id="phrases.commonNameAccordingTo"
                      values={{ source: 'Catalogue of Life' }}
                    />
                  }
                >
                  <span className="g-text-slate-600 g-inline-flex g-items-center">
                    <span className="g-me-1">{taxonInfo.vernacularName.vernacularName}</span>
                    <MdInfoOutline />
                  </span>
                </SimpleTooltip>
              </div>
            )}
            {/* {!taxon.acceptedTaxon &&
              taxonInfo?.classification &&
              taxonInfo.classification.length > 0 && (
                <Classification className="g-mt-1 g-flex g-flex-wrap g-gap-1 g-items-center g-text-sm g-text-slate-600">
                  {taxonInfo.classification.slice(0, 2).map((c) => (
                    <span key={c.taxonID} className="g-flex g-items-center">
                      <DynamicLink
                        className="hover:g-underline"
                        pageId="taxonKey"
                        variables={{ key: c.taxonID.toString() }}
                      >
                        {c.scientificName}
                      </DynamicLink>
                    </span>
                  ))}
                  {taxonInfo.classification.length > 3 && <span>...</span>}
                  {taxonInfo.classification.length > 2 && (
                    <span className="g-flex g-items-center">
                      <DynamicLink
                        className="hover:g-underline"
                        pageId="taxonKey"
                        variables={{
                          key: taxonInfo.classification[
                            taxonInfo.classification.length - 1
                          ].taxonID.toString(),
                        }}
                      >
                        {
                          taxonInfo.classification[taxonInfo.classification.length - 1]
                            .scientificName
                        }
                      </DynamicLink>
                    </span>
                  )}
                </Classification>
              )} */}
          </div>
          <div className={dividerClass}>
            <ClassificationCard
              className={sectionClass}
              datasetKey={taxon.datasetKey}
              taxonKey={taxon.taxonID}
            />
          </div>
          {showTaxonBreakdown && hasBreakdownData && (
            <div className={dividerClass}>
              <BreakdownCard
                className={sectionClass}
                taxonKey={taxon.taxonID}
                datasetKey={taxon.datasetKey}
              />
            </div>
          )}
          {showSynonyms && (
            <div className={dividerClass}>
              <SynonymsCard className={sectionClass} taxonInfo={taxonInfo} />
            </div>
          )}
          {hasVernacularNames && (
            <div className={dividerClass}>
              <VernacularNamesCard className={sectionClass} taxonInfo={taxonInfo} />
            </div>
          )}
          {hasBibliography && (
            <div className={dividerClass}>
              <BibliographyCard className={sectionClass} taxonInfo={taxonInfo} />
            </div>
          )}
          <div className={dividerClass}>
            <CitationCard className={sectionClass} taxonInfo={taxonInfo} />
          </div>
        </Card>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
