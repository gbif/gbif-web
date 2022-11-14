
import { jsx, css } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { Tabs, Eyebrow, ResourceLink, Button, Tooltip, Classification, Doi, Properties } from '../../components';
import OccurrenceSearch from '../../search/OccurrenceSearch/OccurrenceSearch';
import { Description as About } from './about/Description';
// import { People } from './people/People';
import { FormattedMessage } from 'react-intl';
import { join } from '../../utils/util';

// import * as styles from './styles';
import { MdHelp } from 'react-icons/md';

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
const { TabList, RouterTab, Tab } = Tabs;

export function SpecimenPresentation({
  id,
  data,
  error,
  loading,
  ...props
}) {
  const hideSideBar = useBelow(1100);
  // let { url, path } = useRouteMatch();

  if (loading || !data) return <PageLoader />

  const specimen = {
    name: 'Stub'
  };
  return <>
    <DataHeader
      searchType="occurrenceSearch"
      messageId="catalogues.occurrences"
      right={<>
        <Doi id="https://doi.org/10.15468/5nilie" />
        <Separator />
        <Button look="text">&lt;/ &gt;</Button>
        <Button look="text"><MdHelp /></Button>
      </>}>
      <div style={{ padding: '10px' }}>
        <Classification>
          <span>Denver Museum of Natural & Science</span>
          <span>11098</span>
        </Classification>
      </div>
    </DataHeader>

    {/* <HeaderWrapper>
      <Eyebrow prefix="Specimen" />
      <Headline css={css`display: inline; margin-right: 12px;`}>{specimen.name}</Headline>
    </HeaderWrapper> */}


    <div css={css`padding: 12px; width: 1200px; max-width: 100%; margin: auto;`}>
      <Card padded={false} css={css`
      display: flex;
    `}>
        <div css={css`
        flex: 1 1 auto;
      `}>
          <div css={css`
          border-bottom: 1px solid #ddd;
          padding: 12px 24px;
        `}>
            DMNS:Mamm:101198
          </div>
          <div css={css`
            padding: 12px 24px;
          `}>
            <CardHeader2>Tamias quadrivittatus</CardHeader2>
            <Properties>
              <Term>Institution</Term>
              <Value>Denver Museum of Nature & Science</Value>

              <Term>Collection</Term>
              <Value>Mammals</Value>

              <Term>GADM location</Term>
              <Value>
                <Classification>
                  <span>United States</span>
                  <span>Colorado</span>
                  <span>Saguache</span>
                </Classification>
              </Value>

              <Term>Collection date</Term>
              <Value>
                <FormattedDate value={"2007-07-13"}
                  year="numeric"
                  month="long"
                  day="2-digit" />
              </Value>

              <Term>Agents</Term>
              <Value>{['John R. Demboski', 'Roberta Timons'].join(' ● ')} + 5 others</Value>

              <Term>Preparations</Term>
              <Value>{['liver', 'skin', 'study', 'skeleton', 'heart', 'kidney', 'ectoparasite'].join(' ● ')}</Value>

              <Term>Relations</Term>
              <Value>
                <a href="#relations">3 parasites</a> ● <a href="#relations">1 DNA sequenced record</a>
              </Value>
            </Properties>
          </div>
        </div>
        <div css={css`
        flex: 0 0 auto;
        width: 300px;
        background: seagreen;
        color: white;
        min-height: 200px;
      `}>
          Map goes here
        </div>
      </Card>

      <Card padding={false} css={css`margin: 12px 0;`}>
        <CardHeader2>Agents</CardHeader2>
        <DataTable></DataTable>
      </Card>
    </div>

    
  </>
};
