import { GbifLinkCard, TocLi as Li, Separator } from '@/components/TocHelp';
import { Card } from '@/components/ui/largeCard';
import { useConfig } from '@/config/config';
import { NotFoundError } from '@/errors';
import { Term } from '@/gql/graphql';
import useBelow from '@/hooks/useBelow';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useCallback, useContext, useReducer } from 'react';
import { FormattedMessage } from 'react-intl';
import { HashLink } from 'react-router-hash-link';
import { useOccurrenceKeyLoaderData } from '.';
import { Groups } from './About/groups';
import { OccurrenceKeyContext } from './occurrenceKey';
import { Aside, AsideSticky, SidebarLayout } from './pagelayouts';

const extensions = [
  'multimedia',
  'preparation',
  'preservation',
  'resourceRelationship',
  'amplification',
  'permit',
  'loan',
  'materialSampleExt',
  'dnaDerivedData',
  'cloning',
  'gelImage',
  'reference',
  'eolReference',
  'germplasmAccession',
  'germplasmMeasurementScore',
  'germplasmMeasurementTrait',
  'germplasmMeasurementTrial',
  'identificationHistory',
  'identifier',
  'measurementOrFact',
  'extendedMeasurementOrFact',
  'chronometricAge',
];

const tocReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_SECTION':
      return { ...state, [action.id]: action.visible };
    case 'REMOVE_SECTION': {
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    }
    default:
      return state;
  }
};

export function OccurrenceKeyAbout() {
  const { slowOccurrence } = useContext(OccurrenceKeyContext);
  const config = useConfig();
  const { data } = useOccurrenceKeyLoaderData();
  const hideSidebar = useBelow(1000);
  const [toc, dispatch] = useReducer(
    tocReducer,
    extensions.reduce((acc, section) => ({ ...acc, [section]: false }), {})
  );

  const updateToc = useCallback((id: string, visible: boolean) => {
    dispatch({ type: 'ADD_SECTION', id, visible });
  }, []);

  if (data.occurrence == null) throw new NotFoundError();
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
              slowOccurrence={slowOccurrence}
              showAll={showAll}
              termMap={termMap}
              updateToc={updateToc}
            />
          </div>
          {!hideSidebar && (
            <Aside className="">
              {occurrence.coordinates?.lon && (
                <Card className="g-mb-4">
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
                      <Li to="#record">
                        <FormattedMessage id="occurrenceDetails.groups.record" />
                      </Li>
                      <Li to="#taxon">
                        <FormattedMessage id="occurrenceDetails.groups.taxon" />
                      </Li>
                      <Li to="#location">
                        <FormattedMessage id="occurrenceDetails.groups.location" />
                      </Li>
                      {toc['event'] && (
                        <Li to="#event">
                          <FormattedMessage id="occurrenceDetails.groups.event" />
                        </Li>
                      )}
                      <Li to="#occurrence">
                        <FormattedMessage id="occurrenceDetails.groups.occurrence" />
                      </Li>
                      {toc['organism'] && (
                        <Li to="#organism">
                          <FormattedMessage id="occurrenceDetails.groups.organism" />
                        </Li>
                      )}
                      {toc['material-sample'] && (
                        <Li to="#material-sample">
                          <FormattedMessage id="occurrenceDetails.groups.materialSample" />
                        </Li>
                      )}
                      {toc['identification'] && (
                        <Li to="#identification">
                          <FormattedMessage id="occurrenceDetails.groups.identification" />
                        </Li>
                      )}
                      <Li to="#other">
                        <FormattedMessage id="occurrenceDetails.groups.other" />
                      </Li>
                      <Separator />
                      {showExtensions && (
                        <>
                          <Li style={{ color: '#888', fontSize: '85%' }}>
                            <FormattedMessage id="occurrenceDetails.groups.extensions" />
                          </Li>
                          {extensions.map((section) => {
                            if (!toc[section]) return null;
                            let sectionLabel = `occurrenceDetails.extensions.${section}.name`;
                            if (section === 'identificationHistory') {
                              sectionLabel = 'occurrenceDetails.extensions.identification.name';
                            }
                            return (
                              <Li key={section} toc={toc} to={`#${section}`}>
                                <FormattedMessage
                                  id={sectionLabel}
                                  defaultMessage={section.replace(/-/g, ' ')}
                                />
                              </Li>
                            );
                          })}
                          <Separator />
                        </>
                      )}
                      <Li to="#citation">
                        <FormattedMessage id="phrases.citation" />
                      </Li>
                    </ul>
                    {/* <div onClick={() => setShowAll(!showAll)}>Toggle debug view</div> */}
                  </nav>
                </Card>

                {config.linkToGbifOrg && (
                  <GbifLinkCard className="g-mt-4" path={`/occurrence/${occurrence.key}`} />
                )}
              </AsideSticky>
            </Aside>
          )}
        </SidebarLayout>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
