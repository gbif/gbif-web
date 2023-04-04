import React, { useState } from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Select = styled.select`
  background-color: white;
  border: 1px solid gray;
  border-radius: 4px 0 0 4px;
  cursor: pointer;
  font-size: 16px;
  padding: 8px;
  appearance: none;
  position: relative;

  &::after {
    content: "";
    color: red;
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%) rotate(45deg);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6px 6px 0 6px;
    border-color: #666 transparent transparent transparent;
  }
`;

const Input = styled.input`
  border: 1px solid gray;
  border-radius: 0 4px 4px 0;
  font-size: 16px;
  padding: 8px;
`;

const CustomSelect = ({ options, value, onChange, inputPlaceholder }) => {
  const [selectedOption, setSelectedOption] = useState(value || "");

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    if (onChange) {
      onChange(selectedValue);
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setSelectedOption(inputValue);
    if (onChange) {
      onChange(inputValue);
    }
  };

  return (
    <Container>
      <Select value={selectedOption} onChange={handleSelectChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Input
        type="text"
        placeholder={inputPlaceholder || ""}
        value={selectedOption}
        onChange={handleInputChange}
      />
    </Container>
  );
};

export default CustomSelect;