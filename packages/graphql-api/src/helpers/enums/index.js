import enumsJson from './enums.json';
/* 
async function getLatestInterpretationRemark(){
  // Discretely write latest interpretationRemark
  try {
    const interpretationRemarkLatest = await getEnumData('enumeration/interpretationRemark')
    await fs.writeFile(`${__dirname}/interpretationRemark.json`, JSON.stringify(interpretationRemarkLatest, null, 2));
   } catch(error){
     console.log("Failed to fetch latest interpretationRemark from API:")
     console.log(error)
   } 
}
 */

const getSchema = (enums) => {
  const schemas = Object.keys(enums).map((enumType) => {
    const list = enums[enumType].reduce(
      // eslint-disable-next-line no-return-assign, no-param-reassign
      (accumulator, currentValue) => (accumulator += `${currentValue}\n`),
      '',
    );
    return `
      enum ${enumType.replace(/\./g, '_')} {
      ${list}}
      `;
  });
  return schemas.reduce((acc, curr) => acc + curr, '');
};

async function getEnumTypeDefs() {
  // enums can be updated: npm run write-enums
  return getSchema(enumsJson);
}

export { getEnumTypeDefs, getSchema };
