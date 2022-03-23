import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import styles from './styles';
import CatalogueSelector from './CatalogueSelector';
import { NavBar, NavItem } from '../NavBar/NavBar';

export function DataHeader({
  as: Div = 'div',
  className,
  left,
  catalogueLabel,
  availableCatalogues,
  right,
  children,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const showCatalogue = availableCatalogues && availableCatalogues.length > 1;

  const hasLeftPart = left || catalogueLabel || showCatalogue;
  // if there is nothing configured, then do not show at all
  if (!hasLeftPart && !children && !right) return null;

  const { classNames } = getClasses(theme.prefix, 'dataHeader', {/*modifiers goes here*/ }, className);
  return <Div css={styles.dataHeader({ theme })} {...props}>

    {hasLeftPart && <>
      <div style={{ flex: '0 0 auto', position: 'relative', margin: '0 12px', display: 'flex', alignItems: 'center' }}>
        {left || <CatalogueSelector label={catalogueLabel} availableCatalogues={availableCatalogues} />}
      </div>
      {children && <Separator />}
    </>}

    <div style={{ flex: '1 1 auto', overflow: 'hidden' }}>
      {children || <NavBar aria-hidden="true" style={{visibility: 'hidden', width: 0}}><NavItem label="Table" data-targetid="table" /></NavBar>}
    </div>

    {right && <>
      <Separator />
      <div style={{ flex: '0 0 auto' }}>
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