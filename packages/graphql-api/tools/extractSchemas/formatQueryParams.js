const commandLineArgs = require('command-line-args');
const cliOptions = [
  { name: 'params', alias: 'p', type: String, defaultValue: 'q' },
];
const options = commandLineArgs(cliOptions);

let paramString = '';
options.params.split(',').forEach(y => {
  let x = y.trim();
  let type = 'String';
  if (x === 'country') type = 'Country';
  if (x === 'identifierType') type = 'IdentifierType';

  paramString += `${x}: ${type},\n`;
});

console.log(paramString.slice(0, -2));