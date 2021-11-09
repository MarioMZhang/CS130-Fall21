var express = require('express');
var router = express.Router();
let grandValet = require('../db');
let newTime = Math.floor(Date.now() / 1000) + 1000;
let ecFile = {"type": 1, "username": 'ecartman', "name": 'Eric Cartman', "password": '$2a$10$2DGJ96C77f/WwIwClPwSNuQRqjoSnDFj9GDKjg6X/PePgFdXoE4W6', "email": 'ecartman@spelementary.edu', "phone": "7190000002", "driverStatus": 0};
let nearby = { "hubId": 2, "description": "South entry of Bruin Plaza", "location": [-118.4453, 34.0690], "startTime": 1636095480, "endTime": 1736095091}
let newJob = {"type": 1, "jobId": 2, "scheduledTime": 1635313500, "status": 2, "licenceState": "CO", "licenceNum": "CABD12", "hubId": 1, "code": 132561, "carLocation": null, "note": null, "driverUsername": 'kyle_brof_driver', "customerUsername": "ecartman", "advanceState": [0, 0]}
let unassignedJob = {"type": 1, "jobId": 3, "scheduledTime": 1635313500, "status": 2, "licenceState": "CO", "licenceNum": "CABD12", "hubId": 1, "code": 132561, "carLocation": null, "note": null, "driverUsername": null, "customerUsername": "ecartman", "advanceState": [0, 0]}
let kmFile = {"type": 2, "username": 'princess_kenny', "name": 'Kenny McCormick', "password": '$2a$10$2DGJ96C77f/WwIwClPwSNuQRqjoSnDFj9GDKjg6X/PePgFdXoE4W6', "email": 'kenny@spelementary.edu', "phone": "7190000003", "driverStatus": 1};
let jobToAssign = {"type": 1, "jobId": 4, "scheduledTime": 1635313500, "status": 1, "licenceState": "CO", "licenceNum": "CABD12", "hubId": 1, "code": 132561, "carLocation": null, "note": null, "driverUsername": null, "customerUsername": "ecartman", "advanceState": [0, 0]}

/* Hubs api. */
/* GET api. */
router.get('/post1', function(req, res, next) {
	res.status(200);
    //let gv = grandValet.Database.db('GrandValet');
    grandValet.Database.store_user(ecFile);
	res.send("GET /api/hubs placeholder");
})

router.get('/get1', function(req, res, next) {
	res.status(200);
    grandValet.Database.read_user('ecartman')
    .then((fileFromDB) => {
        console.log(fileFromDB);
        if (fileFromDB.username==ecFile.username && fileFromDB.name==ecFile.name && fileFromDB.password==ecFile.password && fileFromDB.email==ecFile.email && fileFromDB.phone==ecFile.phone && fileFromDB.driverStatus==ecFile.driverStatus ) {
            res.send("You got it");
        }
        else {
            res.send(fileFromDB);
        }
    })
})

router.get('/get2', function(req, res, next) {
	res.status(200);
    grandValet.Database.read_activeHubs()
    .then((fileFromDB) => {
        res.send(fileFromDB);
    })
})

router.get('/get3', function(req, res, next) {
	res.status(200);
    grandValet.Database.read_nearbyHubs([-118.4452, 34.0689], 0.5)
    .then((fileFromDB) => {
        res.send(fileFromDB);
    })
})

router.get('/get4', function(req, res, next) {
	res.status(200);
    grandValet.Database.read_hub(1)
    .then((fileFromDB) => {
        res.send(fileFromDB);
    })
})

router.get('/post3', function(req, res, next) {
	res.status(200);
    //let gv = grandValet.Database.db('GrandValet');
    grandValet.Database.store_job(newJob);
	res.send("GET /api/hubs placeholder");
})

router.get('/get5', function(req, res, next) {
	res.status(200);
    grandValet.Database.read_job(2)
    .then((fileFromDB) => {
        res.send(fileFromDB);
    })
})

router.get('/get6', function(req, res, next) {
	res.status(200);
    grandValet.Database.read_assignedJobs("kyle_brof_driver")
    .then((fileFromDB) => {
        res.send(fileFromDB);
    })
})

router.get('/testGetJob', function(req, res, next) {
	res.status(200);
    grandValet.Database.store_user(kmFile)
    .then(() => {
        //console.log('user ok')
        grandValet.Database.store_job(unassignedJob)
        .then(() => {
            //console.log('job ok')
            grandValet.Database.read_job(3)
            .then((job) => {
                res.send(job);
            })
        })
    })
})

router.get('/assignJob', function(req, res, next) {
	res.status(200);
    grandValet.Database.store_user(kmFile)
    .then(() => {
        //console.log('user ok')
        grandValet.Database.store_job(jobToAssign)
        .then(() => {
            //console.log('job ok')
            grandValet.Database.read_job(4)
            .then((job) => {
                res.send(job);
            })
        })
    })
})

router.get('/assignJobLater', function(req, res, next) {
	res.status(200);
    grandValet.Database.read_job(4)
    .then((job) => {
        res.send(job);
    })

})

module.exports = router;
