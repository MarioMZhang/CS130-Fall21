var express = require('express');
var router = express.Router();

let GrandValet = require('../db-v2');


/* Hubs api. */
/* GET api. */
router.get('/hubs', function(req, res, next) {
	// TODO: maybe add some other fields
	let hubid = req.query.hubid;

	// if hubid is null, return all the active hubs 
	if(hubid == null) {
		GrandValet.Database.read_activeHubs().then((hubs) => {
			hubs.forEach((x) => { delete x._id; });
			res.status(200);
			res.append('Content-Type', 'application/json');
			res.json(hubs);
		})
	}

	// if hubid is not null, only return the hub corresponding to that id
	else {
		GrandValet.Database.read_hub(parseInt(hubid)).then((hub) => {
			if(hub != null) {
				delete hub._id;
				res.status(200);
				res.append('Content-Type', 'application/json');
				res.json(hub);
			}
			else {
				res.status(404);
				res.send("Cannot find the requested hub.");
			}
		})
	}

})


/* POST api. */
router.post('/hubs', function(req, res, next) {
	if (req.body.hubId == null || req.body.description == null || 
		req.body.startTime == null || req.body.endTime == null) {
		res.status(400);
		res.send("Bad request format.");
	}
	else {
		let hubid = parseInt(req.body.hubId);
		// new hub 
		if (hubid == 0) {
			// get max postid, then update both databases
			GrandValet.Database.read_maxMaxHubId().then((maxHubId) => {
				let new_entry = {};
				new_entry.hubid = maxHubId + 1;
				new_entry.description = req.body.description;
				new_entry.startTime = req.body.startTime;
				new_entry.endTime = req.body.endTime;
				new_entry.location = req.body.location;
				GrandValet.Database.store_hub(new_entry).then(() => {
					res.status(201);
					res.append('Content-Type', 'application/json');
					res.json(new_entry);
				})
			})
		}
		// update existing hub
		else if (hubid > 0){
			GrandValet.Database.read_hub(hubid).then((hub) => {
				if(hub == null) {
					res.status(404);
					res.send("Bad request: cannot find specified hub.");
				}
				else {
					GrandValet.Database.store_hub({hubId: hubid, description: req.body.description, startTime: req.body.startTime, endTime: req.body.endTime, location: req.body.location})
					.then(() => {
						res.status(200);
						res.append('Content-Type', 'application/json');
						res.json({hubId: hubid, description: req.body.description, startTime: req.body.startTime, endTime: req.body.endTime, location: req.body.location});
					})
				}
			})
		}
		else {
			res.status(400);
			res.send("Bad request format: hubid must be nonnegative.");
		}
	}
})


module.exports = router;
