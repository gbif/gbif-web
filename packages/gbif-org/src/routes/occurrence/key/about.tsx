import { Card } from '@/components/ui/largeCard';
import { OccurrenceQuery, Term } from '@/gql/graphql';
import { RouteId, useParentRouteLoaderData } from '@/hooks/useParentRouteLoaderData';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import React, { useCallback } from 'react';
import { Groups } from './About/groups';
import { HashLink } from 'react-router-hash-link';
import { Aside, AsideSticky, SidebarLayout } from './pagelayouts';
import useBelow from '@/hooks/useBelow';

const extensions = [
  'preparation',
  'resource-relationship',
  'amplification',
  'permit',
  'loan',
  'preservation',
  'material-sample-ext',
  'dna-derived-data',
  'cloning',
  'gel-image',
  'reference',
  'eol-reference',
  'germplasm-accession',
  'germplasm-measurement-score',
  'germplasm-measurement-trait',
  'germplasm-measurement-trial',
  'identification-history',
  'identifier',
  'measurement-or-fact',
  'extended-measurement-or-fact',
  'chronometric-age',
];

export function OccurrenceKeyAbout() {
  const { data } = useParentRouteLoaderData(RouteId.Occurrence) as { data: OccurrenceQuery };
  const hideSidebar = useBelow(1000);
  const [toc, setToc] = React.useState(
    extensions.reduce((acc, section) => ({ ...acc, [section]: false }), {})
  );

  const updateToc = useCallback(
    (id: string, visible: boolean) => {
      if (typeof id === 'string' && toc[id] !== visible) {
        setToc({ ...toc, [id]: visible });
      }
    },
    [toc]
  );

  if (data.occurrence == null) throw new Error('404');
  const { occurrence } = data;
  const { terms } = occurrence;
  const termMap: { [key: string]: Term } =
    terms?.reduce((map: { [key: string]: Term }, term) => {
      if (term?.simpleName) map[term.simpleName] = term;
      return map;
    }, {}) ?? {};

  const showAll = false;
  const overviewZoom = 5;
  const sateliteZoom = occurrence.gadm?.level0 ? 14 : 5;
  
  const showExtensions = !!extensions.find((section) => toc[section]);

  return (
    <ArticleContainer className="bg-slate-100 pt-4">
      <ArticleTextContainer className="max-w-screen-xl">
        <SidebarLayout
          reverse
          className="grid-cols-[250px_1fr] xl:grid-cols-[300px_1fr]"
          stack={hideSidebar}
        >
          <div className="order-last">
            <Groups
              occurrence={occurrence}
              showAll={showAll}
              termMap={termMap}
              updateToc={updateToc}
            />
          </div>
          {!hideSidebar && (
            <Aside className="">
              {occurrence.coordinates?.lon && (
                <Card className="mb-4">
                  <HashLink to="#location" replace className="block relative group">
                    <img
                      src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${occurrence.coordinates.lon},${occurrence.coordinates.lat})/${occurrence.coordinates.lon},${occurrence.coordinates.lat},${overviewZoom},0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
                    />
                    <img
                      className="absolute opacity-0 top-0 group-hover:opacity-100 transition-opacity gb-on-hover"
                      src={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/pin-s-circle+285A98(${occurrence.coordinates.lon},${occurrence.coordinates.lat})/${occurrence.coordinates.lon},${occurrence.coordinates.lat},${sateliteZoom},0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
                    />
                  </HashLink>
                </Card>
              )}
              <AsideSticky>
                <Card>
                  <nav>
                    <ul className="list-none m-0 p-0 my-2">
                      {/* <Li to="#summary">Summary</Li>
                      <Separator /> */}
                      {toc['geological-context'] && (
                        <Li to="#geological-context">Geological Context</Li>
                      )}
                      <Li to="#record">Record</Li>
                      <Li to="#taxon">Taxon</Li>
                      <Li to="#location">Location</Li>
                      <Li to="#event">Event</Li>
                      <Li to="#occurrence">Occurrence</Li>
                      {toc['organism'] && <Li to="#organism">Organism</Li>}
                      {toc['material-sample'] && <Li to="#material-sample">Material Sample</Li>}
                      {toc['identification'] && <Li to="#identification">Identification</Li>}
                      <Li to="#other">Other</Li>
                      <Separator />
                      {showExtensions && (
                        <>
                          <Li style={{ color: '#888', fontSize: '85%' }}>Extensions</Li>
                          {extensions.map((section) => {
                            if (!toc[section]) return null;
                            return (
                              <Li key={section} toc={toc} to={`#${section}`}>
                                {section}
                              </Li>
                            );
                          })}
                          <Separator />
                        </>
                      )}
                      <Li to="#citation">Citation</Li>
                    </ul>
                    {/* <div onClick={() => setShowAll(!showAll)}>Toggle debug view</div> */}
                  </nav>
                </Card>

                <Card className="mt-4">
                  <nav>
                    <ul className="list-none m-0 p-0 my-2">
                      <Li>
                        <a href={`https://www.gbif.org/occurrence/${occurrence.key}`}>
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
