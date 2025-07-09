import { ClientSideOnly } from '@/components/clientSideOnly';
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
import EmptyValue from '@/components/emptyValue';
import { HelpText } from '@/components/helpText';
import { GbifLinkCard } from '@/components/TocHelp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import {
  CardContent as CardContentSmall,
  CardHeader as CardHeaderSmall,
  Card as CardSmall,
  CardTitle as CardTitleSmall,
} from '@/components/ui/smallCard';
import useBelow from '@/hooks/useBelow';
import { DynamicLink } from '@/reactRouterPlugins';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { isNoneEmptyArray } from '@/utils/isNoneEmptyArray';
import { MdDownload, MdMap } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { usePublisherKeyLoaderData } from '.';

export function PublisherKeyAbout() {
  const { data } = usePublisherKeyLoaderData();
  const removeSidebar = useBelow(1100);

  const { publisher } = data;

  if (!publisher) {
    return null;
  }

  const ActivityReport = () => (
    <CardSmall className="g-mb-4">
      <CardHeaderSmall className="">
        <CardTitleSmall className="g-flex g-text-sm">
          <div className="g-flex-none g-me-2">
            <div className="g-leading-6 g-bg-primary-500 g-text-white g-rounded-full g-w-6 g-h-6 g-flex g-justify-center g-items-center">
              <MdDownload />
            </div>
          </div>
          <div className="g-flex-auto">
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
      <CardSmall className="g-mb-4">
        <div className="g-p-2 md:g-p-4">
          <ClientSideOnly>
            <img
              className="g-m-auto g-max-w-100 g-max-h-48"
              src={publisher?.logoUrl}
              alt=""
              onError={(e) => {
                // show gray background if image fails to load
                e.target.style.background = '#eee';
                e.target.style.display = 'block';
                e.target.style.height = '100px';
              }}
            />
          </ClientSideOnly>
        </div>
      </CardSmall>
    );
  };

  const Map = () => {
    return (
      <CardSmall className="g-mb-4">
        {publisher?.longitude && publisher?.latitude && Math.abs(publisher.latitude) < 85 && (
          <a
            className="g-block"
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
        <CardContentSmall className="g-mt-4">
          <div className="g-flex">
            <div className="g-flex-none g-me-2">
              <div className="g-leading-6 g-bg-primary-500 g-text-white g-rounded-full g-w-6 g-h-6 g-flex g-justify-center g-items-center">
                <MdMap />
              </div>
            </div>
            <div className="g-flex-auto g-text-sm g-prose">
              <address style={{ fontStyle: 'normal' }}>
                <div>
                  {publisher.address && publisher.address.length > 0 ? (
                    <>
                      {publisher.address.map((x, i) => (
                        <div key={`${publisher.key}_${i}`}>{x}</div>
                      ))}
                    </>
                  ) : (
                    <span style={{ color: '#aaa' }}>
                      <FormattedMessage id="phrases.addressUnknown" />
                    </span>
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
                    <a href={`mailto:${publisher.email}`} style={{ wordBreak: 'break-all' }}>
                      {publisher.email}
                    </a>
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
      <CardSmall className="g-mb-4 g-prose">
        <CardContentSmall className="g-mt-4 g-text-sm">
          {publisher.endorsingNode && (
            <div style={{ marginBottom: 18 }}>
              <CardTitleSmall className="g-mb-2">
                <FormattedMessage id="publisher.endorsedBy" />:{' '}
                <a href={`https://www.gbif.org/node/${publisher.endorsingNodeKey}`}>
                  {publisher.endorsingNode.title}
                </a>
              </CardTitleSmall>
              <div className="g-text-sm g-text-slate-600">
                <HelpText identifier="what-is-publisher-endorsement" className="[&_p]:g-mt-0" />
              </div>
            </div>
          )}
          {publisher?.installation?.count === 1 && (
            <div style={{ marginBottom: 18 }}>
              <CardTitleSmall className="g-mb-2">
                <FormattedMessage id="publisher.installations" />:{' '}
                {publisher?.installation.results.map((x) => (
                  <DynamicLink
                    key={x.key}
                    to={`/installation/${x.key}`}
                    pageId="installationKey"
                    variables={{ key: x.key }}
                  >
                    {x.title}
                  </DynamicLink>
                ))}
              </CardTitleSmall>
              <div className="g-text-sm g-text-slate-600">
                <HelpText identifier="what-is-an-installation" className="[&_p]:g-mt-0" />
              </div>
            </div>
          )}
          {publisher?.installation?.count > 1 && (
            <div style={{ marginBottom: 18 }}>
              <CardTitleSmall className="g-mb-2">
                <FormattedMessage id="publisher.installations" />:{' '}
                <ul>
                  {publisher?.installation?.results.map((x) => (
                    <li key={x.key}>
                      <DynamicLink
                        to={`/installation/${x.key}`}
                        pageId="installationKey"
                        variables={{ key: x.key }}
                      >
                        {x.title}
                      </DynamicLink>
                    </li>
                  ))}
                </ul>
              </CardTitleSmall>
              <div className="g-text-sm g-text-slate-600">
                <HelpText identifier="what-is-an-installation" className="[&_p]:g-mt-0" />
              </div>
            </div>
          )}
          {publisher.country && (
            <div style={{ marginBottom: 18 }}>
              <CardTitleSmall className="g-mb-2">
                <FormattedMessage id="publisher.country" />:{' '}
                <FormattedMessage id={`enums.countryCode.${publisher.country}`} />
              </CardTitleSmall>
              <div className="g-text-sm g-text-slate-600">
                <HelpText identifier="about-publisher-country" className="[&_p]:g-mt-0" />
              </div>
            </div>
          )}
        </CardContentSmall>
      </CardSmall>
    );
  };

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <div className={`${removeSidebar ? '' : 'g-flex'}`}>
          <div className="g-flex-grow">
            <Card className="g-mb-4">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="phrases.headers.description" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {publisher?.description && (
                  <div
                    className="g-prose g-mb-6"
                    dangerouslySetInnerHTML={{ __html: publisher.description }}
                  ></div>
                )}
                {!publisher?.description && <EmptyValue />}
              </CardContent>
            </Card>

            {isNoneEmptyArray(publisher.contacts) && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="phrases.headers.contacts" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="g-flex g-flex-wrap -g-m-2">
                    {publisher?.contacts?.map((contact) => {
                      return (
                        <Card
                          key={contact.key}
                          className="g-px-6 g-py-4 g-flex-auto g-max-w-sm g-min-w-xs g-m-2 g-w-1/2"
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
                          <ContactContent className="g-mb-2"></ContactContent>
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
            <aside className="g-flex-none g-min-w-80 g-w-80 g-ml-4">
              <ActivityReport />
              <Logo />
              <Map />
              <Provenance />
              <GbifLinkCard path={`/publisher/${publisher.key}`} />
            </aside>
          )}
          {removeSidebar && (
            <div className="sm:g-flex g-flex-full">
              <div className="g-flex-[1_1_50%] g-me-2">
                <ActivityReport />
                <Map />
              </div>
              <div className="g-flex-[1_1_50%] g-ms-2">
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
