var express = require('express');
var router = express.Router();

let client = require('../db');


/* Hubs api. */
/* GET api. */
router.get('/hubs', function(req, res, next) {
	// TODO: maybe add some other fields
	let hubid = req.query.hubid;

	// if hubid is null, return all the hubs 
	if(hubid == null) {
		let ret_hubs = [];

		// Retrieve all hubs
		let hubs = client.db('GrandValet').collection('Hubs');
		hubs.find().toArray(
			(err, hub_infos) => {
				for (let i = 0; i < hub_infos.length; i++) {
					new_hub = {};
					new_hub.hubId = hub_infos[i].hubId;
					new_hub.description = hub_infos[i].description;
					new_hub.location = hub_infos[i].location;
					new_hub.startTime = hub_infos[i].startTime;
					new_hub.endTime = hub_infos[i].endTime;
					ret_hubs.push(new_hub);
				}
				// output as json 
				res.status(200);
				res.append('Content-Type', 'application/json');
				res.json(ret_hubs);
			}
		)
	}

	// if hubid is not null, only return the hub corresponding to that id
	else {
		let hubs = client.db('GrandValet').collection('Hubs');
		hubs.findOne({hubId: parseInt(hubid)}).then(
			(hub_info) => {
				if(hub_info != null) {
					new_hub = {};
					new_hub.hubId = hub_info.hubId;
					new_hub.description = hub_info.description;
					new_hub.location = hub_info.location;
					new_hub.startTime = hub_info.startTime;
					new_hub.endTime = hub_info.endTime;
					// output as json 
					res.status(200);
					res.append('Content-Type', 'application/json');
					res.json(new_hub);
				}
				else {
					res.status(404);
					res.send("Cannot find the requested hub.");
				}

			}
		)
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
		let hubs = client.db('GrandValet').collection('Hubs');
		let meta = client.db('GrandValet').collection('Meta');	
		// new hub 
		if (hubid == 0) {
			// get max postid, then update both databases
			meta.findOne().then(
				(metadata) => {
					let new_entry = {};
					new_entry.hubid = metadata.maxHubId + 1;
					new_entry.description = req.body.description;
					new_entry.startTime = req.body.startTime;
					new_entry.endTime = req.body.endTime;
					new_entry.location = null;
					if(req.body.location != null) {
						new_entry.location = req.body.location;
					}
					hubs.insertOne(new_entry).then(
						(result) => {
							meta.updateOne({ $set: {maxHubId: new_entry.hubid} }).then(
								(result) => {
									res.status(201);
									res.append('Content-Type', 'application/json');
									res.json(new_entry);
								}	
							)
						}
					) 
					
				}
			)
		}
		// update existing hub
		else if (hubid > 0){
			// first check if hub exists
			hubs.findOne({hubId: hubid}).then(
				(hub) => {
					if (hub == null) {
						res.status(404);
						res.send("Bad request: cannot find specified hub.");
					}
					else {
						hubs.updateOne({hubId: hubid}, { $set: {description: req.body.description, startTime: req.body.startTime, endTime: req.body.endTime, location: req.body.location}}).then(
							(result) => {
								res.status(200);
								res.append('Content-Type', 'application/json');
								res.json({hubId: hubid, description: req.body.description, startTime: req.body.startTime, endTime: req.body.endTime, location: req.body.location});
							}
						)
					}
				}
			)
		}
		else {
			res.status(400);
			res.send("Bad request format: hubid must be nonnegative.");
		}
	}
})


module.exports = router;
