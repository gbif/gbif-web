
const {getEnumData} = require('./enum')
const config = require("../../config");
const _ = require("lodash")
const hash = require('object-hash');
const interval = _.get(config, "healthUpdateFrequency.enums", 30000);


let status = { status: "ok", message: null, error: null };


async function getLatestInterpretationRemark(){
  // Discretely write latest interpretationRemark
  try {
    const interpretationRemarkLatest = await getEnumData('enumeration/interpretationRemark')
    return interpretationRemarkLatest;
    //await fs.writeFile(`${__dirname}/interpretationRemark.json`, JSON.stringify(interpretationRemarkLatest, null, 2));
   } catch(error){
     console.log("Failed to fetch latest interpretationRemark from API:")
     console.log(error)
   } 
}

const getChangedValues = (prevMap, currentMap) => {
    const newValues = _.difference(Object.keys(currentMap), Object.keys(prevMap));
    const missingValues = _.difference(Object.keys(prevMap), Object.keys(currentMap));
    let msg = "";
    if(newValues.length){
        msg += `New values: ${newValues.join(", ")}`
    }
    if(missingValues.length){
        msg += `Missing values: ${missingValues.join(", ")}`
    }
    return msg;

}

const getTermDiffs = (current, prev) => {
    // First check if they are JSON identical before doing the expensive check
    if (hash(current, { unorderedArrays: true }) === hash(prev, { unorderedArrays: true })) {
      return [];
    } else {
      return [
        ..._.difference(current, prev).map((d) => `New related term: ${d}`),
        ..._.difference(prev, current).map((d) => `Missing related term: ${d}`),
      ];
    }
  };


const getChangeReport =  (current) => {
    const prev = require("../../enums/interpretationRemark.json");
    const prevMap = _.keyBy(prev, 'id');
    const currentMap = _.keyBy(current, 'id');
    const msg = getChangedValues(prevMap, currentMap);
    const diffs = Object.keys(prevMap).map(key => {
        if(currentMap[key] && (hash(currentMap[key], { unorderedArrays: true }) !== hash(prevMap[key], { unorderedArrays: true }))){
            const statusDiffMsg = prevMap[key].status !== currentMap[key].status ? `Status changed to ${currentMap[key].status}` : '';
            const termsDiffMsg = getTermDiffs(currentMap[key].relatedTerms, prevMap[key].relatedTerms)
            return (statusDiffMsg || termsDiffMsg.length > 0) ? `${key}: ${statusDiffMsg ? statusDiffMsg +'; ': ""}${termsDiffMsg.join('; ')}` : undefined;
        } else {
            return undefined;
        }
    }).filter(d => !!d) 

    return `${msg ? msg+"; " : ""}${diffs.join("; ")}`
}

//   const prevVersionEnums = require("../../enums/enums.json");


async function update() {
    try {
      const enumMap = await getLatestInterpretationRemark();
      const changeReport = getChangeReport(enumMap);
      if (changeReport) {
        status = {
          status: "warning",
          message: `InterpretationRemark out of sync, needs update. ${changeReport}`,
          error: null
        };
      } else {
        status = { status: "ok", message: null, error: null };
      }
      setTimeout(update, interval)
    } catch (err) {
      status = { status: "error", message: null, error: err };
      setTimeout(update, interval)
    }
  }
  
  const getInterpretationRemarkStatus = () => status;
  
  update();

  module.exports= {
    getInterpretationRemarkStatus,
    getLatestInterpretationRemark
  }


 