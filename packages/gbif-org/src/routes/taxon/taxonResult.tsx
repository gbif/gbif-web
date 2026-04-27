import { TaxonClassification, TaxonStubClassification } from '@/components/classification';
import { MapThumbnail, MapTypes } from '@/components/maps/mapThumbnail';
import { Card } from '@/components/ui/largeCard';
import { TaxonSearchResultDetailsFragment, TaxonSearchResultCardFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment TaxonSearchResultCard on TaxonResult {
    vernacularName(language: "eng") {
      vernacularName
    }
    taxon {
      ...TaxonSearchResultDetails
      acceptedTaxon {
        ...TaxonSearchResultDetails
      }
    }
  }
`);

fragmentManager.register(/* GraphQL */ `
  fragment TaxonSearchResultDetails on TaxonSimple {
    taxonID
    label
    datasetKey
    scientificName
    taxonRank
    taxonomicStatus
    parentTree {
      scientificName
      taxonID
    }
    mapCapabilities {
      total
    }
  }
`);

export function TaxonResult({
  taxon,
  synonym,
  vernacularName,
  className,
}: {
  taxon: TaxonSearchResultDetailsFragment;
  synonym?: TaxonSearchResultDetailsFragment;
  vernacularName?: string | null;
  className?: string;
}) {
  return (
    <div className={cn('min-[500px]:g-flex g-gap-1', className)}>
      <Card className="g-flex-1">
        <article>
          <div className="g-p-4">
            <div className="g-flex g-flex-col md:g-flex-row g-gap-4">
              <div className="g-flex-grow">
                <div className="g-flex g-items-center g-gap-2 g-mb-2">
                  <h3 className="g-text-base g-font-semibold">
                    <DynamicLink
                      className="hover:g-text-primary-500 g-me-1"
                      pageId="taxonKey"
                      variables={{ key: taxon.taxonID + '' }}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: taxon.label ?? taxon.scientificName,
                        }}
                      />{' '}
                      {/* {taxon.canonicalName} */}
                    </DynamicLink>
                    {taxon.taxonomicStatus !== 'ACCEPTED' && (
                      <span className="g-bg-amber-400 g-rounded-lg g-px-3 g-py-1 g-text-sm">
                        <FormattedMessage id={`enums.taxonomicStatus.${taxon.taxonomicStatus}`} />
                      </span>
                    )}
                  </h3>
                  <div className="g-text-slate-600 g-ms-2">
                    <FormattedMessage id={`enums.taxonRank.${taxon.taxonRank}`} />
                  </div>
                </div>
                {taxon.parentTree && (
                  <div className="g-font-normal g-text-slate-700 g-text-sm g-break-words g-mt-2 ">
                    <TaxonStubClassification classification={taxon.parentTree} />
                  </div>
                )}
                {synonym && (
                  <p className="g-font-normal g-text-slate-400 g-text-sm g-mt-2">
                    Accepted name for{' '}
                    <DynamicLink
                      className="g-underline g-font-semibold"
                      pageId="taxonKey"
                      variables={{ key: synonym.taxonID + '' }}
                    >
                      <span dangerouslySetInnerHTML={{ __html: synonym.label }} />
                    </DynamicLink>
                  </p>
                )}
                {vernacularName && (
                  <p className="g-font-normal g-text-slate-500 g-text-sm g-mt-2">
                    <FormattedMessage id="filterSupport.commonName" />:{' '}
                    <span>{vernacularName}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </article>
      </Card>
      {taxon?.mapCapabilities?.total > 0 && (
        <div className="g-flex-0 max-[500px]:g-hidden">
          <Card>
            <article>
              <div className="">
                <div className="g-flex g-flex-col md:g-flex-row g-gap-4">
                  <div className="g-w-64 g-flex-none">
                    <DynamicLink
                      className="g-text-primary-600"
                      pageId="occurrenceSearch"
                      searchParams={{ taxonKey: taxon.taxonID, view: 'map' }}
                    >
                      <MapThumbnail
                        blend
                        capabilitiesParams={{
                          [MapTypes.TaxonKey]: taxon.taxonID,
                          checklistKey: taxon.datasetKey,
                        }}
                        overlayStyle="classic-noborder.poly"
                        className="g-rounded"
                      />
                    </DynamicLink>
                  </div>
                </div>
              </div>
            </article>
          </Card>
        </div>
      )}
    </div>
  );
}
