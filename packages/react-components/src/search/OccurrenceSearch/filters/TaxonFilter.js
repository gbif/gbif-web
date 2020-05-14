import React, { useState, useContext, useEffect } from "react";
import PropTypes from 'prop-types';
import Popover from '../../../components/Popover/Popover';
import { Button } from '../../../components/Button';
import { Prose } from '../../../typography/Prose';
import { nanoid } from 'nanoid';
import FilterState from './state/FilterState';
import FilterContext from './state/FilterContext';
import union from 'lodash/union';
import get from 'lodash/get';
import { MenuAction } from '../../../components/Menu';
// import formatters from '../displayNames/formatters';
import { css } from 'emotion';
import styled from '@emotion/styled';
import { Header, Footer, Option, SummaryBar, FilterBody, FilterBodyDescription, FilterBox } from '../../../widgets/Filter';

const searchField = css`
  font-size: 14px;
  border-radius: 3px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: none;
  display: block;
  width: 100%;
`;

const items = [
  { value: 'apple' },
  { value: 'pear' },
  { value: 'orange' },
  { value: 'grape' },
  { value: 'banana' },
];
const itemToString = i => (i ? i.value : '');

const PopupContent = ({ filterName, tmpFilter, setFilter, onCancel, onApply, focusRef }) => {
  const [id] = React.useState(nanoid);
  const [isAboutVisible, showAbout] = useState(false);
  const [initialOptions] = useState(get(tmpFilter, `must.${filterName}`, []));

  return <FilterState filter={tmpFilter} onChange={updatedFilter => setFilter(updatedFilter)}>
    <FilterContext.Consumer>
      {({ setField, toggle, filter }) => {
        const selected = get(filter, `must.${filterName}`, []);
        const checkedMap = new Set(selected);
        const options = union(initialOptions, selected);
        return <FilterBox>
          <Header menuItems={menuState => [<MenuAction key="about" onClick={() => { showAbout(true); menuState.hide() }}>About this filter</MenuAction>]} >
            Scientific name
          </Header>
          {!isAboutVisible &&
            <>
              <SummaryBar count={checkedMap.size} onClear={() => setField(filterName, [])} />
              <FilterBody>
                <form id={id} onSubmit={e => e.preventDefault()} >
                  {options.map((taxonKey) => {
                    return <Option
                      key={taxonKey}
                      helpVisible={true}
                      helpText="needs writing"
                      label={taxonKey}
                      checked={checkedMap.has(taxonKey)}
                      onChange={() => toggle(filterName, taxonKey)}
                    />
                  })}
                </form>
              </FilterBody>
            </>
          }
          {isAboutVisible &&
            <Prose as={FilterBodyDescription}>
              Some prose describing this filter
            </Prose>
          }
          <Footer
            formId={id}
            onApply={() => onApply(filter)}
            onCancel={onCancel}
            onBack={() => showAbout(false)}
            showBack={isAboutVisible}
          />
        </FilterBox>
      }}
    </FilterContext.Consumer>
  </FilterState>
}

PopupContent.propTypes = {
  vocabularyName: PropTypes.string,
  filterName: PropTypes.string,
  tmpFilter: PropTypes.object,
  vocabulary: PropTypes.object,
  setFilter: PropTypes.func,
  onCancel: PropTypes.func,
  onApply: PropTypes.func,
  focusRef: PropTypes.any
};

function TaxonFilter({ placement, ...props }) {
  const currentFilterContext = useContext(FilterContext);
  const [tmpFilter, setFilter] = useState(currentFilterContext.filter);

  useEffect(() => {
    setFilter(currentFilterContext.filter);
  }, [currentFilterContext.filter]);

  return (
    <Popover
      style={{ width: '22em', maxWidth: '100%' }}
      onClickOutside={popover => { currentFilterContext.setFilter(tmpFilter); popover.hide() }}
      aria-label={`Filter on scienitific name`}
      placement={placement}
      trigger={<FilterButton {...props} filterName="TaxonKey" filter={currentFilterContext.filter}></FilterButton>}
    >
      {({ popover, focusRef }) => {
        return (<PopupContent
          filterName="TaxonKey"
          tmpFilter={tmpFilter}
          setFilter={setFilter}
          onApply={() => { currentFilterContext.setFilter(tmpFilter); popover.hide() }}
          onCancel={() => { setFilter(currentFilterContext.filter); popover.hide(); }}
          focusRef={focusRef}
        />)
      }}
    </Popover>
  );
}

const FilterButton = React.forwardRef(({ filter, filterName, ...props }, ref) => {
  const selected = get(filter, `must.${filterName}`, []);
  const appliedFiltersSet = new Set(get(filter, `must.${filterName}`, []));
  if (appliedFiltersSet.size === 1) {
    return <Button {...props} ref={ref}>{selected[0]}</Button>
  }
  if (appliedFiltersSet.size > 1) {
    return <Button {...props} ref={ref}>{appliedFiltersSet.size} {filterName}s</Button>
  }
  return <Button appearance="primaryOutline" {...props} ref={ref}>{filterName}</Button>
});

FilterButton.displayName = 'FilterButton';

const Item = styled('li')(
  {
    position: 'relative',
    cursor: 'pointer',
    display: 'block',
    border: 'none',
    height: 'auto',
    textAlign: 'left',
    borderTop: 'none',
    lineHeight: '1em',
    color: 'rgba(0,0,0,.87)',
    fontSize: '1rem',
    textTransform: 'none',
    fontWeight: '400',
    boxShadow: 'none',
    padding: '.8rem 1.1rem',
    whiteSpace: 'normal',
    wordWrap: 'normal',
  },
  ({ isActive, isSelected }) => {
    const styles = []
    if (isActive) {
      styles.push({
        color: 'rgba(0,0,0,.95)',
        background: 'rgba(0,0,0,.03)',
      })
    }
    if (isSelected) {
      styles.push({
        color: 'rgba(0,0,0,.95)',
        fontWeight: '700',
      })
    }
    return styles
  },
)

export default TaxonFilter;