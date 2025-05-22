import { TypeStatusLabel } from '@/components/filters/displayNames';
import { GbifLogoIcon } from '@/components/icons/icons';
import { Tag } from '@/components/resultCards';
import { Card } from '@/components/ui/largeCard';
import { CollectionResultFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { truncate } from '@/utils/truncate';
import { FormattedMessage, FormattedNumber } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment CollectionResult on CollectionSearchEntity {
    key
    name
    active
    code
    excerpt
    numberSpecimens
    occurrenceCount
    institutionName
    institutionKey
    featuredImageUrl: thumbor(width: 300, height: 200)
    featuredImageLicense
    descriptorMatches {
      key
      usageName
      country
      individualCount
      recordedBy
      typeStatus
      identifiedBy
      taxon {
        kingdom
        phylum
        class
        order
        family
        genus
        species
      }
    }
  }
`);

export function CollectionResult({
  collection,
  excludeInstitution,
}: {
  collection: CollectionResultFragment;
  excludeInstitution?: boolean;
}) {
  return (
    <div className="g-mb-4">
      <Wrapper>
        <Card className="g-max-w-full">
          <article className="g-p-8">
            <div className="g-flex g-flex-col md:g-flex-row g-gap-4">
              <div className="g-flex-grow">
                <h3 className="g-text-base g-font-semibold g-mb-2">
                  <DynamicLink
                    className="hover:g-text-primary-500"
                    to={`/collection/${collection.key}`}
                    pageId="collectionKey"
                    variables={{ key: collection.key }}
                  >
                    {collection.name}
                  </DynamicLink>
                  {!collection.active && (
                    <span className="g-align-middle g-bg-red-100 g-text-red-800 g-text-sm g-font-medium g-ms-2 g-px-2.5 g-py-0.5 g-rounded dark:g-bg-red-900 dark:g-text-red-300">
                      <FormattedMessage id="grscicoll.inactiveCollection" />
                    </span>
                  )}
                </h3>
                {collection.excerpt && (
                  <p className="g-font-normal g-text-slate-700 g-text-sm">{collection.excerpt}</p>
                )}
                {!collection.excerpt && (
                  <p className="g-font-normal g-text-slate-400 g-text-sm">
                    <FormattedMessage id="phrases.noDescriptionProvided" />
                  </p>
                )}

                {!excludeInstitution && (
                  <p className="g-font-normal g-text-slate-500 g-text-sm g-mt-2">
                    <FormattedMessage
                      id="grscicoll.fromInstitution"
                      values={{
                        institution: (
                          <DynamicLink
                            className="g-underline g-text-inherit"
                            pageId="institutionKey"
                            variables={{ key: collection.institutionKey }}
                            to={`/institution/${collection.institutionKey}`}
                          >
                            {collection.institutionName}
                          </DynamicLink>
                        ),
                      }}
                    />
                  </p>
                )}
              </div>
              <DynamicLink
                to={`/collection/${collection.key}`}
                pageId="collectionKey"
                variables={{ key: collection.key }}
                className="g-flex-none g-max-w-48 md:g-max-w-64 "
              >
                {collection.featuredImageUrl && (
                  <img
                    src={collection.featuredImageUrl}
                    className="g-rounded-lg g-bg-slate-100 g-border g-border-solid g-border-slate-200"
                  />
                )}
              </DynamicLink>
            </div>
            <div className="-g-m-1 g-mt-2 g-flex g-flex-row g-items-center g-flex-wrap">
              {collection.code && (
                <Tag>
                  <FormattedMessage id="filters.collectionCode.name" />:{' '}
                  {truncate(collection.code, 20)}
                </Tag>
              )}
              <div className="g-flex-grow"></div>
              {collection.numberSpecimens > 0 && (
                <Tag>
                  <FormattedMessage
                    id="counts.nRecords"
                    values={{ total: collection.numberSpecimens }}
                  />
                </Tag>
              )}
              {collection.occurrenceCount > 0 && (
                <Tag className="">
                  <span className="g-flex g-items-center">
                    <GbifLogoIcon className="g-w-3 g-h-3 g-me-1" />
                    <FormattedMessage
                      id="counts.inGbif"
                      values={{ total: collection.occurrenceCount }}
                    />
                  </span>
                </Tag>
              )}
            </div>
          </article>
        </Card>
      </Wrapper>
      {collection?.descriptorMatches && collection?.descriptorMatches.length > 0 && (
        <div className="g-mx-2 g-bg-slate-50 g-shadow g-rounded-b g-text-sm">
          {collection?.descriptorMatches.length > 3 && (
            <div className="g-text-slate-500 g-text-xs g-px-3 g-py-1 -g-mb-2">
              Showing first 3 descriptors
            </div>
          )}
          <div className="g-w-full g-max-w-full g-overflow-auto g-pb-2">
            <table className="gbif-table-style g-whitespace-nowrap g-text-sm">
              <thead className="">
                <tr>
                  <th>Taxon</th>
                  <th>Country</th>
                  <th>Individual count</th>
                  <th>Recorded by</th>
                  <th>Identified by</th>
                  <th>Type status</th>
                </tr>
              </thead>
              <tbody>
                {collection.descriptorMatches.slice(0, 3).map((descriptor) => (
                  <tr key={descriptor.key} className="g-text-slate-600">
                    <td>{descriptor.usageName}</td>
                    <td>
                      {descriptor.country && (
                        <FormattedMessage id={`enums.countryCode.${descriptor.country}`} />
                      )}
                    </td>
                    <td>
                      {descriptor.individualCount && (
                        <FormattedNumber value={descriptor.individualCount} />
                      )}
                    </td>
                    <td>
                      {descriptor.recordedBy &&
                        descriptor.recordedBy.length > 0 &&
                        descriptor.recordedBy.join(', ')}
                    </td>
                    <td>
                      {descriptor.identifiedBy &&
                        descriptor.identifiedBy.length > 0 &&
                        descriptor.identifiedBy.join(', ')}
                    </td>
                    <td>
                      {descriptor.typeStatus &&
                        descriptor.typeStatus.length > 0 &&
                        descriptor.typeStatus.map((typeStatus) => (
                          <TypeStatusLabel id={typeStatus} />
                        ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Wrapper({ children, wrap }: { children: React.ReactNode; wrap?: boolean }) {
  if (!wrap) {
    return <>{children}</>;
  } else {
    return (
      <Card className="g-bg-primary-500 g-border g-border-solid g-border-primary-500 g-text-primaryContrast-500 g-text-sm g-font-semibold">
        <div className="g-px-8 g-py-1">Digitized records published to GBIF</div>
        {children}
      </Card>
    );
  }
}
