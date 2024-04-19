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
import { DynamicLink } from '@/components/dynamicLink';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { OccurrenceQuery, PublisherQuery, Term } from '@/gql/graphql';
import { RouteId, useParentRouteLoaderData } from '@/hooks/useParentRouteLoaderData';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { PlainTextField, HtmlField, EnumField } from './properties';
import Properties from '@/components/Properties';
import { Groups } from './About/groups';
import { HashLink } from 'react-router-hash-link';
import { Aside, AsideSticky, Nav, SidebarLayout } from './pagelayouts';
import useBelow from '@/hooks/useBelow';
import { MdLink } from 'react-icons/md';

export function OccurrenceKeyAbout() {
  const { data } = useParentRouteLoaderData(RouteId.Occurrence) as { data: OccurrenceQuery };
  const hideSidebar = useBelow(1000);
  const toc = {};
  // const [toc, setToc] = React.useState<string[]>([]);
  // const updateToc = (id: string) => {
  //   if (!toc.includes(id)) {
  //     // setToc([...toc, id]);
  //   }
  // };
  if (data.occurrence == null) throw new Error('404');
  const { occurrence } = data;
  const { terms } = occurrence;
  const termMap: { [key: string]: Term } =
    terms?.reduce((map: { [key: string]: Term }, term) => {
      if (term?.simpleName) map[term.simpleName] = term;
      return map;
    }, {}) ?? {};

  const showAll = false;
  return (
    <ArticleContainer className="bg-slate-100 pt-4">
      <ArticleTextContainer className="max-w-screen-xl">
        <SidebarLayout
          reverse
          className="grid-cols-[250px_1fr] xl:grid-cols-[300px_1fr]"
          stack={hideSidebar}
        >
          <div className="order-last">
            <Groups occurrence={occurrence} showAll={showAll} termMap={termMap} />
          </div>
          {!hideSidebar && (
            <Aside className="">
              {occurrence.coordinates?.lon && (
                <Card className="mb-4">
                  <HashLink to="#location" replace className="block relative group">
                    <img
                      src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${occurrence.coordinates.lon},${occurrence.coordinates.lat})/${occurrence.coordinates.lon},${occurrence.coordinates.lat},5,0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
                    />
                    {/* <img
          style={{ display: "block", maxWidth: "100%", marginBottom: 12, position: 'absolute', top: 0 }}
          src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${occurrence.coordinates.lon},${occurrence.coordinates.lat})/${occurrence.coordinates.lon},${occurrence.coordinates.lat},9,0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
        /> */}
                    <img
                      className="absolute opacity-0 top-0 group-hover:opacity-100 transition-opacity gb-on-hover"
                      src={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/pin-s-circle+285A98(${occurrence.coordinates.lon},${occurrence.coordinates.lat})/${occurrence.coordinates.lon},${occurrence.coordinates.lat},11,0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
                    />
                    {/* <HashLink to="#location" replace></HashLink> */}
                  </HashLink>
                </Card>
              )}
              <AsideSticky className="" style={{ offsetAnchor: '10ch 8em' }}>
                <Card>
                  <nav>
                    <ul className="list-none m-0 p-0 my-2">
                      <Li to="#summary">Summary</Li>
                      <Separator />
                      <Li toc={toc} to="#record">
                        Record
                      </Li>
                      <Li toc={toc} to="#taxon">
                        Taxon
                      </Li>
                      <Li toc={toc} to="#location">
                        Location
                      </Li>
                      <Li toc={toc} to="#occurrence">
                        Occurrence
                      </Li>
                      <Li toc={toc} to="#event">
                        Event
                      </Li>
                      <Li toc={toc} to="#identification">
                        Identification
                      </Li>
                      <Li toc={toc} to="#other">
                        Other
                      </Li>
                      <Separator />
                      <Li style={{ color: '#888', fontSize: '85%' }}>Extensions</Li>
                      <Li toc={toc} to="#media">
                        Media
                      </Li>
                      <Li toc={toc} to="#identification">
                        Identification
                      </Li>
                      <Li toc={toc} to="#gel-image">
                        Gel Image
                      </Li>
                      {/* <Li toc={toc} to="#loan">
                        Loan <Tag type="light">3</Tag>
                      </Li> */}
                      <Separator />
                      <Li to="#citation">Citation</Li>
                    </ul>
                    {/* <div onClick={() => setShowAll(!showAll)}>Toggle debug view</div> */}
                  </nav>
                </Card>

                <Card className="mt-4">
                  <nav>
                    <ul className="list-none m-0 p-0 my-2">
                      <Li>
                        <a href={`https://www.gbif.org/occurrence/${occurrence.key}`} >
                          View on GBIF.org
                        </a>
                      </Li>
                    </ul>
                  </nav>
                </Card>
              </AsideSticky>
            </Aside>
          )}
        </SidebarLayout>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

function Li({
  to,
  toc,
  children,
  ...props
}: {
  to?: string;
  toc?: { [key: string]: boolean };
  children: React.ReactNode;
} & React.ComponentProps<'li'>) {
  const className =
    'block border-l [&_a]:block text-sm px-4 py-1 border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300';
  if (to) {
    // if (toc && !toc[to.substr(1)]) {
    //   return null;
    // }
    return (
      <li className={className} {...props}>
        <HashLink to={to} replace>
          {children}
        </HashLink>
      </li>
    );
  }
  return <li className={className} {...props} children={children} />;
}

function Separator(props) {
  return <li className="my-1 border-t border-slate-100"></li>;
}
