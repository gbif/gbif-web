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
import Properties, { Property, Term, Value } from '@/components/properties';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import useBelow from '@/hooks/useBelow';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { FeaturedImageContent } from './taxonKeyPresentation';
import { HyperText } from '@/components/hyperText';
import { AdHocMapThumbnail } from '@/components/mapThumbnail';
import { ConceptValue } from '@/components/conceptValue';
import * as charts from '@/components/dashboard';
import { GbifLinkCard } from '@/components/TocHelp';
import { useParams } from 'react-router-dom';
import { useCount } from '@/components/count';
import EmptyValue from '@/components/emptyValue';
import { useTaxonKeyLoaderData } from '.';
import { isNoneEmptyArray } from '@/utils/isNoneEmptyArray';

export default function About() {
  const { key } = useParams();
  const { data } = useTaxonKeyLoaderData();
  const { count, loading } = useCount({
    v1Endpoint: '/occurrence/search',
    params: { taxonKey: key },
  });
  const removeSidebar = useBelow(1100);
  const useInlineImage = useBelow(700);
  const { taxon } = data;

  if (!taxon) return null;
  const predicate = {
    type: 'equals',
    key: 'taxonKey',
    value: taxon?.key,
  };

/*   const addressesIdentical =
    JSON.stringify(taxon?.mailingAddress) === JSON.stringify(taxon?.address);
  const contacts = taxon?.contactPersons.filter((x) => x.firstName);

  const imageUrl = taxon.featuredImageUrl ?? taxon.featuredImageUrl_fallback; */
console.log(data)
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
              <CardContent>
                <div className="g-prose g-mb-6 g-max-w-full">
                  {taxon?.description && (
                    <div dangerouslySetInnerHTML={{ __html: taxon.description }}></div>
                  )}
                  {!taxon.description && <EmptyValue />}
                </div>
                <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
                  {/* <Property value={taxon.description} labelId="grscicoll.description" showEmpty /> */}
                  <Property
                    value={taxon.taxonomicCoverage}
                    labelId="grscicoll.taxonomicDescription"
                    showEmpty
                  />
                  <Property
                    value={taxon.geographicCoverage}
                    labelId="grscicoll.geographicDescription"
                    showEmpty
                  />
                  <Property
                    value={taxon.temporalCoverage}
                    labelId="grscicoll.temporalDescription"
                    showEmpty
                  />
                  {taxon.notes && (
                    <Property value={taxon.notes} labelId="grscicoll.notes">
                      <HyperText
                        className="dataProse [&_a]:g-underline"
                        text={taxon.notes}
                        fallback
                      />
                    </Property>
                  )}
                  <Property value={taxon.code} labelId="grscicoll.code" showEmpty />
                  <Property value={taxon.numberSpecimens} labelId="taxon.numberSpecimens" />
                  {!loading && count > 0 && (
                    <Property labelId="grscicoll.specimensViaGbif">
                      <FormattedNumber value={count} />
                    </Property>
                  )}
                  {/* {occurrenceSearch?.documents?.total > 0 && <Property value={occurrenceSearch?.documents?.total} labelId="grscicoll.specimensViaGbif" formatter={count => {
                    return <ResourceLink type="taxonKeySpecimens" id={taxon.key}>
                      <FormattedNumber value={count} />
                    </ResourceLink>
                  }} />} */}
                  <Property
                    value={taxon.catalogUrls}
                    labelId="grscicoll.catalogUrl"
                    formatter={(url) => (
                      <a className="g-underline" href={url}>
                        {url}
                      </a>
                    )}
                  />
                  <Property value={taxon.apiUrls} labelId="grscicoll.apiUrl" />
                  <Property
                    value={taxon.contentTypes}
                    labelId="taxon.contentTypes"
                    formatter={(val) => <ConceptValue vocabulary="TaxonContentType" name={val} />}
                  />
                  <Property
                    value={taxon.preservationTypes}
                    labelId="taxon.preservationTypes"
                    formatter={(val) => <ConceptValue vocabulary="PreservationType" name={val} />}
                  />
                  <Property
                    value={taxon.accessionStatus}
                    labelId="taxon.accessionStatus"
                    formatter={(val) => <ConceptValue vocabulary="AccessionStatus" name={val} />}
                  />

                  <Property
                    value={taxon.incorporatedTaxons}
                    labelId="grscicoll.incorporatedTaxons"
                  />
                  {taxon.personalTaxon && (
                    <Property
                      value={taxon.personalTaxon}
                      labelId="taxon.personalTaxon"
                      formatter={(e) => (
                        <FormattedMessage id={`enums.yesNo.${e}`} defaultMessage={e} />
                      )}
                    />
                  )}
                </Properties>
              </CardContent>
            </Card>

            {useInlineImage && (
              <Card className="g-mb-4">
                <FeaturedImageContent
                  featuredImageUrl={imageUrl}
                  featuredImageLicense={taxon.featuredImageUrl ? taxon.featuredImageLicense : null}
                />
              </Card>
            )}

            {/* <AdHocMapThumbnail
                filter={{ taxonKey: taxon.key }}
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
                <Properties useDefaultTermWidths className="g-mb-8">
                  {isNoneEmptyArray(taxon.email) && (
                    <Property
                      labelId="grscicoll.email"
                      className=""
                      value={taxon.email}
                      formatter={(email) => (
                        <a className="g-underline" href={`mailto:${email}`}>
                          {email}
                        </a>
                      )}
                    ></Property>
                  )}
                  <Property labelId="grscicoll.homepage">
                    <HyperText className="dataProse g-underline" text={taxon?.homepage} />
                  </Property>
                  <Property
                    value={taxon?.address?.country}
                    labelId="grscicoll.country"
                    showEmpty
                    formatter={(countryCode) => (
                      <FormattedMessage id={`enums.countryCode.${countryCode}`} />
                    )}
                  />
                  <Property value={taxon?.address?.province} labelId="grscicoll.province" />
                  <Property value={taxon?.address?.city} labelId="grscicoll.city" />
                  <Property value={taxon?.address?.postalCode} labelId="grscicoll.postalCode" />
                  <Property value={taxon?.address?.address} labelId="grscicoll.address" />
                  {!addressesIdentical && (
                    <>
                      <Term>
                        <FormattedMessage id="grscicoll.mailingAddress" />
                      </Term>
                      <Value>
                        <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
                          <Property
                            value={taxon?.mailingAddress?.country}
                            labelId="grscicoll.country"
                            showEmpty
                            formatter={(countryCode) => (
                              <FormattedMessage id={`enums.countryCode.${countryCode}`} />
                            )}
                          />
                          <Property
                            value={taxon?.mailingAddress?.province}
                            labelId="grscicoll.province"
                          />
                          <Property value={taxon?.mailingAddress?.city} labelId="grscicoll.city" />
                          <Property
                            value={taxon?.mailingAddress?.postalCode}
                            labelId="grscicoll.postalCode"
                          />
                          <Property
                            value={taxon?.mailingAddress?.address}
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
              <CardContent>
                <Properties
                  style={{ fontSize: 16, marginBottom: 12 }}
                  useDefaultTermWidths
                  breakpoint={800}
                >
                  <Property value={taxon.code} labelId="grscicoll.code" showEmpty />
                  {isNoneEmptyArray(taxon.alternativeCodes) && (
                    <Property value={taxon.alternativeCodes} labelId="grscicoll.alternativeCodes">
                      <ul
                      // css={css`padding: 0; margin: 0; list-style: none;`}
                      >
                        {taxon.alternativeCodes.map((x, i) => {
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
                  <Property value={taxon.additionalNames} labelId="grscicoll.additionalNames" />
                  {isNoneEmptyArray(taxon.identifiers) && (
                    <Property value={taxon.identifiers} labelId="grscicoll.identifiers">
                      <ul
                      // css={css`padding: 0; margin: 0; list-style: none;`}
                      >
                        {taxon.identifiers.map((x, i) => {
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
            <aside className="g-flex-none g-w-96 g-ms-4">
              {!!count && count > 0 && (
                <>
                  <div className="g-max-w-64 md:g-max-w-96 g-mb-4">
                    <AdHocMapThumbnail
                      filter={{ taxonKey: taxon.key }}
                      className="g-rounded g-border"
                    />
                  </div>
                  <ClientSideOnly>
                    <charts.OccurrenceSummary predicate={predicate} className="g-mb-4" />
                    <charts.DataQuality predicate={predicate} className="g-mb-4" />
                  </ClientSideOnly>
                </>
              )}

              <GbifLinkCard path={`/grscicoll/taxon/${taxon.key}`} />
            </aside>
          )}
        </div>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
