
import { jsx, css } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { Tabs, Switch as Toggle, Eyebrow, ResourceLink, Button, Tooltip, Classification, Doi, Properties } from '../../components';
import OccurrenceSearch from '../../search/OccurrenceSearch/OccurrenceSearch';
import { Description as About } from './about/Description';
// import { People } from './people/People';
import { FormattedMessage } from 'react-intl';
import { join } from '../../utils/util';
import { Core } from './core/Core';

// import * as styles from './styles';
import { MdHelp } from 'react-icons/md';
// import { TbCircleDot } from 'react-icons/tb';

import { Switch, Route, useRouteMatch } from 'react-router-dom';



import { GrGithub as Github } from 'react-icons/gr';

import useBelow from '../../utils/useBelow';
import { OccurrenceCount, Homepage, FeatureList, Location, GenericFeature, GbifCount } from '../../components/IconFeatures/IconFeatures';
import { DataHeader, HeaderWrapper, ContentWrapper, Headline, DeletedMessage, ErrorMessage, HeaderInfoWrapper, HeaderInfoMain, HeaderInfoEdit, FormattedDate } from '../shared/header';
import { PageError, Page404, PageLoader, Card, CardHeader2 } from '../shared';

import env from '../../../.env.json';
import { Separator } from '../../components/DataHeader/DataHeader';
import { Term, Value } from '../../components/Properties/Properties';
import { DataTable } from './DataTable';
import { Identifications } from './Identifications';
import { Media } from './Media';
import { Material } from './Material';
import { Assertions } from './Assertions';
import { Header } from './Header';
import { GiWhiteBook } from 'react-icons/gi';
const { TabList, RouterTab, Tab } = Tabs;

export function SpecimenPresentation({
  id,
  data,
  error,
  loading,
  ...props
}) {
  const hideSideBar = useBelow(1100);
  let { url, path } = useRouteMatch();

  if (loading || !data) return <PageLoader />

  const specimen = {
    name: 'Stub'
  };
  return <>
    {/* <DataHeader
      searchType="occurrenceSearch"
      messageId="catalogues.occurrences"
      // right={<>
      //   <Doi id="https://doi.org/10.15468/5nilie" />
      //   <Separator />
      //   <Button look="text">&lt;/ &gt;</Button>
      //   <Button look="text"><MdHelp /></Button>
      // </>}
      >
      {data?.specimen?.catalogItem && <div style={{ padding: '10px' }}>
        <Classification>
          <span>{data.specimen.catalogItem.institutionCode}</span>
          <span>{data.specimen.catalogItem.collectionCode}</span>
        </Classification>
      </div>}
    </DataHeader> */}
    <Header specimen={data.specimen}>
      <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
        <RouterTab to={url} exact label="Specimen" />
        <RouterTab to={join(url, 'timeline')} label="Timeline" />
        <RouterTab to={join(url, 'agents')} label="Agents" />
      </TabList>
    </Header>

    <section>
      <Switch>
        <Route path={join(path, 'timeline')}>
          <ContentWrapper>
            <h1>Timeline</h1>
          </ContentWrapper>
        </Route>
        <Route path={path}>
          <ContentWrapper>
            <Core specimen={data.specimen} />
            {/* <pre>
              {JSON.stringify(data, null, 2)}
            </pre> */}
          </ContentWrapper>
        </Route>
      </Switch>
    </section>
  </>
};
