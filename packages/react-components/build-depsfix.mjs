import fs from 'fs';

const PATH = './node_modules/@emotion';

// Replace all .cjs instances with .esm, to force esbuild to use ESM
for (const moduleName of fs.readdirSync(PATH)) {
	const filePath = `${PATH}/${moduleName}/package.json`;
	const packageJson = fs.readFileSync(filePath, 'utf8');
	fs.writeFileSync(filePath, packageJson.replace(/\.cjs/g, '.esm'));
}

// fs.writeFileSync('./node_modules/@emotion/react/package.json')