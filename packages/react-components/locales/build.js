const path = require('path');
const fs = require("fs");
console.log("build locales: " + process.env.NODE_ENV )

let envFile = path.resolve(__dirname, "../.env.json");
if (typeof process.env.NODE_ENV !== 'undefined') {
    envFile = path.resolve(__dirname, `../.env.${process.env.NODE_ENV}.json`);
    if (!fs.existsSync(envFile)) {
        console.log("Cannot find env file: "+ envFile );
        envFile = path.resolve(__dirname, "../.env.json");
    }
}
console.log("Using env: " + envFile);

const env = require(envFile);
const locales = env.LOCALES;
const build = require('./scripts/build');
build(locales, env);