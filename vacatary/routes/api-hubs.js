var express = require('express');
var router = express.Router();

let client = require('../db');


/* Hubs api. */
/* GET api. */
router.get('/hubs', function(req, res, next) {
	res.status(200);
	res.send("GET /api/hubs placeholder");
})

/* POST api. */
router.post('/hubs', function(req, res, next) {
	res.status(200);
	res.send("POST /api/hubs placeholder");
})


module.exports = router;
