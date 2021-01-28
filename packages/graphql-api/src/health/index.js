const { getEnumStatus } = require("./components/enum");

module.exports = function (req, res) {
  try {
    res.setHeader("Cache-Control", "public, max-age=5"); // 5 seconds
    res.json({ enums: getEnumStatus() });
  } catch(err){
      console.log(err)
      res.sendStatus(500)
  }
};
