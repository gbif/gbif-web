const express = require('express');
const router = express.Router();

module.exports = function(app) {
    app.use('/unstable-api', router);
};

router.get('/test2', (req, res, next) => {
    res.send('hej2');
});