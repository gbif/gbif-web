const { getEnumStatus } = require("./components/enum");
const {getInterpretationRemarkStatus} = require("./components/interpretationRemark");
module.exports = function (req, res) {
  try {
    res.setHeader("Cache-Control", "public, max-age=5"); // 5 seconds
    res.json({ enums: getEnumStatus(), interpetationRemark: getInterpretationRemarkStatus() });
  } catch(err){
      console.log(err)
      res.sendStatus(500)
  }
};
