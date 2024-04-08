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
import { PublisherQuery } from '@/gql/graphql';
import { RouteId, useParentRouteLoaderData } from '@/hooks/useParentRouteLoaderData';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { FormattedMessage } from 'react-intl';

export function PublisherKeyAbout() {
  const { data } = useParentRouteLoaderData(RouteId.Publisher) as { data: PublisherQuery };

  const { publisher } = data;

  return (
    <ArticleContainer className="bg-slate-100 pt-0">
      <ArticleTextContainer className="max-w-screen-xl">
        <div className="flex">
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
                        <Card key={contact.key} className="px-6 py-4 flex-auto max-w-sm min-w-xs m-2">
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
                              contact.email.map((email) => <ContactEmail key={email} email={email} />)}
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
          <aside className="flex-auto">Sidebar content</aside>
        </div>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
