import { inspect } from 'node:util';

export default function json2str(
  input,
  { compact = false, maxStringLength = 150 } = {},
) {
  try {
    const resultString = inspect(input, {
      showHidden: false,
      depth: null, // Shows all nested levels
      colors: false, // Adds color to output (optional)
      compact, // Forces newlines and indentation
      breakLength: Infinity, // Controls when to break to newlines, only relevant when compact is true
      maxStringLength, // Truncates long strings
    });
    return resultString;
  } catch (error) {
    console.error('Error simplifying JSON:', error);
    return JSON.stringify(input);
  }
}
