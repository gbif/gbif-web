import React, { useState, useContext, useEffect } from "react";
import { css, cx } from 'emotion';
import styled from '@emotion/styled';
import Popover from '../../../components/Popover/Popover';
import { Button } from '../../../components/Button';
import Level from '../../../layout/Level';
import { MdMoreVert } from "react-icons/md";
import nanoid from 'nanoid';
import FilterState from './state/FilterState';
import FilterContext from './state/FilterContext';
import get from 'lodash/get';
import { Menu, MenuAction } from '../../../components/Menu';
import formatters from '../displayNames/formatters';
import Downshift from 'downshift';

const TaxonTitle = formatters('TaxonKey').component;

const FilterHeader = ({ title, showMenu, items }) => {
  return (
    <Level as="section" className={header}>
      <Level.Left>
        <Level.Item>
          {title}
        </Level.Item>
      </Level.Left>
      {showMenu && <Level.Right>
        <Level.Item>
          <Menu
            aria-label="Settings"
            trigger={<Button appearance="text"><MdMoreVert style={{ fontSize: 24 }} /></Button>}
            items={items}
          />
        </Level.Item>
      </Level.Right>}
    </Level>
  );
}

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

function TaxonFilter({ placement, ...props }) {
  const [id] = React.useState(nanoid);
  const currentFilterContext = useContext(FilterContext);
  const [tmpFilter, setFilter] = useState(currentFilterContext.filter);
  const [isAboutVisible, showAbout] = useState(false);
  const fieldName = 'taxonKey';

  useEffect(() => {
    setFilter(currentFilterContext.filter);
  }, [currentFilterContext.filter]);

  const popupContent = (popover, ref) => <FilterState filter={tmpFilter} onChange={updatedFilter => setFilter(updatedFilter)}>
    <FilterContext.Consumer>
      {({ setField, toggle, filter }) => {
        const checkedMap = new Set(get(filter, `must.${fieldName}`, []));
        return <div className={filterClass}>
          <FilterHeader title="Species or group" showMenu items={menuState => [
            <MenuAction key="about" onClick={() => { showAbout(true); menuState.hide() }}>About this filter</MenuAction>
          ]} />
          {!isAboutVisible && <Downshift
            onChange={selection =>
              alert(selection ? `You selected ${selection.value}` : 'Selection Cleared')
            }
            itemToString={item => (item ? item.value : '')}
          >
            {({
              getInputProps,
              getItemProps,
              getLabelProps,
              getMenuProps,
              isOpen,
              inputValue,
              highlightedIndex,
              selectedItem,
              getRootProps,
            }) => (
                <>
                  <div>
                    {/* <label {...getLabelProps()}>Enter a fruit</label> */}
                    <div {...getRootProps({}, { suppressRefError: true })}>
                      <input className={searchField} placeholder="Search for species" aria-label="Search for species" aria-placeholder="Puma concolor" {...getInputProps()} />
                    </div>
                  </div>
                  <div className={cx(body, scrollBox)}>
                    <ul {...getMenuProps({ isOpen })} style={{margin: 0, padding: 0}}>
                      {isOpen || true
                        ? items
                          .filter(item => !inputValue || item.value.includes(inputValue))
                          .map((item, index) => (
                            <Item
                              key={index}
                              {...getItemProps({
                                item,
                                index,
                                isActive: highlightedIndex === index,
                                isSelected: selectedItem === item,
                              })}
                            >
                              {itemToString(item)}
                            </Item>
                          ))
                        : null}
                    </ul>
                  </div>
                </>
              )}
          </Downshift>
          }
        </div>
      }
      }
    </FilterContext.Consumer>
  </FilterState >

  return (<Popover
    style={{ width: 400, maxWidth: '100%' }}
    onClose={e => currentFilterContext.setFilter(tmpFilter)}
    aria-label={`Filter on ${fieldName}`}
    modal={popupContent}
    placement={placement}
    visible
    trigger={<FilterButton {...props} fieldName={fieldName} filter={currentFilterContext.filter}></FilterButton>}
  />);
}

const FilterButton = React.forwardRef(({ filter, fieldName, ...props }, ref) => {
  const appliedFiltersSet = new Set(get(filter, `must.${fieldName}`, []));
  if (appliedFiltersSet.size === 1) {
    const selected = filter.must[fieldName][0];
    return <Button {...props} ref={ref}>key: {selected}</Button>
  }
  if (appliedFiltersSet.size > 1) {
    return <Button {...props} ref={ref}>{appliedFiltersSet.size} {fieldName}s</Button>
  }
  return <Button appearance="primaryOutline" {...props} ref={ref}>{fieldName}</Button>
});

const optionClass = css`
  padding: 6px 0;
  &:last-child {
    margin-bottom: 0;
  }
  /* & *::selection {
                  color: none;
                background: none;
              } */
            `;

const description = css`
              padding-top: 20px;
              padding-bottom: 20px;
            `;

const infoHeader = css`
              font-size: .85em;
              color: #999;
              padding: .5em 1.5em;
              font-weight: 200;
            `;

const filterClass = css`
              display: flex;
              flex-direction: column;
              overflow: hidden;
              max-height: inherit;
            `;

const header = css`
              border-bottom: 1px solid #eee;
              padding: 1.2em 1.5em;
              flex: 0 0 auto;
            `;

const body = css`
              /* border-bottom: 1px solid #eee; */
              padding: .5em 1.5em;
              flex: 1 1 auto;
              overflow: auto;
              scrollbar-width: thin;
  &::-webkit-scrollbar {
                  width: 6px;
            }
  &::-webkit-scrollbar-thumb {
                  background - color: #686868;
              }
            `;

const footer = css`
              padding: .8em 1em;
              flex: 0 0 auto;
            `;

// https://stackoverflow.com/questions/9333379/check-if-an-elements-content-is-overflowing
// I would never have thought of this myself.
const scrollBox = css`
              /* background: */
                /* Shadow covers */
                /* linear-gradient(white 30%, rgba(255,255,255,0)),
                linear-gradient(rgba(255,255,255,0), white 70%) 0 100%, */
                
                /* Shadows */
                /* radial-gradient(50% 0, farthest-side, rgba(0,0,0,.2), rgba(0,0,0,0)),
                radial-gradient(50% 100%,farthest-side, rgba(0,0,0,.2), rgba(0,0,0,0)) 0 100%; */
              background:
                /* Shadow covers */
                linear-gradient(white 30%, rgba(255,255,255,0)),
                linear-gradient(rgba(255,255,255,0), white 70%) 0 100%,
                
                /* Shadows */
                linear-gradient(to bottom, #eee 1px, transparent 1px 100%),
                /* linear-gradient(to bottom, #eee 1px, transparent 6px 100%), */
                linear-gradient(to bottom, transparent calc(100% - 1px), #eee calc(100% - 1px) 100%);
              background-repeat: no-repeat;
              background-color: white;
              background-size: 100% 10px, 100% 10px, 100% 20px, 100% calc(100% - 1px);
              
              /* Opera doesn't support this in the shorthand */
              background-attachment: local, local, scroll, scroll;
            `;

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