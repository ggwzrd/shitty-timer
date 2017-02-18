var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
jsonfile.spaces = 2;
var database = 'tmp/database.json';
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Bathroom'});
});

router.patch('/state', function(req, res, next) {
	var state = req.body.data;
	jsonfile.writeFileSync(database, state);
  res.contentType('json');
  res.send(JSON.stringify(state));
});

router.get('/current-state', function(req, res, next) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.dir(ip);
	res.contentType('json');
	res.send(JSON.stringify(jsonfile.readFileSync(database)));
});

module.exports = router;
