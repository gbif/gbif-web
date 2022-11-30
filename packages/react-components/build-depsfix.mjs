import fs from 'fs';

// Replace all .cjs instances with .esm in @emotion - forces esbuild to use ESM
const PATH = './node_modules/@emotion';
for (const moduleName of fs.readdirSync(PATH)) {
	const filePath = `${PATH}/${moduleName}/package.json`;
	const packageJson = fs.readFileSync(filePath, 'utf8');
	fs.writeFileSync(filePath, packageJson.replace(/\.cjs/g, '.esm'));
}