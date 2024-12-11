import { fragmentManager } from '@/services/fragmentManager';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Tag } from '@/components/resultCards';
import { Card } from '@/components/ui/largeCard';
import { DynamicLink } from '@/reactRouterPlugins';
import { InstitutionResultFragment } from '@/gql/graphql';
import { truncate } from '@/utils/truncate';
import { TypeStatusLabel } from '@/components/filters/displayNames';
import { GlobeIcon } from '@radix-ui/react-icons';

fragmentManager.register(/* GraphQL */ `
  fragment InstitutionResult on InstitutionSearchEntity {
    key
    name
    active
    code
    excerpt
    country
    mailingCountry
    collectionCount
    numberSpecimens
    occurrenceCount
    featuredImageUrl: thumbor(width: 300, height: 200)
    featuredImageLicense
  }
`);

export function InstitutionResult({ institution }: { institution: InstitutionResultFragment }) {
  const country = institution.country ?? institution.mailingCountry;
  return (
    <div className="g-mb-4">
      <Wrapper>
        <Card className="g-max-w-full">
          <article className="g-p-8">
            <div className="g-flex g-flex-col md:g-flex-row g-gap-4">
              <div className="g-flex-grow">
                <h3 className="g-text-base g-font-semibold g-mb-2">
                  <DynamicLink to={`/institution/${institution.key}`}>
                    {institution.name}
                  </DynamicLink>
                  {!institution.active && (
                    <span className="g-align-middle g-bg-red-100 g-text-red-800 g-text-sm g-font-medium g-ms-2 g-px-2.5 g-py-0.5 g-rounded dark:g-bg-red-900 dark:g-text-red-300">
                      <FormattedMessage id="grscicoll.inactive" />
                    </span>
                  )}
                </h3>
                {institution.excerpt && (
                  <p className="g-font-normal g-text-slate-700 g-text-sm">{institution.excerpt}</p>
                )}
                {!institution.excerpt && (
                  <p className="g-font-normal g-text-slate-400 g-text-sm">
                    <FormattedMessage id="phrases.noDescriptionProvided" />
                  </p>
                )}

                {(country || institution.code) && (
                  <div className="g-font-normal g-text-slate-500 g-text-sm g-my-1 g-flex g-items-center">
                    {country && (
                      <div className="g-flex g-items-center">
                        <GlobeIcon />{' '}
                        <span className="g-mx-2">
                          <FormattedMessage id={`enums.countryCode.${country}`} />
                        </span>
                      </div>
                    )}
                    {institution.code && (
                      <div className="g-ms-4 g-flex g-items-center">
                        <FormattedMessage id="filters.institutionCode.name" />:
                        <span className="g-mx-2">{truncate(institution.code, 20)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <DynamicLink
                to={`/institution/${institution.key}`}
                className="g-flex-none g-max-w-48 md:g-max-w-64 "
              >
                {institution.featuredImageUrl && (
                  <img
                    src={institution.featuredImageUrl}
                    className="g-rounded-lg g-bg-slate-100 g-border g-border-slate-200"
                  />
                )}
              </DynamicLink>
            </div>
            <div className="-g-m-1 g-mt-2 g-flex g-flex-row g-items-center g-flex-wrap">
              {institution.collectionCount > 0 && (
                <Tag>
                  <FormattedMessage
                    id="counts.nCollections"
                    values={{ total: institution.collectionCount }}
                  />
                </Tag>
              )}
              <div className="g-flex-grow"></div>
              {institution.numberSpecimens > 0 && (
                <Tag>
                  <FormattedMessage
                    id="counts.nRecords"
                    values={{ total: institution.numberSpecimens }}
                  />
                </Tag>
              )}
              {institution.occurrenceCount > 0 && (
                <Tag className="g-bg-primary-500 g-text-primaryContrast-500">
                  <FormattedMessage
                    id="counts.inGbif"
                    values={{ total: institution.occurrenceCount }}
                  />
                </Tag>
              )}
            </div>
          </article>
        </Card>
      </Wrapper>
      {institution?.descriptorMatches && institution?.descriptorMatches.length > 0 && (
        <div className="g-mx-2 g-bg-slate-50 g-shadow g-rounded-b g-text-sm">
          {institution?.descriptorMatches.length > 3 && (
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
                {institution.descriptorMatches.slice(0, 3).map((descriptor) => (
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
      <Card className="g-bg-primary-500 g-border g-border-primary-500 g-text-primaryContrast-500 g-text-sm g-font-semibold">
        <div className="g-px-8 g-py-1">Digitized records published to GBIF</div>
        {children}
      </Card>
    );
  }
}
