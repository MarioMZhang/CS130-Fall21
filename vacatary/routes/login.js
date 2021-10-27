var express = require('express');
var router = express.Router();

// /* GET login page. */
// router.get('/', function(req, res, next) {
//     res.render('login', { title: 'Vacatary Login' });
// });


/* GET login. */
router.get('/', function(req, res, next) {
	let has_redirect = (req.query.redirect != null);
	let prompt = "Please Sign In";
  	res.render('login', { has_redirect: has_redirect, redirect_target: req.query.redirect, prompt: prompt });
});


module.exports = router;
