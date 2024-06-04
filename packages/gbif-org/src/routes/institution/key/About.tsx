import Properties, { Property, Term, Value } from '@/components/Properties';
import { InstitutionQuery } from '@/gql/graphql';
import { RouteId, useParentRouteLoaderData } from '@/hooks/useParentRouteLoaderData';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import useBelow from '@/hooks/useBelow';
import { HyperText } from '@/components/HyperText';
import { FeaturedImageContent } from '@/routes/collection/key/collectionKeyPresentation';
import {
  ContactActions,
  ContactAvatar,
  ContactContent,
  ContactDescription,
  ContactEmail,
  ContactHeader,
  ContactHeaderContent,
  ContactTelephone,
  ContactTitle,
} from '@/components/Contact';
import { ConceptValue } from '@/components/ConceptValue';
import { Tag } from '@/components/resultCards';
import { DynamicLink } from '@/components/dynamicLink';
import { FormattedNumber } from '@/components/dashboard/shared';

export default function About() {
  const { data } = useParentRouteLoaderData(RouteId.Institution) as { data: InstitutionQuery };
  const removeSidebar = useBelow(1100);
  const useInlineImage = useBelow(700);
  const { institution } = data;

  if (!institution) return null;

  const addressesIdentical =
    JSON.stringify(institution?.mailingAddress) === JSON.stringify(institution?.address);
  const contacts = institution?.contactPersons.filter((x) => x.firstName);

  const imageUrl = institution.featuredImageUrl ?? institution.featuredImageUrl_fallback;

  return (
    <ArticleContainer className="bg-slate-100 pt-4">
      <ArticleTextContainer className="max-w-screen-xl">
        <div className={`${removeSidebar ? '' : 'grid grid-cols-2 gap-4 grid-cols-[1fr_350px]'}`}>
          <div className="">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="dataset.description" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {institution?.description && (
                  <div
                    className="prose mb-6 max-w-full"
                    dangerouslySetInnerHTML={{ __html: institution.description }}
                  ></div>
                )}
                <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
                  {/* <Property value={institution.description} labelId="grscicoll.description" showEmpty /> */}
                  <Property value={institution.code} labelId="grscicoll.code" showEmpty />
                  <Property
                    value={institution.numberSpecimens}
                    labelId="institution.numberSpecimens"
                  />
                  {/* {occurrenceSearch?.documents?.total > 0 && (
                  <Property
                    value={occurrenceSearch?.documents?.total}
                    labelId="grscicoll.specimensViaGbif"
                    formatter={(count) => {
                      return (
                        <ResourceLink type="institutionKeySpecimens" id={institution.key}>
                          <FormattedNumber value={count} />
                        </ResourceLink>
                      );
                    }}
                  />
                )} */}
                  <Property value={institution.catalogUrls} labelId="grscicoll.catalogUrl" />
                  <Property value={institution.apiUrls} labelId="grscicoll.apiUrl" />
                  <Property
                    value={institution.disciplines}
                    labelId="institution.disciplines"
                    showEmpty
                    formatter={(val) => <ConceptValue vocabulary="Discipline" name={val} />}
                  />
                  {institution.foundingDate && (
                    <Property labelId="grscicoll.foundingDate">{institution.foundingDate}</Property>
                  )}
                  {institution.type && (
                    <Property labelId="institution.type">
                      <FormattedMessage
                        id={`enums.institutionType.${institution.type}`}
                        defaultMessage={institution.type}
                      />
                    </Property>
                  )}
                  <Property
                    value={institution.types}
                    labelId="institution.type"
                    formatter={(val) => <ConceptValue vocabulary="InstitutionType" name={val} />}
                  />
                  <Property
                    value={institution.institutionalGovernances}
                    labelId="institution.institutionalGovernance"
                    formatter={(val) => (
                      <ConceptValue vocabulary="InstitutionalGovernance" name={val} />
                    )}
                  />
                </Properties>
              </CardContent>
            </Card>

            {useInlineImage && (
              <Card className="mb-4">
                <FeaturedImageContent
                  featuredImageUrl={imageUrl}
                  featuredImageLicense={
                    institution.featuredImageUrl ? institution.featuredImageLicense : null
                  }
                />
              </Card>
            )}

            {institution?.collections?.length > 0 && (
              <>
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="institution.collections" defaultMessage="Collections" />
                  </CardTitle>
                </CardHeader>
                <Card className="relative overflow-x-auto rounded border mb-4">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-slate-500 font-light bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b">
                      <tr>
                        <th scope="col" className="px-6 py-3 font-normal">
                          Name
                        </th>
                        <th scope="col" className="px-1 py-3 font-normal">
                          Code
                        </th>
                        <th scope="col" className="px-1 py-3 font-normal">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 font-normal text-right rtl:text-left">
                          Specimens
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {institution?.collections?.map((collection) => {
                        return (
                          <tr
                            key={collection.key}
                            className="bg-white border-b last:border-0 dark:bg-gray-800 dark:border-gray-700"
                          >
                            <td
                              scope="row"
                              className="px-6 py-3 font-normal text-slate-900 whitespace-nowrap dark:text-white"
                            >
                              <DynamicLink
                                className="underline"
                                to={`/collection/${collection.key}`}
                              >
                                {collection.name}
                              </DynamicLink>{' '}
                              {!collection.active && (
                                <Tag className="bg-red-700 text-white">Inactive</Tag>
                              )}
                            </td>
                            <td className="px-1 py-3"><Tag>{collection.code}</Tag></td>
                            <td className="px-1 py-3">
                              <div
                                className="line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: collection.excerpt }}
                              ></div>
                            </td>
                            <td className="px-6 py-3 text-right rtl:text-left">
                              <FormattedNumber value={collection.numberSpecimens} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>
              </>
            )}

            <Card className="mb-4">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="dataset.contacts" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Properties useDefaultTermWidths className="mb-8">
                  <Property labelId="grscicoll.email" className="prose">
                    <a href={`mailto:${institution?.email}`} className="flex items-center">
                      {/* <MailIcon /> */}
                      {institution?.email}
                    </a>
                  </Property>
                  <Property labelId="grscicoll.homepage">
                    <HyperText className="prose" text={institution?.homepage} />
                  </Property>
                  <Property
                    value={institution?.address?.country}
                    labelId="grscicoll.country"
                    showEmpty
                    formatter={(countryCode) => (
                      <FormattedMessage id={`enums.countryCode.${countryCode}`} />
                    )}
                  />
                  <Property value={institution?.address?.province} labelId="grscicoll.province" />
                  <Property value={institution?.address?.city} labelId="grscicoll.city" />
                  <Property
                    value={institution?.address?.postalCode}
                    labelId="grscicoll.postalCode"
                  />
                  <Property value={institution?.address?.address} labelId="grscicoll.address" />
                  {!addressesIdentical && (
                    <>
                      <Term>
                        <FormattedMessage id="grscicoll.mailingAddress" />
                      </Term>
                      <Value>
                        <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
                          <Property
                            value={institution?.mailingAddress?.country}
                            labelId="grscicoll.country"
                            showEmpty
                            formatter={(countryCode) => (
                              <FormattedMessage id={`enums.countryCode.${countryCode}`} />
                            )}
                          />
                          <Property
                            value={institution?.mailingAddress?.province}
                            labelId="grscicoll.province"
                          />
                          <Property
                            value={institution?.mailingAddress?.city}
                            labelId="grscicoll.city"
                          />
                          <Property
                            value={institution?.mailingAddress?.postalCode}
                            labelId="grscicoll.postalCode"
                          />
                          <Property
                            value={institution?.mailingAddress?.address}
                            labelId="grscicoll.address"
                          />
                        </Properties>
                      </Value>
                    </>
                  )}
                </Properties>
                <div className="flex flex-wrap -m-2">
                  {contacts?.map((contact) => {
                    if (!contact) return null;
                    return (
                      <Card
                        key={contact.key}
                        className="px-4 py-3 flex-auto max-w-sm min-w-xs m-2 w-1/2"
                      >
                        <ContactHeader>
                          <ContactAvatar
                            firstName={contact.firstName}
                            lastName={contact.lastName}
                          />
                          <ContactHeaderContent>
                            <ContactTitle
                              firstName={contact.firstName}
                              lastName={contact.lastName}
                            ></ContactTitle>
                            {contact.position?.length > 0 && (
                              <ContactDescription>
                                {contact.position.map((position) => position).join(', ')}
                              </ContactDescription>
                            )}
                          </ContactHeaderContent>
                        </ContactHeader>
                        <ContactContent className="mb-2">
                          {contact.taxonomicExpertise}
                        </ContactContent>
                        <ContactActions>
                          {contact.email &&
                            contact.email.map((email) => (
                              <ContactEmail key={email} email={email} />
                            ))}
                          {contact.phone &&
                            contact.phone.map((tel) => <ContactTelephone key={tel} tel={tel} />)}
                        </ContactActions>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="grscicoll.identifiers" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Properties
                  style={{ fontSize: 16, marginBottom: 12 }}
                  useDefaultTermWidths
                  breakpoint={800}
                >
                  <Property value={institution.code} labelId="grscicoll.code" showEmpty />
                  {institution?.alternativeCodes?.length > 0 && (
                    <Property
                      value={institution.alternativeCodes}
                      labelId="grscicoll.alternativeCodes"
                    >
                      <ul
                      // css={css`padding: 0; margin: 0; list-style: none;`}
                      >
                        {institution.alternativeCodes.map((x, i) => {
                          return (
                            <li key={`${i}_${x.code}`} className="mb-2">
                              <div>{x.code}</div>
                              <div className="text-slate-500">{x.description}</div>
                            </li>
                          );
                        })}
                      </ul>
                    </Property>
                  )}
                  <Property
                    value={institution.additionalNames}
                    labelId="grscicoll.additionalNames"
                  />
                  {institution?.identifiers?.length > 0 && (
                    <Property value={institution.identifiers} labelId="grscicoll.identifiers">
                      <ul
                      // css={css`padding: 0; margin: 0; list-style: none;`}
                      >
                        {institution.identifiers.map((x, i) => {
                          const IdentifierItem = ({ link, text, type }) => (
                            <li className="mb-4">
                              <div
                                // css={css`color: var(--color400); font-size: 0.9em;`}
                                className="text-slate-500 text-sm"
                              >
                                <FormattedMessage
                                  id={`enums.identifierType.${type}`}
                                  defaultMessage={type}
                                />
                              </div>
                              <div className="prose">
                                <a href={link}>{text}</a>
                              </div>
                            </li>
                          );

                          let identifier = x.identifier;
                          if (['ROR', 'GRID', 'IH_IRN'].includes(x.type)) {
                            if (x.type === 'ROR') {
                              identifier = 'https://ror.org/' + x.identifier;
                            } else if (x.type === 'GRID') {
                              identifier = 'https://grid.ac/institutes/' + x.identifier; // GRID doesn't exists anymore. They left the space and refer to ROR as checked today September 2022
                            } else if (x.type === 'IH_IRN') {
                              identifier =
                                'http://sweetgum.nybg.org/science/ih/herbarium-details/?irn=' +
                                x.identifier.substr(12);
                            }
                            return (
                              <IdentifierItem
                                key={`${i}_${x.identifier}`}
                                link={identifier}
                                type={x.type}
                                text={x.identifier}
                              />
                            );
                          }

                          return (
                            <li key={`${i}_${x.identifier}`} className="mb-4">
                              <div className="text-slate-500 text-sm">
                                <FormattedMessage
                                  id={`enums.identifierType.${x.type}`}
                                  defaultMessage={x.type}
                                />
                              </div>
                              <div>
                                <HyperText className="prose" text={identifier} inline />
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </Property>
                  )}
                </Properties>
              </CardContent>
            </Card>
          </div>
          {!removeSidebar && (
            <aside className="sticky">
              <Card className="mb-4">
                <p>sdflkjh</p>
                <p>sdflkjh</p>
                <p>sdflkjh</p>
                <p>sdflkjh</p>
                <p>sdflkjh</p>
                <p>sdflkjh</p>
                <p>sdflkjh</p>
                <p>aaa</p>
              </Card>
              <Card className="mb-4 sticky top-[--stickyOffset]">
                <CardContent>
                  <ul className="list-none p-0 m-0">
                    <li className="mb-4">
                      <a href="#description">
                        <FormattedMessage id="description" />
                      </a>
                    </li>
                    <li className="mb-4">
                      <a href="#contacts">
                        <FormattedMessage id="contacts" />
                      </a>
                    </li>
                    <li className="mb-4">
                      <a href="#identifiers">
                        <FormattedMessage id="Indentifiers" />
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </aside>
          )}
        </div>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
