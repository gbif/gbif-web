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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import {
  CardContentSmall,
  CardHeaderSmall,
  CardSmall,
  CardTitleSmall,
} from '@/components/ui/smallCard';
import { PublisherQuery } from '@/gql/graphql';
import useBelow from '@/hooks/useBelow';
import { RouteId, useParentRouteLoaderData } from '@/hooks/useParentRouteLoaderData';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { MdDownload, MdMap } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

export function PublisherKeyAbout() {
  const { data } = useParentRouteLoaderData(RouteId.Publisher) as { data: PublisherQuery };
  const removeSidebar = useBelow(1100);

  const { publisher } = data;

  if (!publisher) {
    return null;
  }

  const technicalContact = publisher.contacts?.find((x) => x.type === 'TECHNICAL_POINT_OF_CONTACT');

  const ActivityReport = () => (
    <CardSmall className="mb-4">
      <CardHeaderSmall className="">
        <CardTitleSmall className="flex text-sm">
          <div className="flex-none me-2">
            <div className="leading-6 bg-primary-500 text-white rounded-full w-6 h-6 flex justify-center items-center">
              <MdDownload />
            </div>
          </div>
          <div className="flex-auto">
            <a
              href={`${
                import.meta.env.PUBLIC_API_V1
              }/occurrence/download/statistics/export?publishingOrgKey=${publisher.key}`}
            >
              <FormattedMessage id="publisher.getDownloadReport" />
            </a>
          </div>
        </CardTitleSmall>
      </CardHeaderSmall>
    </CardSmall>
  );

  const Logo = () => {
    if (!publisher?.logoUrl) return null;
    return (
      <CardSmall className="mb-4">
        <div className="p-2 md:p-4">
          <img className="m-auto max-w-100 max-h-48" src={publisher.logoUrl} alt="" />
        </div>
      </CardSmall>
    );
  };

  const Map = () => {
    return (
      <CardSmall className="mb-4">
        {publisher.longitude && (
          <a
            className="block"
            href={`http://www.google.com/maps/place/${publisher.latitude},${publisher.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              style={{ width: '100%', display: 'block' }}
              src={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/static/pin-s-circle+285A98(${publisher.longitude},${publisher.latitude})/${publisher.longitude},${publisher.latitude},15,0/500x250@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
            />
          </a>
        )}
        <CardContentSmall className="mt-4">
          <div className="flex">
            <div className="flex-none me-2">
              <div className="leading-6 bg-primary-500 text-white rounded-full w-6 h-6 flex justify-center items-center">
                <MdMap />
              </div>
            </div>
            <div className="flex-auto text-sm prose">
              <address style={{ fontStyle: 'normal' }}>
                <div>
                  {publisher.address && publisher.address.length > 0 ? (
                    <>
                      {publisher.address.map((x) => (
                        <div>{x}</div>
                      ))}
                    </>
                  ) : (
                    <span style={{ color: '#aaa' }}>No known postal address</span>
                  )}
                </div>
                {publisher.city && <div>{publisher.city}</div>}
                {publisher.province && <div>{publisher.province}</div>}
                {publisher.postalCode && <div>{publisher.postalCode}</div>}
                {publisher.country && (
                  <div>
                    <FormattedMessage id={`enums.countryCode.${publisher.country}`} />
                  </div>
                )}
                {publisher.email && (
                  <div>
                    <a href={`mailto:${publisher.email}`}>{publisher.email}</a>
                  </div>
                )}
                {publisher.phone && (
                  <div>
                    <a href={`tel:${publisher.phone}`}>{publisher.phone}</a>
                  </div>
                )}
              </address>
            </div>
          </div>
        </CardContentSmall>
      </CardSmall>
    );
  };

  const Provenance = () => {
    return (
      <CardSmall className="mb-4 prose">
        <CardContentSmall className="mt-4 text-sm">
          {publisher.endorsingNode && (
            <div style={{ marginBottom: 18 }}>
              <CardTitleSmall className="mb-2">
                Endorsed by: <a href="/country/FR">{publisher.endorsingNode.title}</a>
              </CardTitleSmall>
              <p>
                Publishers need to be endorsed by a GBIF Participant Node. This endorsement confirms
                that the publisher is a legitimate organization and that it is committed to sharing
                biodiversity data through GBIF.
              </p>
            </div>
          )}
          {publisher?.installation?.count === 1 && (
            <div style={{ marginBottom: 18 }}>
              <CardTitleSmall className="mb-2">
                Installations:{' '}
                {publisher?.installation.results.map((x) => (
                  <a href="/installation/1234-1234-1234-1234">{x.title} </a>
                ))}
              </CardTitleSmall>
              <p>
                Some publishers run their own technical installations through which data is
                published to GBIF. Some installations are collaborations and may be shared by
                multiple publishers.
              </p>
            </div>
          )}
          {publisher?.installation?.count > 1 && (
            <div style={{ marginBottom: 18 }}>
              <CardTitleSmall className="mb-2">
                Installations:{' '}
                <ul>
                  {publisher?.installation.results.map((x) => (
                    <li>
                      <a href="/installation/1234-1234-1234-1234">{x.title} </a>
                    </li>
                  ))}
                </ul>
              </CardTitleSmall>
              <p>
                Some publishers run their own technical installations through which data is
                published to GBIF. Some installations are collaborations and may be shared by
                multiple publishers.
              </p>
            </div>
          )}
          {technicalContact?.email && (
            <div style={{ marginBottom: 18 }}>
              <CardTitleSmall className="mb-2">
                Techincal contact:{' '}
                <a href={`mailto:${technicalContact.email}`}>
                  {technicalContact.firstName} {technicalContact.lastName}
                </a>
              </CardTitleSmall>
              <p>
                Who to get in contact with in case of IT related questions. Not for biodiversity
                specific questions.
              </p>
            </div>
          )}
          {publisher.country && (
            <div style={{ marginBottom: 18 }}>
              <CardTitleSmall className="mb-2">
                Country or area:{' '}
                <a href="/installation/1234-1234-1234-1234">
                  <FormattedMessage id={`enums.countryCode.${publisher.country}`} />
                </a>
              </CardTitleSmall>
              <p>
                The country or area where the publisher is located. For international organizations,
                this is the country where the main office is located.
              </p>
            </div>
          )}
        </CardContentSmall>
      </CardSmall>
    );
  };

  return (
    <ArticleContainer className="bg-slate-100 pt-4">
      <ArticleTextContainer className="max-w-screen-xl">
        <div className={`${removeSidebar ? '' : 'flex'}`}>
          <div className="flex-grow">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="phrases.headers.description" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {publisher?.description && (
                  <div
                    className="prose mb-6"
                    dangerouslySetInnerHTML={{ __html: publisher.description }}
                  ></div>
                )}
              </CardContent>
            </Card>

            {publisher?.contacts?.length > 0 && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="phrases.headers.contacts" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap -m-2">
                    {publisher?.contacts?.map((contact) => {
                      return (
                        <Card
                          key={contact.key}
                          className="px-6 py-4 flex-auto max-w-sm min-w-xs m-2 w-1/2"
                        >
                          <ContactHeader>
                            <ContactAvatar
                              firstName={contact.firstName}
                              lastName={contact.lastName}
                              organization={contact?.organization}
                            />
                            <ContactHeaderContent>
                              <ContactTitle
                                firstName={contact.firstName}
                                lastName={contact.lastName}
                              ></ContactTitle>
                              {contact.type && (
                                <ContactDescription>
                                  <FormattedMessage id={`enums.role.${contact.type}`} />
                                </ContactDescription>
                              )}
                            </ContactHeaderContent>
                          </ContactHeader>
                          <ContactContent className="mb-2"></ContactContent>
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
            )}
          </div>
          {!removeSidebar && (
            <aside className="flex-none min-w-80 w-80 ml-4">
              <ActivityReport />
              <Logo />
              <Map />
              <Provenance />
            </aside>
          )}
          {removeSidebar && (
            <div className="sm:flex flex-full">
              <div className="flex-[1_1_50%] me-2">
                <ActivityReport />
                <Map />
              </div>
              <div className="flex-[1_1_50%] ms-2">
                <Provenance />
                <Logo />
              </div>
            </div>
          )}
        </div>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
