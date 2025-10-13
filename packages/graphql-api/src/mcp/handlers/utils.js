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

export function parseInputArrayParam(value) {
  /* the llm sometimes mess up and return an array as a comma seperated string or a string quoted json array. 
  If we are confident this is nonsense, then we might as well just parse it */
  if (typeof value === 'string') {
    if (!value.includes('[') && !value.includes(',')) {
      return [value];
    }
    // Try to parse as JSON
    try {
      const jsonArray = JSON.parse(value);
      if (Array.isArray(jsonArray)) {
        return jsonArray;
      }
    } catch {
      // Ignore JSON parse errors
    }
    // If not JSON, split by comma
    return value.split(',').map((item) => item.trim());
  }
  // If not a string, return as is
  return value;
}

export class McpError extends Error {
  constructor(
    message = 'Unable to fetch data right now, please try again later.',
    status = 500,
  ) {
    super(message);
    this.status = status;
  }
}
