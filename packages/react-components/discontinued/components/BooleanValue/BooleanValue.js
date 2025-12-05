import React from 'react';


/**
 * Widget for boolean value representation with color indicator and Yes/No text transcription
 * @param value
 * @returns {*}
 * @constructor
 */
const BooleanValue = ({ value }) => (
  (value === false || value === true) ? (value ? "Yes" : "No") : null
);


export default BooleanValue;