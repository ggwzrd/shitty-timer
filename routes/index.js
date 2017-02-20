var express = require('express');
var router = express.Router();
var device = require('express-device');
var jsonfile = require('jsonfile');
var database = 'tmp/database.json';

var user = require('../models/users');

// json configurations
jsonfile.spaces = 2; // n of tabs to use

/* GET home page. */
router.get('/', function(req, res, next) {
	user._authenticate(req, res);
	
	res.render('index', { title: 'Bathroom'});
});

router.patch('/state', function(req, res, next) {
	user._authenticate(req, res);

	var state = req.body.data;
	jsonfile.writeFileSync(database, state);
  res.contentType('json');
  res.send(JSON.stringify(state));
});

router.get('/current-state', function(req, res, next) {
	user._authenticate(req, res);

	res.contentType('json');
	res.send(JSON.stringify(jsonfile.readFileSync(database)));
});

router.get('/404', function(req, res, next){
	res.render('404', { title: 'Page not found'});
});


module.exports = router;
