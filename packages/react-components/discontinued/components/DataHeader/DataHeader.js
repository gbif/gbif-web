import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import styles from './styles';
import CatalogueSelector from './CatalogueSelector';
import { NavBar, NavItem } from '../NavBar/NavBar';
import SiteContext from '../../dataManagement/SiteContext';

export function DataHeader({
  as: Div = 'div',
  className,
  left,
  catalogueLabel,
  availableCatalogues,
  right,
  children,
  showEmpty = false,
  ...props
}) {
  const siteConfig = useContext(SiteContext);
  const theme = useContext(ThemeContext);
  const catalogues = availableCatalogues ?? siteConfig.availableCatalogues;
  const showCatalogue = catalogues && catalogues.length > 1;

  const hasLeftPart = left || catalogueLabel || showCatalogue;
  // if there is nothing configured, then do not show at all
  if (!hasLeftPart && !children && !right && !showEmpty) return null;

  return <Div css={styles.dataHeader} {...props}>

    {hasLeftPart && <>
      <div style={{ flex: '0 0 auto', position: 'relative', margin: '0 12px', display: 'flex', alignItems: 'center' }}>
        { showCatalogue && <CatalogueSelector label={catalogueLabel} availableCatalogues={catalogues} /> }
        {left}
      </div>
      {children && <Separator />}
    </>}

    <div style={{ flex: '1 1 auto', overflow: 'hidden' }}>
      {children || <NavBar aria-hidden="true" style={{visibility: 'hidden', width: 0}}><NavItem label="Table" data-targetid="table" /></NavBar>}
    </div>

    {right && <>
      {/* <Separator /> */}
      <div css={styles.dataHeaderRight}>
        {right}
      </div>
    </>}

  </Div>
};

DataHeader.propTypes = {
  as: PropTypes.element
};

export function Separator() {
  return <div style={{ flex: '0 0 1px', borderRight: '1px solid #aaa', height: '1.5em', margin: '0 6px' }}></div>
}