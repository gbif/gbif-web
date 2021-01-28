const fs = require("fs").promises;
const { loadEnums, schemaIsValid } = require("../src/health/components/enum");

const writeEnums = async () => {
  try {
    console.log("Loading enums from API, hang on.");
    const enumMap = await loadEnums();
    console.log("Enums loaded, validating ...");
    const validationReport = schemaIsValid(enumMap);
    if (validationReport.valid) {
      console.log("GraphQL schema is valid, writing /src/enums/enums.json");
    } else {
      console.log(
        "GraphQL schema invalid, please adress the following error before starting the application:"
      );
      console.log(validationReport.error);
      console.log("Writing /src/enums/enums.json");
    }
    return fs
      .writeFile(
        `${__dirname}/../src/enums/enums.json`,
        JSON.stringify(enumMap, null, 2)
      )
      .then(() => console.log("Done."));
  } catch (err) {
    console.log(err);
    return Promise.resolve();
  }
};

writeEnums().then(process.exit);
