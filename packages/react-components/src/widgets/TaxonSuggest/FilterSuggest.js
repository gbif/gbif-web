/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useState, useEffect, useContext } from "react";
import ThemeContext from '../../style/themes/ThemeContext';
import { useCombobox } from "downshift"; // example usage here https://codesandbox.io/s/usecombobox-usage-evufg
import { useDebounce } from "use-debounce"; // example here https://codesandbox.io/s/rr40wnropq
import axios from '../../search/OccurrenceSearch/api/axios';
import { focusStyle } from '../../style/shared';
import { StripeLoader } from '../../components/Loaders';
import { Input } from '../../components/Input/Input';
import { FilterBody } from '../Filter';

export const FilterSuggest = ({ focusRef, suggest, keyBy, onStateChange, itemToString, itemRenderer, selectedSet, onSelect, ...props }) => {
  const [inputItems, setInputItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useContext(ThemeContext);
  itemToString = itemToString || (e => e);

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    setInputValue,
    inputValue
  } = useCombobox({
    items: inputItems,
    // onInputValueChange: ({inputValue, selectedItem}) => {
    //   if (inputValue === '' || (selectedItem && inputValue === itemToString(selectedItem))) return;
    //   setLoading(true);
    // },
    onSelectedItemChange: ({ selectedItem }) => {
      setInputValue('');
      setLoading(false);
      if (typeof onSelect === 'function') {
        onSelect(selectedItem);
      }
    },
    onStateChange: onStateChange,
    itemToString
  });

  const [debouncedText] = useDebounce(inputValue, 100);
  useEffect(
    () => {
      let request;

      if (debouncedText && (!selectedItem || debouncedText !== itemToString(selectedItem))) {
        setLoading(true);
        request = suggest(debouncedText);
        request.then(response => { setInputItems(response.data); setLoading(false); })
          .catch(e => {
            if (axios.isCancel(e)) {
              return;
            }
            setInputItems([]);
            setLoading(false)
          });
      }
      return () => {
        if (request) {
          request.cancel(
            "Canceled because of component unmounted or debounce Text changed"
          );
        }
      };
    },
    [debouncedText, suggest]
  );

  return (
    <>
      {/* <label {...getLabelProps()}>Choose an element:</label> */}
      <div className="gbif-input gbif-filter-input" {...getComboboxProps({ ...props })}>
        <Input {...getInputProps({ ref: focusRef })} />
        <StripeLoader active={loading} />
      </div>
      {isOpen && <FilterBody style={{ padding: 0 }}>
        <ul {...getMenuProps()} css={filterSuggestDropdown(theme)}>
          {inputItems.map((item, index) => (
            <li
              key={keyBy ? item[keyBy] : item}
              {...getItemProps({ item, index })}
            >
              {itemRenderer({
                item,
                isHighlighted: highlightedIndex === index,
                selected: selectedSet && selectedSet.has(keyBy ? item[keyBy] : item)
              })}
            </li>
          ))}
        </ul>
      </FilterBody>}
    </>
  );
}



export const filterSuggestInput = theme => css`
  &>input {
    display: block;
    width: 100%;
    padding: 10px 20px;
    border: none;
    border-bottom: 1px solid #eee;
    /* ${focusStyle({ theme })} */
    outline: none;
  }
`;

export const filterSuggestDropdown = theme => css`
  background: white;
  font-size: 14px;
  padding: 0;
  margin: 0;
  list-style: none;
`;

export const filterSuggestOption = (theme, props = {}) => css`
  background: ${props.isHighlighted ? 'rgba(0,0,0,.05)' : null};
  font-size: 14px;
  padding: 5px 10px 5px 20px;
  position: relative;
  cursor: pointer;
  &>.gbif-help-text {
    color: #bbb;
    font-size: 12px;
  }
  &:before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    background: ${props.selected ? 'deepskyblue' : null};
    border-radius: 5px;
    position: absolute;
    left: 5px;
    top: 10px;
  }
`;

function getData(q, options) {
  return axios.get(`https://api.gbif-uat.org/v1/species/suggest?q=${q}`, options);
}

export const Classification = ({ taxon, ...props }) => {
  const ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
  return <span css={taxClass}>
    {ranks.map(rank => {
      return taxon.rank !== rank.toUpperCase() && taxon[rank] ? <span key={rank}>{taxon[rank]}</span> : null;
    })}
  </span>
}

export const taxClass = css`
  &>span:after {
    font-style: normal;
    content: ' ❯ ';
    font-size: 80%;
    color: #ccc;
    display: inline-block;
    padding: 0 3px;
  }
  &>span:last-of-type:after {
    display: none;
  }
`;

const Example = () => {
  const theme = useContext(ThemeContext);
  const selectedSet = new Set([1, 2, 3, 4, 5])
  return <FilterSuggest
    suggest={getData}
    keyBy="key"
    itemToString={item => item ? item.scientificName : ''}
    selectedSet={selectedSet}
    onStateChange={props => console.log(props)}
    itemRenderer={({ item, isHighlighted, selected }) => <div css={filterSuggestOption(theme, { isHighlighted, selected })}>
      <div>
        {item.scientificName}
      </div>
      <div className="gbif-help-text">
        <Classification taxon={item} />
      </div>
    </div>
    }
    onSelect={item => console.log(item)}
  />
}


export default Example;