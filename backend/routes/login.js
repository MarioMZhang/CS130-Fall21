var express = require('express');
var router = express.Router();

let GrandValet = require('../db-v2');

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
		// first retrieve the stored hash 
		let users = GrandValet.Database.collection('Users');
		users.findOne({username: input_username}).then(
			(user) => {
				if (user == null) {
					res.status(401); 
					let prompt = "The specified user does not exist. Please try again.";
					res.render('login', {has_redirect: (req.body.redirect != null), redirect_target: req.body.redirect, prompt: prompt});
				}
				else {
					// check whether password is valid
					let hash = user.password;
					bcrypt.compare(input_password, hash, function(err, result) {
					    if (result) {
					    	// password match
					    	let expiration = Math.floor(Date.now() / 1000) + (2 * 60 * 60);// Math.round(Date.now() / 60) + 2*60*60;
					    	let token = jwt.sign({ "exp": expiration, "usr": input_username }, JWT_KEY, { algorithm: 'HS256'});
					    	res.cookie("jwt", token);
					    	if (req.body.redirect != null) {
					    		res.status(302); 
					    		res.redirect(req.body.redirect);
					    	}
					    	else {
						    	res.status(200); 
						    	res.send('Authentication is successful.')
					    	}
					    }
					    else {
					    	// wrong password
							res.status(401); 
							let prompt = "Wrong password. Please try again.";
					    	res.render('login', {has_redirect: (req.body.redirect != null), redirect_target: req.body.redirect, prompt: prompt});
					    }
					});
				}
			}
		)
	}
  	
});


module.exports = router;
