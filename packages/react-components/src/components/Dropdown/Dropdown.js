import React from 'react'
import {useSelect} from 'downshift'


const items = ['Neptunium', 'Plutonium', 'sdfg', 'tyui']
const menuStyles = {background: 'tomato'};

function DropdownSelect() {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({items})
  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <button {...getToggleButtonProps()}>{selectedItem || 'Elements'}</button>
      <ul {...getMenuProps()} style={menuStyles}>
        {isOpen &&
          items.map((item, index) => (
            <li
              style={
                highlightedIndex === index ? {backgroundColor: '#bde4ff'} : {}
              }
              key={`${item}${index}`}
              {...getItemProps({item, index})}
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  )
}

export default DropdownSelect;