import { ClientSideOnly } from '@/components/clientSideOnly';
import { GbifLogoIcon } from '@/components/icons/icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useUser } from '@/contexts/UserContext';
import { HeaderQuery } from '@/gql/graphql';
import { DynamicLink, useI18n } from '@/reactRouterPlugins';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { memo, useState } from 'react';
import { MdLink, MdMenu } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';

function MobileMenu({ menu }: { menu: HeaderQuery }) {
  const { locale } = useI18n();
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn, isLoading } = useUser();

  const openMenuLabel = intl.formatMessage({
    id: 'header.openNavigationMenu',
    defaultMessage: 'Open navigation menu',
  });

  const children = menu?.gbifHome?.children;
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="g-text-2xl g-px-2 g-mx-0.5 g-min-h-11 g-min-w-11"
          aria-label={openMenuLabel}
        >
          <MdMenu className="g-opacity-80" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="g-overflow-y-scroll g-p-4"
        side={locale.textDirection === 'rtl' ? 'left' : 'right'}
        dir={locale.textDirection || 'ltr'}
      >
        <ClientSideOnly>
          <SheetHeader>
            <SheetTitle>
              <div className="g-flex g-py-2 g-items-center">
                <span dir="ltr">
                  <GbifLogoIcon style={{ fontSize: 25 }} className="g-me-2" /> GBIF
                </span>
              </div>
            </SheetTitle>
            <VisuallyHidden asChild>
              <SheetDescription>Site menu</SheetDescription>
            </VisuallyHidden>
          </SheetHeader>

          <nav
            className="g-text-base g-my-4"
            aria-label={intl.formatMessage({
              id: 'header.siteNavigation',
              defaultMessage: 'Site navigation',
            })}
          >
            <Accordion type="single" collapsible className="w-full">
              {children?.map((parent) => {
                if (!parent.children || parent.children.length === 0) {
                  return (
                    <DynamicLink
                      onClick={() => setOpen(false)}
                      key={parent.id}
                      to={parent.link}
                      className="g-border-b g-flex g-flex-1 g-items-center g-justify-between g-py-4 g-min-h-11 g-text-base g-transition-all hover:g-underline"
                    >
                      <div>
                        {parent.title} {parent.externalLink && <MdLink aria-hidden="true" />}
                      </div>
                    </DynamicLink>
                  );
                }
                return (
                  <AccordionItem value={parent.id} key={parent.id}>
                    <AccordionTrigger className="g-py-4 g-min-h-11 g-text-base">
                      {parent.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="g-bg-slate-200 g-rounded-lg g-px-3">
                        <Accordion type="multiple" className="w-full">
                          {parent.children.map((child) => {
                            if (child.children && child.children.length > 0) {
                              return (
                                <AccordionItem value={child.id} key={child.id}>
                                  <AccordionTrigger className="g-py-4 g-min-h-11 g-text-base">
                                    {child.title}
                                  </AccordionTrigger>
                                  <AccordionContent className="g-ms-0">
                                    {child.children.map((subChild) => (
                                      <DynamicLink
                                        onClick={() => setOpen(false)}
                                        key={subChild.id}
                                        to={subChild.link}
                                        className="g-text-muted-foreground g-border-b g-flex g-flex-1 g-items-center g-justify-between g-py-3 g-min-h-11 g-text-base g-transition-all hover:g-underline"
                                      >
                                        <div>
                                          {subChild.title}{' '}
                                          {subChild.externalLink && <MdLink aria-hidden="true" />}
                                        </div>
                                      </DynamicLink>
                                    ))}
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            }
                            return (
                              <DynamicLink
                                onClick={() => setOpen(false)}
                                key={child.id}
                                to={child.link}
                                className="g-border-b g-flex g-flex-1 g-items-center g-justify-between g-py-3 g-min-h-11 g-text-base g-transition-all hover:g-underline"
                              >
                                <div>
                                  {child.title}{' '}
                                  {child.externalLink && <MdLink aria-hidden="true" />}
                                </div>
                              </DynamicLink>
                            );
                          })}
                        </Accordion>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
            {!isLoading && (
              <>
                {isLoggedIn && user ? (
                  <DynamicLink
                    onClick={() => setOpen(false)}
                    to="/user/profile"
                    aria-label={intl.formatMessage(
                      {
                        id: 'header.profileLinkLabel',
                        defaultMessage: 'My profile: {userName}',
                      },
                      { userName: user.userName }
                    )}
                    className="g-block g-border-b g-font-medium *:g-flex g-flex-1 g-items-center g-justify-between g-py-4 g-min-h-11 g-text-base g-transition-all hover:g-underline"
                  >
                    <FormattedMessage
                      id="header.profile"
                      defaultMessage="Profile"
                      values={{ userName: user.userName }}
                    />
                  </DynamicLink>
                ) : (
                  <DynamicLink
                    onClick={() => setOpen(false)}
                    to="/user/login"
                    className="g-block g-border-b g-font-medium *:g-flex g-flex-1 g-items-center g-justify-between g-py-4 g-min-h-11 g-text-base g-transition-all hover:g-underline"
                  >
                    <FormattedMessage id="profile.loginText" defaultMessage="Login" />
                  </DynamicLink>
                )}
              </>
            )}
          </nav>
        </ClientSideOnly>
      </SheetContent>
    </Sheet>
  );
}

export default memo(MobileMenu);
