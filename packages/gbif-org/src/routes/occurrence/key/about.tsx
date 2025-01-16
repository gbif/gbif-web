import { TocLi as Li, Separator } from '@/components/TocHelp';
import { Card } from '@/components/ui/largeCard';
import { useConfig } from '@/config/config';
import { Term } from '@/gql/graphql';
import useBelow from '@/hooks/useBelow';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useCallback, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { useOccurrenceKeyLoaderData } from '.';
import { Groups } from './About/groups';
import { Aside, AsideSticky, SidebarLayout } from './pagelayouts';

const extensions = [
  'media',
  'preparation',
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
  const config = useConfig();
  const { data } = useOccurrenceKeyLoaderData();
  const hideSidebar = useBelow(1000);
  const [toc, setToc] = useState(
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
  const isProbablyNotInOcean = occurrence.countryCode;
  const overviewZoom = isProbablyNotInOcean ? 5 : 1;
  const sateliteZoom = isProbablyNotInOcean ? 14 : 1;

  const showExtensions = !!extensions.find((section) => toc[section]);

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <SidebarLayout
          reverse
          className="g-grid-cols-[250px_1fr] xl:g-grid-cols-[300px_1fr]"
          stack={hideSidebar}
        >
          <div className="g-order-last">
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
                <Card className="">
                  <HashLink to="#location" replace className="g-block g-relative g-group">
                    <img
                      src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${occurrence.coordinates.lon},${occurrence.coordinates.lat})/${occurrence.coordinates.lon},${occurrence.coordinates.lat},${overviewZoom},0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
                    />
                    <img
                      className="g-absolute g-opacity-0 g-top-0 group-hover:g-opacity-100 g-transition-opacity gb-on-hover"
                      src={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/pin-s-circle+285A98(${occurrence.coordinates.lon},${occurrence.coordinates.lat})/${occurrence.coordinates.lon},${occurrence.coordinates.lat},${sateliteZoom},0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
                    />
                  </HashLink>
                </Card>
              )}
              <AsideSticky>
                <Card>
                  <nav>
                    <ul className="g-list-none g-m-0 g-p-0 g-my-2">
                      {/* <Li to="#summary">Summary</Li>
                      <Separator /> */}
                      {toc['geological-context'] && (
                        <Li to="#geological-context">Geological Context</Li>
                      )}
                      <Li to="#record">Record</Li>
                      <Li to="#taxon">Taxon</Li>
                      <Li to="#location">Location</Li>
                      {toc['event'] && <Li to="#event">Event</Li>}
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

                {config.linkToGbifOrg && (
                  <Card className="g-mt-4">
                    <nav>
                      <ul className="g-list-none g-m-0 g-p-0 g-my-2">
                        <Li>
                          <a
                            className="g-text-inherit"
                            href={`${import.meta.env.PUBLIC_GBIF_ORG}/occurrence/${occurrence.key}`}
                          >
                            View on GBIF.org
                          </a>
                        </Li>
                      </ul>
                    </nav>
                  </Card>
                )}
              </AsideSticky>
            </Aside>
          )}
        </SidebarLayout>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
