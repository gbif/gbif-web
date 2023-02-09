import { css } from '@emotion/react';
import React, { useContext } from 'react';
import get from 'lodash/get';
import union from 'lodash/union';
import { withFilter } from '../../widgets/Filter/state';
import ThemeContext from '../../style/themes/ThemeContext';
import { Trigger as MetaFilter } from '../../widgets/Filter/types/MetaFilter';
import { MdFilterAlt } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

function getVisibleFilters(currentFilter, commonFilters) {
  const visibleFilters = union(
    commonFilters,
    Object.keys(get(currentFilter, 'must', {})),
    Object.keys(get(currentFilter, 'must_not', {}))
  );
  return visibleFilters;
}

const FilterBar = ({ className = '', config, filter, label, ...props }) => {
  const theme = useContext(ThemeContext);
  const prefix = theme.prefix || 'gbif';
  const elementName = 'filterBar';

  const visibleFilters = getVisibleFilters(
    filter,
    config.defaultVisibleFilters
  );
  const availableFilters = visibleFilters.map((x) => config.filters[x]);

  return (
    <div
      className={`${className} ${prefix}-${elementName}`}
      css={css`
        ${style(theme)}
      `}
      {...props}
    >
      {label && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '7.5px 15px 7.5px 7.5px',
            marginRight: 15,
            borderRight: `1px solid ${theme.paperBorderColor}`,
          }}
        >
          <MdFilterAlt />
          <span style={{ fontWeight: 'bold', marginLeft: 6 }}>
            <FormattedMessage id={label} defaultMessage='Filters' />
          </span>
        </div>
      )}
      {availableFilters.map((x, i) => {
        if (!x) return null; // if no widget is defined for this filter, then do not show anything
        return <x.Button key={i} />;
      })}
      {Object.keys(config.filters).length !==
        config.defaultVisibleFilters.length && (
        <div>
          <MetaFilter />
        </div>
      )}
    </div>
  );
};

FilterBar.propTypes = {};

export const style = (theme) => css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: -4px;
  > div {
    max-width: 100%;
    margin-right: 4px;
    margin-bottom: 4px;
  }
`;

const mapContextToProps = ({ filter }) => ({ filter });
export default withFilter(mapContextToProps)(FilterBar);
