import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useIsFamilyOrAbove } from '@/hooks/taxonomyRankHooks';
import { NotFoundError } from '@/errors';
import { BibliographyContent } from './sections/BibliographyCard';
import { Card, CardContent, CardHeader } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import { useTaxonBreakdown } from './sections/breakdown';
import { TaxonKeyQuery } from '@/gql/graphql';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Button } from '@/components/ui/button';
import { DynamicLink } from '@/reactRouterPlugins';
import { MdInfoOutline } from 'react-icons/md';
import { TaxonTree } from '../search/views/tree';
import { CardTitle } from '@/components/ui/smallCard';
import { BreakdownContent } from './sections/breakdown/BreakdownCard';
import Synonyms from './sections/Synonyms';
import { TaxonMedia } from './sections/TaxonMedia';
import { VernacularNameTable } from './sections/VernacularNameTable';
import Citation from './sections/Citation';

const dividerClass = 'g-mt-6 g-pt-6';

export default function AboutNonBackbone({ data, className }: { data: TaxonKeyQuery }) {
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
  const hasMedia = (taxonInfo?.media?.length ?? 0) > 0;

  if (!taxon) return null;
  return (
    <>
      {/* Taxon name */}
      <CardHeader className="">
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
                pageId="datasetKey"
                variables={{ key: taxon.datasetKey }}
                path={`/taxon/${taxon.acceptedTaxon.taxonID}`}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: taxon.acceptedTaxon.label || taxon.acceptedTaxon.scientificName || '',
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
      </CardHeader>
      <CardContent>
        <div>
          <CardTitle className="g-text-lg">
            <FormattedMessage id="taxon.classificationAndDescendants" />
          </CardTitle>
          <TaxonTree datasetKey={taxon.datasetKey} taxonKey={taxon.taxonID} />
        </div>
        {showTaxonBreakdown && hasBreakdownData && (
          <div className={dividerClass}>
            <CardTitle className="g-text-lg">
              <FormattedMessage id="taxon.largestGroups" defaultMessage="Largest Groups" />
            </CardTitle>
            <BreakdownContent taxonKey={taxon.taxonID} datasetKey={taxon.datasetKey} />
          </div>
        )}
        {showSynonyms && (
          <div className={dividerClass}>
            <CardTitle className="g-text-lg">
              <FormattedMessage id="taxon.synonymsAndCombinations" />
            </CardTitle>
            <Synonyms taxonInfo={taxonInfo} />
          </div>
        )}
        {hasMedia && (
          <div className={dividerClass}>
            <CardTitle className="g-text-lg">
              <FormattedMessage id="taxon.media" defaultMessage="Media" />
            </CardTitle>
            <TaxonMedia media={taxonInfo.media} />
          </div>
        )}
        {hasVernacularNames && (
          <div className={dividerClass}>
            <CardTitle className="g-text-lg">
              <FormattedMessage id="taxon.vernacularNames" />
            </CardTitle>
            <VernacularNameTable vernacularNames={taxonInfo?.vernacularNames ?? []} />
          </div>
        )}
        {hasBibliography && (
          <div className={dividerClass}>
            <CardTitle className="g-text-lg">
              <FormattedMessage id="taxon.bibliography" />
            </CardTitle>
            <BibliographyContent taxonInfo={taxonInfo} />
          </div>
        )}
        <div className={dividerClass}>
          <CardTitle className="g-text-lg">
            <FormattedMessage id="phrases.citation" />
          </CardTitle>
          <Citation taxonInfo={taxonInfo} />
        </div>
      </CardContent>
    </>
  );
}
