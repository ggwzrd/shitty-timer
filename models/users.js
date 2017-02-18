var user = {
	_authenticate: function (req, res){
		// get ip client address
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
		// get host
		host = req.headers.host.slice(req.headers.host - 5, -5);
		// redirect if not in the house
		if(ip !== '77.170.242.142' && host !== 'localhost') res.redirect('/404');

	}
};


module.exports = user;
