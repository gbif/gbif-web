import React, { useState, useEffect } from "react";
import { css, cx } from 'emotion';
import displayValue from '../../search/OccurrenceSearch/displayNames/displayValue';
import { useCombobox } from "downshift"; // example usage here https://codesandbox.io/s/usecombobox-usage-evufg
import { useDebounce } from "use-debounce"; // example here https://codesandbox.io/s/rr40wnropq
import axios from '../../search/OccurrenceSearch/api/axios';

function getData(q, options) {
  return axios.get(`http://api.gbif.org/v1/species/suggest?datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c&limit=10&q=${q}`, options);
}

function TaxonSuggest() {
  const [inputItems, setInputItems] = useState([]);
  const [loading, setLoading] = useState(false);

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
    onSelectedItemChange: () => {
      setInputValue('');
    },
    itemToString: item => item.scientificName
  });

  const [debouncedText] = useDebounce(inputValue, 500);
  useEffect(
    () => {
      let request;
      if (debouncedText) {
        setLoading(true);
        request = getData(debouncedText);
        request.then(response => { setInputItems(response.data); })
          .catch(e => {
            if (axios.isCancel(e)) {
              return;
            }
            setInputItems([]);
          })
          .finally(() => setLoading(false));
      }
      return () => {
        if (request) {
          request.cancel(
            "Canceled because of component unmounted or debounce Text changed"
          );
        }
      };
    },
    [debouncedText]
  );

  return (
    <>
      <label {...getLabelProps()}>Choose an element:</label>
      <div style={{ display: "inline-block" }} {...getComboboxProps()}>
        <input {...getInputProps()} />
      </div>
      <ul {...getMenuProps()}>
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              style={
                highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}
              }
              key={item.key}
              {...getItemProps({ item, index })}
            >
              {item.scientificName}
              <div>{item.canonicalName}</div>
            </li>
          ))}
      </ul>
      {loading && <h1>Loading</h1>}
      <h1>{selectedItem && selectedItem.scientificName}</h1>
    </>
  );
}

const Example = props => {
  return <TaxonSuggest />
}


export default Example;