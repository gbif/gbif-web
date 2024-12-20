import { BulletList } from '@/components/bulletList';
import { ConceptValue } from '@/components/conceptValue';
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
} from '@/components/contact';
import { useCount } from '@/components/count';
import { FormattedNumber } from '@/components/dashboard/shared';
import { HyperText } from '@/components/hyperText';
import Properties, { Property, Term, Value } from '@/components/properties';
import { Tag } from '@/components/resultCards';
import { TableOfContents } from '@/components/tableOfContents';
import { GbifLinkCard } from '@/components/TocHelp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Card as CardSmall } from '@/components/ui/smallCard';
import useBelow from '@/hooks/useBelow';
import { DynamicLink } from '@/reactRouterPlugins';
import { FeaturedImageContent } from '@/routes/collection/key/collectionKeyPresentation';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { isNoneEmptyArray } from '@/utils/isNoneEmptyArray';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useInstitutionKeyLoaderData } from '.';
// import { MdMap } from 'react-icons/md';

export default function About() {
  const { key } = useParams();
  const { data } = useInstitutionKeyLoaderData();
  const { count, loading } = useCount({
    v1Endpoint: '/occurrence/search',
    params: { institutionKey: key },
  });
  const removeSidebar = useBelow(1100);
  const useInlineImage = useBelow(700);
  const { institution } = data;

  const tableOfContents = useMemo(
    () => [
      { id: 'description', title: <FormattedMessage id="Description" /> },
      {
        id: 'collections',
        title: <FormattedMessage id="Collections" />,
        hidden: !institution?.collections?.length,
      },
      { id: 'contacts', title: <FormattedMessage id="Contacts" /> },
      { id: 'identifiers', title: <FormattedMessage id="Identifiers" /> },
    ],
    [institution]
  );

  if (!institution) return null;

  const addressesIdentical =
    JSON.stringify(institution?.mailingAddress) === JSON.stringify(institution?.address);
  const contacts = institution?.contactPersons.filter((x) => x.firstName);

  const imageUrl = institution.featuredImageUrl ?? institution.featuredImageUrl_fallback;

  // const institutionAddress = institution?.mailingAddress ?? institution?.address;

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <div
          className={`${removeSidebar ? '' : 'g-grid g-gap-4 g-grid-cols-[minmax(0,1fr)_350px]'}`}
        >
          <div className="">
            <Card className="g-mb-4" id="description">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="dataset.description" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {institution?.description && (
                  <div
                    className="g-prose g-mb-6 g-max-w-full"
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
                  {!loading && count > 0 && (
                    <Property labelId="grscicoll.specimensViaGbif">
                      <FormattedNumber value={count} />
                    </Property>
                  )}
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
              <Card className="g-mb-4">
                <FeaturedImageContent
                  featuredImageUrl={imageUrl}
                  featuredImageLicense={
                    institution.featuredImageUrl ? institution.featuredImageLicense : null
                  }
                />
              </Card>
            )}

            {isNoneEmptyArray(institution.collections) && (
              <div id="collections" className="g-scroll-mt-24">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="institution.collections" defaultMessage="Collections" />
                  </CardTitle>
                </CardHeader>
                <Card className="g-relative g-overflow-x-auto g-rounded g-border g-mb-4">
                  <table className="g-w-full g-text-sm g-text-left rtl:g-text-right g-text-gray-500 dark:g-text-gray-400">
                    <thead className="g-text-slate-500 g-font-light g-bg-gray-50 dark:g-bg-gray-700 dark:g-text-gray-400 g-border-b">
                      <tr>
                        <th scope="col" className="g-px-6 g-py-3 g-font-normal">
                          Name
                        </th>
                        <th scope="col" className="g-px-1 g-py-3 g-font-normal">
                          Code
                        </th>
                        <th scope="col" className="g-px-1 g-py-3 g-font-normal">
                          Description
                        </th>
                        <th
                          scope="col"
                          className="g-px-6 g-py-3 g-font-normal g-text-right rtl:g-text-left"
                        >
                          Specimens
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {institution?.collections?.map((collection) => {
                        return (
                          <tr
                            key={collection.key}
                            className="g-bg-white g-border-b last:g-border-0 dark:g-bg-gray-800 dark:g-border-gray-700"
                          >
                            <td
                              scope="row"
                              className="g-px-6 g-py-3 g-font-medium g-text-slate-900 dark:g-text-white g-min-w-80"
                            >
                              <DynamicLink
                                className="g-underline"
                                to={`/collection/${collection.key}`}
                                pageId="collectionKey"
                                variables={{ key: collection.key }}
                              >
                                {collection.name}
                              </DynamicLink>{' '}
                              {!collection.active && (
                                <Tag className="g-bg-red-700 g-text-white">Inactive</Tag>
                              )}
                            </td>
                            <td className="g-px-1 g-py-3">
                              <Tag className="g-whitespace-nowrap">{collection.code}</Tag>
                            </td>
                            <td className="g-px-1 g-py-3">
                              <div
                                className="g-line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: collection.excerpt }}
                              ></div>
                            </td>
                            <td className="g-px-6 g-py-3 g-text-right rtl:g-text-left">
                              <FormattedNumber value={collection.numberSpecimens} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}

            <Card className="g-mb-4" id="contacts">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="dataset.contacts" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Properties useDefaultTermWidths className="g-mb-8">
                  {isNoneEmptyArray(institution.email) && (
                    <Property
                      labelId="grscicoll.email"
                      className="g-prose"
                      value={institution.email}
                      formatter={(email) => (
                        <a href={`mailto:${email}`} className="">
                          {email}
                        </a>
                      )}
                    ></Property>
                  )}
                  <Property labelId="grscicoll.homepage">
                    <HyperText className="g-prose" text={institution?.homepage} />
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
                <div className="g-flex g-flex-wrap -g-m-2">
                  {contacts?.map((contact) => {
                    if (!contact) return null;
                    return (
                      <Card
                        key={contact.key}
                        className="g-px-4 g-py-3 g-flex-auto g-max-w-sm g-min-w-xs g-m-2 g-w-1/2"
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
                        <ContactContent className="g-mb-2">
                          {contact.taxonomicExpertise.length > 0 && (
                            <>
                              Taxonomic expertice:{' '}
                              <BulletList>
                                {contact.taxonomicExpertise.map((expertise) => (
                                  <li key={expertise}>{expertise}</li>
                                ))}
                              </BulletList>
                            </>
                          )}
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

            <Card className="g-mb-4" id="identifiers">
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
                  {isNoneEmptyArray(institution.alternativeCodes) && (
                    <Property
                      value={institution.alternativeCodes}
                      labelId="grscicoll.alternativeCodes"
                    >
                      <ul
                      // css={css`padding: 0; margin: 0; list-style: none;`}
                      >
                        {institution.alternativeCodes.map((x, i) => {
                          return (
                            <li key={`${i}_${x.code}`} className="g-mb-2">
                              <div>{x.code}</div>
                              <div className="g-text-slate-500">{x.description}</div>
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
                  {isNoneEmptyArray(institution.identifiers) && (
                    <Property value={institution.identifiers} labelId="grscicoll.identifiers">
                      <ul
                      // css={css`padding: 0; margin: 0; list-style: none;`}
                      >
                        {institution.identifiers.map((x, i) => {
                          const IdentifierItem = ({ link, text, type }) => (
                            <li className="g-mb-4">
                              <div
                                // css={css`color: var(--color400); font-size: 0.9em;`}
                                className="g-text-slate-500 g-text-sm"
                              >
                                <FormattedMessage
                                  id={`enums.identifierType.${type}`}
                                  defaultMessage={type}
                                />
                              </div>
                              <div className="g-prose">
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
                            <li key={`${i}_${x.identifier}`} className="g-mb-4">
                              <div className="g-text-slate-500 g-text-sm">
                                <FormattedMessage
                                  id={`enums.identifierType.${x.type}`}
                                  defaultMessage={x.type}
                                />
                              </div>
                              <div>
                                <HyperText className="g-prose" text={identifier} inline />
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
            <aside className="g-sticky">
              {institution.longitude && (
                <CardSmall className="">
                  <a
                    className="g-block"
                    href={`http://www.google.com/maps/place/${institution.latitude},${institution.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      style={{ width: '100%', display: 'block' }}
                      src={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/static/pin-s-circle+285A98(${institution.longitude},${institution.latitude})/${institution.longitude},${institution.latitude},15,0/400x250@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
                    />
                  </a>

                  {/* <CardContentSmall className='g-mt-4'>
                  <div className='g-flex'>
                    <div className='g-flex-none g-me-2'>
                      <div className='g-leading-6 g-bg-primary-500 g-text-white g-rounded-full g-w-6 g-h-6 g-flex g-justify-center g-items-center'>
                        <MdMap />
                      </div>
                    </div>
                    <div className='g-flex-auto g-text-sm g-prose'>
                      <address style={{ fontStyle: 'normal' }}>
                        {institutionAddress.address && <div>
                          {institutionAddress.address}
                        </div>}
                        {institutionAddress.city && <div>{institutionAddress.city}</div>}
                        {institutionAddress.province && <div>{institutionAddress.province}</div>}
                        {institutionAddress.postalCode && <div>{institutionAddress.postalCode}</div>}
                        {institutionAddress.country && (
                          <div>
                            <FormattedMessage id={`enums.countryCode.${institutionAddress.country}`} />
                          </div>
                        )}
                        {institutionAddress.email && (
                          <div>
                            <a href={`mailto:${institutionAddress.email}`}>{institutionAddress.email}</a>
                          </div>
                        )}
                        {institutionAddress.phone && (
                          <div>
                            <a href={`tel:${institutionAddress.phone}`}>{institutionAddress.phone}</a>
                          </div>
                        )}
                      </address>
                    </div>
                  </div>
                </CardContentSmall> */}
                </CardSmall>
              )}
              <div className="g-pt-4 g-sticky g-top-[--stickyOffset]">
                <TableOfContents sections={tableOfContents} />
                <GbifLinkCard path={`/grscicoll/institution/${institution.key}`} />
              </div>
            </aside>
          )}
        </div>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
