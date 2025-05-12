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
import { TableOfContents } from '@/components/tableOfContents';
import { GbifLinkCard } from '@/components/TocHelp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import useBelow from '@/hooks/useBelow';
import { DynamicLink } from '@/reactRouterPlugins';
import { FeaturedImageContent } from '@/routes/collection/key/collectionKeyPresentation';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { isNoneEmptyArray } from '@/utils/isNoneEmptyArray';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useInstitutionKeyLoaderData } from '.';
import { GrSciCollMetadata } from './MetaData';
// import { MdMap } from 'react-icons/md';

const GBIF_REGISTRY_ENDPOINT = import.meta.env.PUBLIC_REGISTRY;

export default function About() {
  const { key } = useParams();
  const { data } = useInstitutionKeyLoaderData();
  const { count, loading } = useCount({
    v1Endpoint: '/occurrence/search',
    params: { institutionKey: key },
  });
  const removeSidebar = true; //useBelow(1100);
  const useInlineImage = useBelow(800);
  const { institution } = data;

  const tableOfContents = [
    { id: 'description', title: <FormattedMessage id="grscicoll.description" /> },
    { id: 'contacts', title: <FormattedMessage id="grscicoll.contacts" /> },
    { id: 'identifiers', title: <FormattedMessage id="grscicoll.identifiers" /> },
  ];

  if (!institution) return null;

  const addressesIdentical =
    JSON.stringify(institution?.mailingAddress) === JSON.stringify(institution?.address);
  const contacts = institution?.contactPersons.filter((x) => x.firstName);

  const imageUrl = institution.featuredImageUrl ?? institution.featuredImageUrl_fallback;

  // const institutionAddress = institution?.mailingAddress ?? institution?.address;

  // filter identifiers to to see if any if them as a primary flag set to true
  const primaryIdentifiers = institution?.identifiers?.filter((x) => x.primary === true) ?? [];

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
              <CardContent className="[&_a]:g-text-primary-500">
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
                      <DynamicLink to="./specimens">
                        <FormattedNumber value={count} />
                      </DynamicLink>
                    </Property>
                  )}
                  {institution.catalogUrls && (
                    <Property
                      value={institution.catalogUrls}
                      formatter={(x) => (
                        <a href={x} target="_blank" rel="noreferrer" key={x}>
                          {x}
                        </a>
                      )}
                      labelId="grscicoll.catalogUrl"
                    />
                  )}
                  <Property value={institution.apiUrls} labelId="grscicoll.apiUrl" />
                  <Property
                    value={institution.disciplines}
                    labelId="institution.disciplines"
                    showEmpty
                    formatter={(val) => <ConceptValue vocabulary="Discipline" name={val} />}
                  />
                  {institution.foundingDate && (
                    <Property
                      labelId="grscicoll.foundingDate"
                      value={institution.foundingDate.toString()}
                    ></Property>
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

            <Card className="g-mb-4" id="contacts">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="dataset.contacts" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Properties useDefaultTermWidths className="g-mb-8 [&_a]:g-text-primary-500">
                  {isNoneEmptyArray(institution.email) && (
                    <Property
                      labelId="grscicoll.email"
                      value={institution.email}
                      formatter={(email) => (
                        <a href={`mailto:${email}`} className="">
                          {email}
                        </a>
                      )}
                    ></Property>
                  )}
                  <Property labelId="grscicoll.homepage">
                    <HyperText text={institution?.homepage} />
                  </Property>
                  {isNoneEmptyArray(institution.phone) && (
                    <Property
                      labelId="grscicoll.phone"
                      className=""
                      value={institution.phone}
                      formatter={(phone) => (
                        <a className="g-underline" href={`tel:${phone}`}>
                          {phone}
                        </a>
                      )}
                    ></Property>
                  )}
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
              <CardContent className="[&_a]:g-text-primary-500">
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
                        <li className="g-mb-4">
                          <div
                            // css={css`color: var(--color400); font-size: 0.9em;`}
                            className="g-text-slate-500 g-text-sm"
                          >
                            <FormattedMessage
                              id={`phrases.gbifIdentifier`}
                              defaultMessage="GBIF identifier"
                            />
                          </div>
                          <div>{institution.key}</div>
                        </li>

                        {primaryIdentifiers.map((x, i) => {
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
                        {primaryIdentifiers.length < institution.identifiers.length && (
                          <li className="g-mb-4">
                            <div
                              // css={css`color: var(--color400); font-size: 0.9em;`}
                              className="g-text-slate-500 g-text-sm"
                            >
                              <a
                                href={`${GBIF_REGISTRY_ENDPOINT}/institution/${institution.key}/identifier`}
                              >
                                <FormattedMessage
                                  id={`phrases.otherIdentifiers`}
                                  defaultMessage="Other identifiers"
                                />
                              </a>
                            </div>
                          </li>
                        )}
                      </ul>
                    </Property>
                  )}
                </Properties>
              </CardContent>
            </Card>
          </div>
          {!removeSidebar && (
            <aside className="g-sticky">
              <div className="-g-mt-4 g-pt-4 g-sticky g-top-[--stickyOffset]">
                <TableOfContents sections={tableOfContents} />
                <GbifLinkCard path={`/grscicoll/institution/${institution.key}`} />
              </div>
            </aside>
          )}
        </div>
        {institution && <GrSciCollMetadata entity={institution} />}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
