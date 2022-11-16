import { css, jsx } from '@emotion/react';
import React, { useContext } from 'react';
import get from 'lodash/get';
import union from 'lodash/union';
import { withFilter } from '../../widgets/Filter/state';
import ThemeContext from '../../style/themes/ThemeContext';
import { Trigger as MetaFilter } from '../../widgets/Filter/types/MetaFilter';

function getVisibleFilters(currentFilter, commonFilters) {
  const visibleFilters = union(
    commonFilters,
    Object.keys(get(currentFilter, 'must', {})),
    Object.keys(get(currentFilter, 'must_not', {}))
  );
  return visibleFilters;
}

const FilterBarContent = ({ className = '', config, filter, ...props }) => {
  const theme = useContext(ThemeContext);

  const visibleFilters = getVisibleFilters(
    filter,
    config.defaultVisibleFilters
  );
  const availableFilters = visibleFilters.map((x) => config.filters[x]);

  return (
    <div className={className} css={style(theme)} {...props}>
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

const FilterBar = ({
  className = '',
  config,
  filter,
  withWrapper = true,
  ...props
}) => {
  const theme = useContext(ThemeContext);
  const prefix = theme.prefix || 'gbif';
  const elementName = 'filterBar';

  return withWrapper ? (
    <div
      className={`${className} ${prefix}-${elementName}`}
      css={cssFilter({ theme })}
      {...props}
    >
      <div css={title({ theme })}>FILTERS</div>
      <FilterBarContent config={config} filter={filter} />
    </div>
  ) : (
    <FilterBarContent
      config={config}
      filter={filter}
      className={`${className} ${prefix}-${elementName}`}
      {...props}
    />
  );
};

FilterBarContent.propTypes = {};

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

export const title = ({ theme }) => css`
  position: absolute;
  font-size: 0.9em;
  font-weight: bold;
  color: ${theme.color500};
  top: -14px;
  left: 10px;
  background-color: ${theme.paperBackground};
  padding: 4px;
`;

export const cssFilter = ({ theme }) => css`
  position: relative;
  padding: 12px;
  border: 1px solid ${theme.paperBorderColor};
  border-radius: ${theme.borderRadius}px;
`;

const mapContextToProps = ({ filter }) => ({ filter });
export default withFilter(mapContextToProps)(FilterBar);