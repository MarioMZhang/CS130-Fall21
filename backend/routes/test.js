var express = require('express');
var router = express.Router();
let grandValet = require('../db-v2');
let newTime = Math.floor(Date.now() / 1000) + 1000;
let ecFile = {"type": 1, "username": 'ecartman', "name": 'Eric Cartman', "password": '$2a$10$2DGJ96C77f/WwIwClPwSNuQRqjoSnDFj9GDKjg6X/PePgFdXoE4W6', "email": 'ecartman@spelementary.edu', "phone": "7190000002", "driverStatus": 0};
let nearby = { "hubId": 2, "description": "South entry of Bruin Plaza", "location": [-118.4453, 34.0690], "startTime": 1636095480, "endTime": 1736095091}
let newJob = {"type": 1, "jobId": 2, "scheduledTime": 1635313500, "status": 2, "licenceState": "CO", "licenceNum": "CABD12", "hubId": 1, "code": 132561, "carLocation": null, "note": null, "driverUsername": 'kyle_brof_driver', "customerUsername": "ecartman", "advanceState": [0, 0]}
let unassignedJob = {"type": 1, "jobId": 3, "scheduledTime": 1635313500, "status": 2, "licenceState": "CO", "licenceNum": "CABD12", "hubId": 1, "code": 132561, "carLocation": null, "note": null, "driverUsername": null, "customerUsername": "ecartman", "advanceState": [0, 0]}
let kmFile = {"type": 2, "username": 'princess_kenny', "name": 'Kenny McCormick', "password": '$2a$10$2DGJ96C77f/WwIwClPwSNuQRqjoSnDFj9GDKjg6X/PePgFdXoE4W6', "email": 'kenny@spelementary.edu', "phone": "7190000003", "driverStatus": 1};
let jobToAssign = {"type": 1, "jobId": 4, "scheduledTime": 1635313500, "status": 1, "licenceState": "CO", "licenceNum": "CABD12", "hubId": 1, "code": 132561, "carLocation": null, "note": null, "driverUsername": null, "customerUsername": "ecartman", "advanceState": [0, 0]}


let activhub3 = { "hubId": 3, "description": "Archaida", "location": [-123.23, 56.0690], "startTime": 1636095480, "endTime": 1736095091}

let nonactivhub3 = { "hubId": 4, "description": "Archaida", "location": [-123.23, 56.0690], "startTime": 1036095480, "endTime": 1136095091}
let newJob2 = {"type": 1, "jobId": 4, "scheduledTime": 1735313500, "status": 2, "licenceState": "CA", "licenceNum": "XXXX", "hubId": 1, "code": 555332, "carLocation": null, "note": null, "driverUsername": 'truck_driver', "customerUsername": "Justin", "advanceState": [0, 0]}

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
        // console.log(fileFromDB);
        if (fileFromDB.username==ecFile.username && fileFromDB.name==ecFile.name && fileFromDB.password==ecFile.password && fileFromDB.email==ecFile.email && fileFromDB.phone==ecFile.phone && fileFromDB.driverStatus==ecFile.driverStatus ) {
            res.send("You got it");
        }
        else {
            res.send(fileFromDB);
        }
    })
})


//Store nearby hubs in Hubs DB
router.get('/post2', function(req,res,next){
    res.status(200);
    grandValet.Database.store_hub(nearby);
    grandValet.Database.store_hub(activhub3);
    grandValet.Database.store_hub(nonactivhub3);
    res.send("GET /api/hubs placeholder");
} )

//Test nearby_hub
router.get('/get3', function(req, res, next) {
	res.status(200);
    grandValet.Database.read_nearbyHubs([-118.4452, 34.0689], 0.5)
    .then((fileFromDB) => {
        if (fileFromDB[0].hubId === nearby.hubId)
        {
            res.send("Nearby test with latitude and longitude passed.")
        }
        else{
            res.send(fileFromDB)
        }
    })
})


router.get('/get2', function(req, res, next) {
	res.status(200);
    grandValet.Database.read_activeHubs()
    .then((fileFromDB) => {
        if (fileFromDB[0].hubId === nearby.hubId && fileFromDB[1].hubId === activhub3.hubId)
        {
            res.send(`Read active hubs. Test passed.`)
        }
        else{
            res.send(fileFromDB)
        }
        
    })
})


router.get('/get4', function(req, res, next) {
	res.status(200);
    grandValet.Database.read_hub(2)
    .then((fileFromDB) => {
        if (fileFromDB.hubId === nearby.hubId)
        {
            res.send(`Got hubId ${2} Test passed.`)
        }
        else{
            res.send(fileFromDB)
        }
    })
})

router.get('/post3', function(req, res, next) {
	res.status(200);
    //let gv = grandValet.Database.db('GrandValet');
    grandValet.Database.store_job(newJob);
    grandValet.Database.store_job(newJob2);
	res.send("GET /api/hubs placeholder");
})

router.get('/get5', function(req, res, next) {
	res.status(200);
    grandValet.Database.read_job(4)
    .then((fileFromDB) => {
        if (fileFromDB.jobId === newJob2.jobId)
        {
            res.send(`Got jobID ${4}. Test passed.`)
        }
        else{
            res.send(fileFromDB)
        }
    })
})

router.get('/get6', function(req, res, next) {
	res.status(200);
  
    grandValet.Database.read_assignedJobs("truck_driver")
    .then((fileFromDB) => {
        if (fileFromDB[0].driverUsername === newJob2.driverUsername)
        {
            res.send(`Read Assigned Job. Test passed.`)
        }
        else{
            res.send(fileFromDB)
        }
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
