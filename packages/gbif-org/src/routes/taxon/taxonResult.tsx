import { TaxonClassification } from '@/components/classification';
import { MapThumbnail, MapTypes } from '@/components/mapThumbnail';
import { CountTag, Tag } from '@/components/resultCards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { TaxonResultFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { FormattedMessage } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment TaxonResult on Taxon {
    key
    nubKey
    scientificName
    canonicalName
    formattedName(useFallback: true)
    kingdom
    phylum
    class
    order
    family
    genus
    rank
    taxonomicStatus
    parents {
      key
      name: canonicalName
      rank
    }
    accepted
    acceptedKey
    numDescendants
    vernacularNames(limit: 1, language: "eng") {
      results {
        vernacularName
        source
        sourceTaxonKey
      }
    }
  }
`);

export function TaxonResult({
  taxon,
  synonym,
}: {
  taxon: TaxonResultFragment;
  synonym: TaxonResultFragment;
}) {
  const acceptedTaxon = taxon?.acceptedTaxon as TaxonResultFragment;
  if (acceptedTaxon) {
    return <TaxonResult taxon={acceptedTaxon} synonym={taxon} />;
  }
  return (
    <div className="g-mb-4">
      <Card className="g-mb-4">
        <article>
          <div className="g-p-4 lg:g-p-8 g-pb-0 lg:g-pb-0">
            <div className="g-flex g-flex-col md:g-flex-row g-gap-4">
              <div className="g-flex-grow">
                <h3 className="g-text-base g-font-semibold g-mb-2">
                  <DynamicLink
                    className="hover:g-text-primary-500 g-me-1"
                    pageId="speciesKey"
                    variables={{ key: taxon.key + '' }}
                  >
                    <span dangerouslySetInnerHTML={{ __html: taxon.formattedName }} />{' '}
                    {/* {taxon.canonicalName} */}
                  </DynamicLink>
                  {taxon.taxonomicStatus !== 'ACCEPTED' && (
                    <span className="g-bg-amber-400 g-rounded-lg g-px-3 g-py-1 g-text-sm">
                      <FormattedMessage id={`enums.taxonomicStatus.${taxon.taxonomicStatus}`} />
                    </span>
                  )}
                </h3>
                {taxon.parents && (
                  <p className="g-font-normal g-text-slate-700 g-text-sm g-break-words">
                    <TaxonClassification classification={taxon.parents} />
                  </p>
                )}
                {synonym && (
                  <p className="g-font-normal g-text-slate-400 g-text-sm g-mt-2">
                    Accepted name for{' '}
                    <DynamicLink
                      className="g-underline g-font-semibold"
                      pageId="speciesKey"
                      variables={{ key: synonym.key + '' }}
                    >
                      <span dangerouslySetInnerHTML={{ __html: synonym.formattedName }} />
                    </DynamicLink>
                  </p>
                )}
                {taxon.vernacularNames?.results?.length > 0 && (
                  <p className="g-font-normal g-text-slate-500 g-text-sm g-mt-2">
                    <span>{taxon.vernacularNames?.results[0]?.vernacularName}</span>
                  </p>
                )}
              </div>
              {/* {taxon.taxonomicStatus === 'ACCEPTED' && ( */}
              <div className="g-max-w-48 md:g-max-w-64 g-flex-none">
                <DynamicLink
                  className="g-text-primary-600"
                  pageId="occurrenceSearch"
                  searchParams={{ taxonKey: taxon.key, view: 'map' }}
                >
                  <MapThumbnail
                    type={MapTypes.TaxonKey}
                    identifier={taxon.key}
                    overlayStyle="classic-noborder.poly"
                    className="g-rounded"
                  />
                </DynamicLink>
              </div>
              {/* )} */}
            </div>
            <div className="-g-m-1 g-mt-2 g-flex g-flex-row g-items-center g-flex-wrap">
              {/* <Tag>
              <FormattedMessage id={`enums.taxonomicStatus.${taxon.taxonomicStatus}`} />
            </Tag> */}
              <Tag>
                <FormattedMessage id={`enums.taxonRank.${taxon.rank}`} />
              </Tag>
              <div className="g-flex-grow g-hidden sm:g-block"></div>
              <DynamicLink
                className="g-text-primary-600"
                pageId="occurrenceSearch"
                searchParams={{ taxonKey: taxon.key }}
              >
                <CountTag
                  v1Endpoint="/occurrence/search"
                  params={{ taxonKey: taxon.key }}
                  message="counts.nOccurrences"
                />
              </DynamicLink>
            </div>
          </div>
          <div className="g-border-t g-border-gray-200 g-py-2 g-px-4 g-mt-4 g-flex g-items-center g-justify-between">
            <div>
              <Button variant="ghost" asChild>
                <DynamicLink
                  className="g-text-primary-600"
                  pageId="speciesKey"
                  variables={{ key: taxon.key + '' }}
                >
                  View taxon details
                </DynamicLink>
              </Button>
            </div>
            <div>
              <Button variant="ghost" asChild>
                <DynamicLink
                  className="g-text-primary-600"
                  pageId="occurrenceSearch"
                  searchParams={{ taxonKey: taxon.key }}
                >
                  Explore species occurrences
                </DynamicLink>
              </Button>
            </div>
          </div>
        </article>
      </Card>
    </div>
  );
}
