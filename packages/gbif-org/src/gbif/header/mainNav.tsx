import * as React from 'react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { HeaderQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import { memo } from 'react';
import { MdLink } from 'react-icons/md';

export default memo(MainNavigation) as typeof MainNavigation;
function MainNavigation({ menu }: { menu: HeaderQuery }) {
  const [value, setValue] = React.useState('');
  const children = menu.gbifHome?.children;
  return (
    <>
      <div className="g-hidden lg:g-block">
        <NavigationMenu value={value} onValueChange={setValue} className="g-z-30">
          <NavigationMenuList>
            {children?.map((parent) => {
              const groups = parent?.children?.[0].children ? parent?.children?.length : 1;
              const widthLookup: { [key: number]: string } = {
                1: 'lg:g-w-[300px] lg:g-grid-cols-[1fr]',
                2: 'lg:g-w-[540px] lg:g-grid-cols-[270px_1fr]',
                3: 'lg:g-w-[810px] lg:g-grid-cols-[270px_1fr_1fr]',
                4: 'lg:g-w-[1080px] lg:g-grid-cols-[270px_1fr_1fr_1fr]',
              };

              return (
                <NavigationMenuItem key={parent.id}>
                  <NavigationMenuTrigger>{parent.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className={`g-grid g-gap-1 g-p-4 md:g-w-[270px] ${widthLookup[groups]}`}>
                      {parent.children?.map((child) => {
                        if (child?.children && child?.children?.length > 0) {
                          return (
                            <li key={child.id}>
                              <h4 className="g-mt-2 g-ps-2 g-text-slate-500">{child.title}</h4>
                              <ul className="g-py-4">
                                {child.children
                                  .filter((x) => x.link)
                                  .map((subChild) => (
                                    <ListItem
                                      key={subChild.id}
                                      href={subChild.link}
                                      title={subChild.title}
                                      externalLink={!!subChild.externalLink}
                                      onClick={() => setValue('')}
                                    >
                                      {/* {subChild?.description ?? 'Description could go here'} */}
                                    </ListItem>
                                  ))}
                              </ul>
                            </li>
                          );
                        }
                        return (
                          <ListItem
                            onClick={() => setValue('')}
                            key={child.id}
                            href={child.link}
                            title={child.title}
                            externalLink={!!child.externalLink}
                          >
                            {/* {child?.description ?? 'Observations, specimens, samples, and other evidence of species occurrences.'} */}
                          </ListItem>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            })}
            {/* Example of custom menu item to discuss with comms */}
            {/* <NavigationMenuItem>
                <NavigationMenuTrigger>Explore data</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="g-grid g-gap-1 g-p-4 md:g-w-[400px] lg:g-w-[800px] lg:g-grid-cols-[270px_1fr]">
                    <li className="g-row-span-6">
                      <NavigationMenuLink asChild>
                        <Link
                          className="g-h-full g-justify-start g-block g-select-none g-space-y-1 g-leading-none g-no-underline g-outline-none"
                          to="/occurrence/search"
                        >
                          <div className="g-rounded-md g-p-3  g-transition-colors hover:g-bg-accent hover:g-text-accent-foreground focus:g-bg-accent focus:g-text-accent-foreground">
                            <div className="g-mt-0 g-pt-0 g-mb-2 g-font-medium g-leading-none">
                              Occurrences
                            </div>
                            <p className="g-text-sm g-leading-tight g-text-muted-foreground">
                              Observations, specimens, samples, and other evidence of species occurrences.
                            </p>
                            <div className="g-relative g-rounded-lg g-mt-4 g-overflow-hidden">
                              <img
                                className="g-absolute g-top-0 g-left-0 g-bottom-0 g-right-0 g-w-full g-h-full"
                                src={`http://api.gbif.org/v2/map/occurrence/density/0/0/0@2x.png?srs=EPSG%3A3857&style=purpleYellow.point`}
                              />
                              <img
                                className="g-w-full"
                                src="https://tile.gbif.org/3857/omt/0/0/0@2x.png?style=gbif-tuatara&srs=EPSG%3A3857"
                              />
                            </div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/docs" title="Taxonomy">
                      Explore classification of life on Earth.
                    </ListItem>
                    <ListItem href="/docs/installation" title="Datasets">
                      Explore the individual datasets published by the GBIF network
                    </ListItem>
                    <ListItem href="/docs/primitives/typography" title="Occurrence snapshots">
                      Download all occurrence data for offline filtering. Including historic versions.
                    </ListItem>
                    <ListItem href="/docs" title="GBIF API">
                      Explore classification of life on Earth.
                    </ListItem>
                    <ListItem href="/docs/installation" title="Hosted portals">
                      Explore the individual datasets published by the GBIF network
                    </ListItem>
                    <ListItem href="/docs/primitives/typography" title="Trends">
                      Download all occurrence data for offline filtering. Including historic versions.
                    </ListItem>
                  </ul>
              </NavigationMenuContent>
            </NavigationMenuItem> */}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
}

// Define a custom interface for your props
interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  className?: string;
  title?: string;
  externalLink?: boolean;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, title, children, externalLink, ...props }, ref) => {
    return (
      <li>
        <DynamicLink to={props.href}>
          <div
            ref={ref}
            className={cn(
              'g-hyphens-auto g-block g-select-none g-space-y-1 g-rounded-md g-p-2 g-leading-none g-no-underline g-outline-none g-transition-colors hover:g-bg-accent hover:g-text-accent-foreground focus:g-bg-accent focus:g-text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className="g-text-sm g-font-medium g-leading-none g-w-full">
              {title}
              {externalLink && <MdLink className="g-ms-1" />}
            </div>
            {children && (
              <p className="g-line-clamp-2 g-text-sm g-leading-snug g-text-muted-foreground">
                {children}
              </p>
            )}
          </div>
        </DynamicLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
