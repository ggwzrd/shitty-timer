var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
var database = '/tmp/database.json'
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Bathroom'});
});

router.patch('/state', function(req, res, next) {
	var state = req.body.data;
	jsonfile.writeFileSync(database, state)
  res.contentType('json');
  res.send(JSON.stringify(state));
});

router.get('/current-state', function(req, res, next) {
	jsonfile.readFile(database, function(err, state) {
	  res.contentType('json');
	  res.send(JSON.stringify(state));
	});
});

module.exports = router;
