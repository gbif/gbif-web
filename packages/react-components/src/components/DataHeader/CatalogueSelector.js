import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import RouteContext from '../../dataManagement/RouteContext';
import React, { useContext } from 'react';
import { getClasses } from '../../utils/util';
import { MdApps, MdFileDownload, MdInfo, MdCode } from 'react-icons/md';
import { Menu, MenuAction, menuOption } from '../Menu';
import { Button } from '../Button';
import { ResourceSearchLink } from '../resourceLinks/resourceLinks';
import { FormattedMessage } from 'react-intl';
import { useRouteMatch, useLocation } from "react-router-dom";
// import { MdFileDownload, MdInfo, MdCode } from 'react-icons/md';

export default function CatalogueSelector({
  as: Div = 'div',
  className,
  availableCatalogues = ['OCCURRENCE', 'DATASET', 'PUBLISHER', 'LITERATURE', 'COLLECTION', 'INSTITUTION'],
  label,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const routeContext = useContext(RouteContext);
  const location = useLocation();
  const { classNames } = getClasses(theme.prefix, 'catalogueSelector', {/*modifiers goes here*/ }, className);

  const options = {
    OCCURRENCE: {
      link: <ResourceSearchLink type="occurrenceSearch" discreet>
        <FormattedMessage id='catalogues.occurrences' />
      </ResourceSearchLink>,
      route: routeContext.occurrenceSearch.route || '/occurrence/search',
      translationId: 'catalogues.occurrences'
    },
    PUBLISHER: {
      link: <ResourceSearchLink type="publisherSearch" discreet>
        <FormattedMessage id='catalogues.publishers' />
      </ResourceSearchLink>,
      route: routeContext.publisherSearch.route || '/publisher/search',
      translationId: 'catalogues.publishers'
    },
    DATASET: {
      link: <ResourceSearchLink type="datasetSearch" discreet>
        <FormattedMessage id='catalogues.datasets' />
      </ResourceSearchLink>,
      route: routeContext.datasetSearch.route || '/dataset/search',
      translationId: 'catalogues.datasets'
    },
    LITERATURE: {
      link: <ResourceSearchLink type="literatureSearch" discreet>
        <FormattedMessage id='catalogues.literature' />
      </ResourceSearchLink>,
      route: routeContext.literatureSearch.route || '/literature/search',
      translationId: 'catalogues.literature'
    },
    COLLECTION: {
      link: <ResourceSearchLink type="collectionSearch" discreet>
        <FormattedMessage id='catalogues.collections' />
      </ResourceSearchLink>,
      route: routeContext.collectionSearch.route || '/collection/search',
      translationId: 'catalogues.collections'
    },
    INSTITUTION: {
      link: <ResourceSearchLink type="institutionSearch" discreet>
        <FormattedMessage id='catalogues.institutions' />
      </ResourceSearchLink>,
      route: routeContext.institutionSearch.route || '/institution/search',
      translationId: 'catalogues.institutions'
    },
  };

  const activeType = Object.keys(options).find(type => options[type].route === location.pathname);
  const active = options[activeType];

  return <Div {...classNames}>
    <Menu
      placement="bottom-start"
      aria-label="Custom menu"
      trigger={<Button appearance="text">
        <MdApps />
        <span style={{ marginLeft: 6 }}>{label || (active ? <FormattedMessage id={active.translationId} /> : null)}</span>
      </Button>}
      items={menuState => availableCatalogues.map(name => <div key={name} css={menuOption(theme)} style={{ fontSize: '1em', background: location.pathname === options[name].route ? '#eee' : null }}>
        {options[name].link}
      </div>)
      }
    />
  </Div>
};