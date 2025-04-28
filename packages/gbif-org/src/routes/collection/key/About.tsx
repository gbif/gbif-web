import { ClientSideOnly } from '@/components/clientSideOnly';
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
import * as charts from '@/components/dashboard';
import EmptyValue from '@/components/emptyValue';
import { HyperText } from '@/components/hyperText';
import { AdHocMapThumbnail } from '@/components/maps/mapThumbnail';
import Properties, { Property, Term, Value } from '@/components/properties';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import useBelow from '@/hooks/useBelow';
import { DynamicLink } from '@/reactRouterPlugins';
import { GrSciCollMetadata } from '@/routes/institution/key/MetaData';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { isNoneEmptyArray } from '@/utils/isNoneEmptyArray';
import { useContext } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useCollectionKeyLoaderData } from '.';
import { CollectionKeyContext, FeaturedImageContent } from './collectionKeyPresentation';
import { DescriptorGroups } from './DescriptorGroups';

export default function About() {
  const { key } = useParams();
  const { data } = useCollectionKeyLoaderData();
  const { contentMetrics } = useContext(CollectionKeyContext);
  const { count, loading } = useCount({
    v1Endpoint: '/occurrence/search',
    params: { collectionKey: key },
  });
  const removeSidebarThreshold = useBelow(1100);
  const useInlineImage = useBelow(700);
  const { collection } = data;

  if (!collection) return null;
  const predicate = {
    type: 'equals',
    key: 'collectionKey',
    value: collection?.key,
  };

  const addressesIdentical =
    JSON.stringify(collection?.mailingAddress) === JSON.stringify(collection?.address);
  const contacts = collection?.contactPersons.filter((x) => x.firstName);

  const imageUrl = collection.featuredImageUrl ?? collection.featuredImageUrl_fallback;

  const removeSidebar = removeSidebarThreshold || (count ?? 0) < 1;
  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <div className={`${removeSidebar ? '' : 'g-flex'}`}>
          <div className="g-flex-grow">
            <Card className="g-mb-4">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="dataset.description" />
                </CardTitle>
              </CardHeader>
              <CardContent className="[&_a]:g-text-primary-500">
                <div className="g-prose g-mb-6 g-max-w-full">
                  {collection?.description && (
                    <div dangerouslySetInnerHTML={{ __html: collection.description }}></div>
                  )}
                  {!collection.description && <EmptyValue />}
                </div>
                <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
                  {/* <Property value={collection.description} labelId="grscicoll.description" showEmpty /> */}
                  <Property
                    value={collection.taxonomicCoverage}
                    labelId="grscicoll.taxonomicDescription"
                    showEmpty
                  />
                  <Property
                    value={collection.geographicCoverage}
                    labelId="grscicoll.geographicDescription"
                    showEmpty
                  />
                  <Property
                    value={collection.temporalCoverage}
                    labelId="grscicoll.temporalDescription"
                    showEmpty
                  />
                  {collection.notes && (
                    <Property value={collection.notes} labelId="grscicoll.notes">
                      <HyperText className="dataProse [&_a]:g-underline" text={collection.notes} />
                    </Property>
                  )}
                  <Property value={collection.code} labelId="grscicoll.code" showEmpty />
                  <Property
                    value={collection.numberSpecimens}
                    labelId="collection.numberSpecimens"
                  />
                  {!loading && count > 0 && (
                    <Property labelId="grscicoll.specimensViaGbif">
                      <DynamicLink to="./specimens">
                        <FormattedNumber value={count} />
                      </DynamicLink>
                    </Property>
                  )}
                  <Property value={collection.catalogUrls} labelId="grscicoll.catalogUrl">
                    <ul>
                      {collection.catalogUrls.map((url, i) => (
                        <li key={i}>
                          <a key={url} href={url} target="_blank" rel="noreferrer">
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Property>
                  <Property labelId="grscicoll.apiUrl" value={collection.apiUrls}>
                    <ul>
                      {collection.apiUrls.map((url, i) => (
                        <li key={i}>
                          <a key={url} href={url} target="_blank" rel="noreferrer">
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Property>
                  {collection.homepage && (
                    <Property value={collection.homepage} labelId="grscicoll.homepage" showEmpty>
                      <HyperText text={collection.homepage} />
                    </Property>
                  )}
                  <Property
                    value={collection.contentTypes}
                    labelId="collection.contentTypes"
                    formatter={(val) => (
                      <ConceptValue vocabulary="CollectionContentType" name={val} />
                    )}
                  />
                  <Property
                    value={collection.preservationTypes}
                    labelId="collection.preservationTypes"
                    formatter={(val) => <ConceptValue vocabulary="PreservationType" name={val} />}
                  />
                  <Property
                    value={collection.accessionStatus}
                    labelId="collection.accessionStatus"
                    formatter={(val) => <ConceptValue vocabulary="AccessionStatus" name={val} />}
                  />

                  <Property
                    value={collection.incorporatedCollections}
                    labelId="grscicoll.incorporatedCollections"
                  />
                  {collection.personalCollection && (
                    <Property
                      value={collection.personalCollection}
                      labelId="collection.personalCollection"
                      formatter={(e) => (
                        <FormattedMessage id={`enums.yesNo.${e}`} defaultMessage={e} />
                      )}
                    />
                  )}
                </Properties>
              </CardContent>
            </Card>
            {collection?.descriptorGroups?.count > 0 && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage
                      id="grscicoll.collectionDescriptorsHeadline"
                      deafultMessage="Collection description"
                    />
                  </CardTitle>

                  <div className="g-text-slate-500 g-mb-4">
                    <FormattedMessage
                      id="grscicoll.collectionDescriptorsIntroduction"
                      deafultMessage="Collection description"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <DescriptorGroups collectionKey={key} />
                </CardContent>
              </Card>
            )}

            {useInlineImage && (
              <Card className="g-mb-4">
                <FeaturedImageContent
                  featuredImageUrl={imageUrl}
                  featuredImageLicense={
                    collection.featuredImageUrl ? collection.featuredImageLicense : null
                  }
                />
              </Card>
            )}

            {/* <AdHocMapThumbnail
                filter={{ collectionKey: collection.key }}
                className='g-rounded g-border'
              /> */}

            {/* <section>
              <CardHeader>
                <CardTitle>
                  <span className='g-me-2'>
                    <FormattedMessage id="dataset.metrics" />
                  </span>
                  <SimpleTooltip
                    title={<FormattedMessage id="dataset.metricsOccurrenceHelpText" />}
                  >
                    <span>
                      <MdInfoOutline style={{ verticalAlign: 'middle' }} />
                    </span>
                  </SimpleTooltip>
                </CardTitle>
              </CardHeader>
              <ClientSideOnly>
                <DashBoardLayout>
                  <charts.OccurrenceSummary predicate={predicate} className='g-mb-2' />
                  <charts.DataQuality predicate={predicate} className='g-mb-2' />
                  <charts.Taxa predicate={predicate} className='g-mb-2' />
                </DashBoardLayout>
              </ClientSideOnly>
            </section> */}

            <Card className="g-mb-4" id="contact">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="dataset.contacts" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Properties useDefaultTermWidths className="g-mb-8 [&_a]:g-text-primary-500">
                  {isNoneEmptyArray(collection.email) && (
                    <Property
                      labelId="grscicoll.email"
                      className=""
                      value={collection.email}
                      formatter={(email) => (
                        <a className="g-underline" href={`mailto:${email}`}>
                          {email}
                        </a>
                      )}
                    ></Property>
                  )}
                  <Property labelId="grscicoll.homepage">
                    <HyperText className="dataProse g-underline" text={collection?.homepage} />
                  </Property>
                  {isNoneEmptyArray(collection.phone) && (
                    <Property
                      labelId="grscicoll.phone"
                      className=""
                      value={collection.phone}
                      formatter={(phone) => (
                        <a className="g-underline" href={`tel:${phone}`}>
                          {phone}
                        </a>
                      )}
                    ></Property>
                  )}
                  <Property
                    value={collection?.address?.country}
                    labelId="grscicoll.country"
                    showEmpty
                    formatter={(countryCode) => (
                      <FormattedMessage id={`enums.countryCode.${countryCode}`} />
                    )}
                  />
                  <Property value={collection?.address?.province} labelId="grscicoll.province" />
                  <Property value={collection?.address?.city} labelId="grscicoll.city" />
                  <Property
                    value={collection?.address?.postalCode}
                    labelId="grscicoll.postalCode"
                  />
                  <Property value={collection?.address?.address} labelId="grscicoll.address" />
                  {!addressesIdentical && (
                    <>
                      <Term>
                        <FormattedMessage id="grscicoll.mailingAddress" />
                      </Term>
                      <Value>
                        <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
                          <Property
                            value={collection?.mailingAddress?.country}
                            labelId="grscicoll.country"
                            showEmpty
                            formatter={(countryCode) => (
                              <FormattedMessage id={`enums.countryCode.${countryCode}`} />
                            )}
                          />
                          <Property
                            value={collection?.mailingAddress?.province}
                            labelId="grscicoll.province"
                          />
                          <Property
                            value={collection?.mailingAddress?.city}
                            labelId="grscicoll.city"
                          />
                          <Property
                            value={collection?.mailingAddress?.postalCode}
                            labelId="grscicoll.postalCode"
                          />
                          <Property
                            value={collection?.mailingAddress?.address}
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
                        className="g-px-6 g-py-4 g-flex-auto g-max-w-sm g-min-w-xs g-m-2 g-w-1/2"
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
                            {isNoneEmptyArray(contact.position) && (
                              <ContactDescription>
                                {contact.position.map((position) => position).join(', ')}
                              </ContactDescription>
                            )}
                          </ContactHeaderContent>
                        </ContactHeader>
                        <ContactContent className="g-mb-2">
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

            <Card className="g-mb-4">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="grscicoll.identifiers" />
                </CardTitle>
              </CardHeader>
              <CardContent className="[&_a]:g-text-primary-500">
                <Properties
                  style={{ fontSize: 16, marginBottom: 12 }}
                  useDefaultTermWidths
                  breakpoint={800}
                >
                  <Property value={collection.code} labelId="grscicoll.code" showEmpty />
                  {isNoneEmptyArray(collection.alternativeCodes) && (
                    <Property
                      value={collection.alternativeCodes}
                      labelId="grscicoll.alternativeCodes"
                    >
                      <ul
                      // css={css`padding: 0; margin: 0; list-style: none;`}
                      >
                        {collection.alternativeCodes.map((x, i) => {
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
                    value={collection.additionalNames}
                    labelId="grscicoll.additionalNames"
                  />
                  {isNoneEmptyArray(collection.identifiers) && (
                    <Property value={collection.identifiers} labelId="grscicoll.identifiers">
                      <ul
                      // css={css`padding: 0; margin: 0; list-style: none;`}
                      >
                        {collection.identifiers.map((x, i) => {
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
                              <div>
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
                                <HyperText text={identifier} />
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
            <aside className="g-flex-none g-w-96 g-ms-4">
              <>
                {contentMetrics?.withCoordinates?.documents?.total > 0 && (
                  <div className="g-max-w-64 md:g-max-w-96 g-mb-4">
                    <AdHocMapThumbnail
                      params={
                        contentMetrics?.withCoordinates?.documents?.total < 100
                          ? { bin: 'hex', hexPerTile: '20', style: 'red.poly' }
                          : null
                      }
                      filter={{ collectionKey: collection.key }}
                      className="g-rounded g-border"
                    />
                  </div>
                )}
                <ClientSideOnly>
                  <charts.OccurrenceSummary predicate={predicate} className="g-mb-4" />
                  <charts.DataQuality predicate={predicate} className="g-mb-4" />
                </ClientSideOnly>
              </>
            </aside>
          )}
        </div>
        {collection && <GrSciCollMetadata entity={collection} />}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
