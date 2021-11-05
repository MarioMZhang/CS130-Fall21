var express = require('express');
var router = express.Router();


/* GET login. */
router.get('/', function(req, res, next) {
	let has_redirect = (req.query.redirect != null);
	let prompt = "Please Sign In";
  	res.render('login', { has_redirect: has_redirect, 
  		redirect_target: req.query.redirect, prompt: prompt });
});


/* POST login. */
router.post('/', function(req, res, next) {
	if (req.body.username == null || req.body.password == null) {
		res.status(401);
		res.send('Request must include both username and password.');
	}
	else {
		let input_username = req.body.username;
		let input_password = req.body.password;
		let input_usertype = req.body.usertype;
		
		res.status(200);
		res.send('Received login request with username ' + input_username + 
			' and usertype ' + input_usertype + ' and password ' + input_password);

		// TODO: check username and password and send token if login succeeds.
	}
  	
});


module.exports = router;
