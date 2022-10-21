/*
Guess a schema from a set of samples. Very crude, but saves a lot of typing.
*/
import { merge, isArray } from 'lodash';
import commandLineArgs from 'command-line-args';

const cliOptions = [
  { name: 'name', alias: 'n', type: String, defaultValue: 'tmp' },
];
const options = commandLineArgs(cliOptions);

if (!options.name) {
  throw new Error(
    'A name is required. e.g. "dataset" - should correspond to a saved json file',
  );
}

function guessType(val, key) {
  if (isArray(val)) {
    return `[${guessType(val[0], key)}]`;
  }

  // Typically used field names
  if (key === 'key') return 'ID!';
  if (key === 'contacts') return 'Contact';
  if (key === 'comments') return 'Comment';
  if (key === 'machineTags') return 'MachineTag';
  if (key === 'tags') return 'Tag';
  if (key === 'identifiers') return 'Identifier';
  if (key === 'endpoints') return 'Endpoint';
  if (key === 'modified') return 'DateTime';
  if (key === 'created') return 'DateTime';
  if (key === 'language') return 'Language';
  if (key === 'logoUrl') return 'URL';
  if (key === 'homepage') return 'URL';
  if (key === 'country') return 'Country';
  if (key === 'continent') return 'Continent';
  if (key === 'gbifRegion') return 'GbifRegion';
  if (key.endsWith('Key')) return 'ID';

  // Guess
  if (typeof val === 'string') return 'String';
  if (typeof val === 'number') return 'Int';
  if (typeof val === 'boolean') return 'Boolean';
  if (typeof val === 'object') return 'JSON';
  return 'String';
}

async function guessSchema() {
  let list;
  try {
    list = await import(`./data/${options.name}.json`);
    console.log(`${list.length} items in list`);
  } catch (err) {
    throw new Error(
      'A name is required. e.g. "dataset" - should correspond to a saved json file',
    );
  }

  const merged = merge({}, ...list);
  Object.keys(merged)
    .sort()
    .forEach((key) => {
      console.log(`${key}: ${guessType(merged[key], key)}`);
    });
}

guessSchema();
