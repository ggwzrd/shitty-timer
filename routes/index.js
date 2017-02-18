var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
jsonfile.spaces = 2;
var database = 'tmp/database.json';

function authorize(req, res){
	// get ip client address
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
	// get host
	host = req.headers.host.slice(req.headers.host - 5, -5);
	// redirect if not in the house
	if(ip !== '77.170.242.142' && host !== 'localhost') res.redirect('/404');
};

/* GET home page. */
router.get('/', function(req, res, next) {
	authorize(req, res);

	res.render('index', { title: 'Bathroom'});
});

router.patch('/state', function(req, res, next) {
	authorize(req, res);
	
	var state = req.body.data;
	jsonfile.writeFileSync(database, state);
  res.contentType('json');
  res.send(JSON.stringify(state));
});

router.get('/current-state', function(req, res, next) {
	authorize(req, res);

	res.contentType('json');
	res.send(JSON.stringify(jsonfile.readFileSync(database)));
});

router.get('/404', function(req, res, next){
	res.render('404', { title: 'Page not found'});
});


module.exports = router;
