import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MdLink, MdMenu } from 'react-icons/md';
import { ClientSideOnly } from '@/components/clientSideOnly';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { GbifLogoIcon } from '@/components/icons/icons';
import { HeaderQuery } from '@/gql/graphql';
import { DynamicLink } from '@/components/dynamicLink';
import { useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export function MobileMenu({ menu }: { menu: HeaderQuery }) {
  const [open, setOpen] = useState(false);

  const children = menu?.gbifHome?.children;
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button variant="ghost" asChild className="g-text-xl g-px-2 g-mx-0.5">
          <span>
            <MdMenu className="g-opacity-80" />
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <div className="g-flex g-py-2 g-items-center">
              <GbifLogoIcon style={{ fontSize: 25 }} className="g-me-2" /> GBIF
            </div>
          </SheetTitle>
          <VisuallyHidden asChild>
            <SheetDescription>Site menu</SheetDescription>
          </VisuallyHidden>
          
          <div className="g-text-sm">
            <Accordion type="single" collapsible className="w-full">
              {children?.map((parent) => {
                if (!parent.children || parent.children.length === 0) {
                  return (
                    <DynamicLink
                      onClick={() => setOpen(false)}
                      key={parent.id}
                      to={parent.link}
                      className="g-border-b g-flex g-flex-1 g-items-center g-justify-between g-py-2 g-text-sm g-transition-all hover:g-underline"
                    >
                      <div>{parent.title} {parent.externalLink && <MdLink />}</div>
                    </DynamicLink>
                  );
                }
                return (
                  <AccordionItem value={parent.id} key={parent.id}>
                    <AccordionTrigger>{parent.title}</AccordionTrigger>
                    <AccordionContent>
                      <div className="g-bg-slate-200 g-rounded-lg g-px-2 g-text-muted-foreground">
                        <Accordion type="multiple" className="w-full">
                          {parent.children.map((child) => {
                            if (child.children && child.children.length > 0) {
                              return (
                                <AccordionItem value={child.id} key={child.id}>
                                  <AccordionTrigger>{child.title}</AccordionTrigger>
                                  <AccordionContent className="g-ms-4">
                                    {child.children.map((subChild) => (
                                      <DynamicLink
                                        onClick={() => setOpen(false)}
                                        key={subChild.id}
                                        to={subChild.link}
                                        className="g-border-b g-flex g-flex-1 g-items-center g-justify-between g-py-2 g-text-sm g-transition-all hover:g-underline"
                                      >
                                        <div>
                                          {subChild.title} {subChild.externalLink && <MdLink />}
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
                                className="g-border-b g-flex g-flex-1 g-items-center g-justify-between g-py-2 g-text-sm g-transition-all hover:g-underline"
                              >
                                <div>
                                  {child.title} {child.externalLink && <MdLink />}
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
            <DynamicLink
              onClick={() => setOpen(false)}
              to="/login"
              className="g-block g-border-b g-font-medium *:g-flex g-flex-1 g-items-center g-justify-between g-py-4 g-text-sm g-transition-all hover:g-underline"
            >
              Login
            </DynamicLink>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
