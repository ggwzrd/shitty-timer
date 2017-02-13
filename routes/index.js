var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bathroom', jsonfile: jsonfile });
});

module.exports = router;
