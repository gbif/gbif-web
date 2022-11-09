
import { jsx, css } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { Tabs, Eyebrow, ResourceLink, Button, Tooltip } from '../../components';
import OccurrenceSearch from '../../search/OccurrenceSearch/OccurrenceSearch';
import { Description as About } from './about/Description';
// import { People } from './people/People';
import { FormattedMessage } from 'react-intl';
import { join } from '../../utils/util';

// import * as styles from './styles';
import { MdLink, MdPeople, MdOutlineScreenSearchDesktop as CatalogIcon } from 'react-icons/md';

import { Switch, Route, useRouteMatch } from 'react-router-dom';



import { GrGithub as Github } from 'react-icons/gr';

import useBelow from '../../utils/useBelow';
import { OccurrenceCount, Homepage, FeatureList, Location, GenericFeature, GbifCount } from '../../components/IconFeatures/IconFeatures';
import { DataHeader, HeaderWrapper, ContentWrapper, Headline, DeletedMessage, ErrorMessage, HeaderInfoWrapper, HeaderInfoMain, HeaderInfoEdit } from '../shared/header';
import { PageError, Page404, PageLoader } from '../shared';

import env from '../../../.env.json';
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
    {/* <DataHeader searchType="specimenSearch" messageId="catalogues.specimens" /> */}

    <HeaderWrapper>
      <Eyebrow prefix="Specimen" />
      <Headline css={css`display: inline; margin-right: 12px;`}>{specimen.name}</Headline>
    </HeaderWrapper>

    <section>
      <h1>Hej</h1>
    </section>
  </>
};
