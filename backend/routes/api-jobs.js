var express = require('express');
var router = express.Router();

let GrandValet = require('../db-v2');


/* Jobs api. */
/* GET api. */
router.get('/jobs',function(req, res, next) {
    var username = req.query.username;
    var jobid = req.query.jobid;
    if(username == null && jobid == null) {
        res.status(404);
        res.send("Must specify username or jobid");
    }
    if(username != null && jobid != null) {
        res.status(404);
        res.send("Cannot specify both username and jobid");
    }

    if(jobid != null){
        jobid = parseInt(jobid);
        GrandValet.Database.read_job(jobid).then((result)=>{
        if(result != null){
            res.status(200);
            res.json(result);
        }
        else{
            res.status(404);
            res.send("Job not found for jobid " + jobid);
        }
        });
    }

    if(username != null){
        GrandValet.Database.read_assignedJobs(username).then((result)=>{
        if(result != null){
            res.json(result);
        }
        else{
            res.status(404);
            res.send("Job not found for driver " + username);
        }
    });
  } 
});


/* POST api. */
router.post('/jobs',function(req, res, next) {
    // input checks 
    console.log(req.body);


    if(req.body.jobId == null || req.body.type == null || req.body.status == null ) {
        res.status(400);
        res.send("Bad request format");
        return;
    }    

    let jobid = parseInt(req.body.jobId);
    let jobtype = parseInt(req.body.type);
    let jobstatus = parseInt(req.body.status);
    
    if(jobtype < 1 || jobtype > 3 || jobstatus < 0 || jobstatus > 14) {
        res.status(400);
        res.send("Bad request format: jobtype/jobstatus");
        return;
    }

    // For creating new jobs
    if(jobid == 0) {
        // TODO: for each customer/driver, maybe we need to set all previous 
        // jobs to the finished state when we are inserting a new job.

        // car dropoff
        if(jobtype == 1) {
            if(req.body.scheduledTime == null || req.body.licenceState == null 
                 || req.body.licenceNum == null || req.body.hubId == null 
                 || req.body.customerUsername == null) {
                res.status(400);
                res.send("Bad request format");
                return;
            }
            if(jobstatus != 0 && jobstatus != 1) {
                res.status(400);
                res.send("jobstatus must be 0 or 1 for jobid=0 and jobtype=1");
                return;
            }

            let jobScheduledTime = parseInt(req.body.scheduledTime);
            let jobHubId = parseInt(req.body.hubId);

            // check that user exists
            GrandValet.Database.read_user(req.body.customerUsername).then((user) => {
                if(user == null) {
                        res.status(400);
                        res.send("user does not exist");
                        return;
                }

                // check that hub exists
                GrandValet.Database.read_hub(jobHubId).then((hub) => {
                    if(hub == null) {
                        res.status(400);
                        res.send("hub does not exist");
                        return;
                    }
                    let time = Math.floor(Date.now() / 1000);
                    if(time >= hub.endTime) {
                        res.status(400);
                        res.send("hub closed");
                        return;
                    }

                    GrandValet.Database.read_maxMaxJobId().then((maxJobId) => {
                        let new_entry = {};
                        new_entry.jobId = maxJobId + 1;
                        new_entry.type = jobtype;
                        new_entry.status = 1;
                        new_entry.scheduledTime = jobScheduledTime;
                        new_entry.licenceState = req.body.licenceState;
                        new_entry.licenceNum = req.body.licenceNum;
                        new_entry.hubId = jobHubId;
                        new_entry.code = null;
                        new_entry.carLocation = null;
                        new_entry.note = null;
                        new_entry.driverUsername = null;
                        new_entry.customerUsername = req.body.customerUsername;
                        new_entry.advanceState = [0, 0];

                        GrandValet.Database.store_job(new_entry).then(() => {
                            // get again and return
                            GrandValet.Database.read_job(new_entry.jobId).then((result)=>{
                                if(result == null) {
                                    res.status(400);
                                    res.send("failed to create job");
                                    return;
                                }
                                else {
                                    res.status(201);
                                    res.set('Content-Type', 'application/json');
                                    res.json(result);
                                    return;
                                }
                            })
                        })
                    })
                })
            })
        }

        // car pickup
        else if(jobtype == 2) {
            if(req.body.scheduledTime == null || req.body.licenceState == null 
                 || req.body.licenceNum == null || req.body.hubId == null 
                 || req.body.customerUsername == null) {
                res.status(400);
                res.send("Bad request format");
                return;
            }
            if(jobstatus != 0 && jobstatus != 6) {
                res.status(400);
                res.send("jobstatus must be 0 or 6 for jobid=0 and jobtype=2");
                return;
            }

            let jobScheduledTime = parseInt(req.body.scheduledTime);
            let jobHubId = parseInt(req.body.hubId);

            // check that user exists
            GrandValet.Database.read_user(req.body.customerUsername).then((user) => {
                if(user == null) {
                        res.status(400);
                        res.send("user does not exist");
                        return;
                }
                // check that hub exists
                GrandValet.Database.read_hub(jobHubId).then((hub) => {
                    if(hub == null) {
                        res.status(400);
                        res.send("hub does not exist");
                        return;
                    }
                    // TODO: maybe enforce the field "carLocation" and "note"

                    // We allow creating pickup job after job closing time
                    // let time = Math.floor(Date.now() / 1000);
                    // if(time >= hub.endTime) {
                    //     res.status(400);
                    //     res.send("hub closed");
                    //     return;
                    // }

                    GrandValet.Database.read_maxMaxJobId().then((maxJobId) => {
                        let new_entry = {};
                        new_entry.jobId = maxJobId + 1;
                        new_entry.type = jobtype;
                        new_entry.status = 6;
                        new_entry.scheduledTime = jobScheduledTime;
                        new_entry.licenceState = req.body.licenceState;
                        new_entry.licenceNum = req.body.licenceNum;
                        new_entry.hubId = jobHubId;
                        new_entry.code = null;
                        new_entry.carLocation = req.body.carLocation;
                        new_entry.note = req.body.note;
                        new_entry.driverUsername = null;
                        new_entry.customerUsername = req.body.customerUsername;
                        new_entry.advanceState = [0, 0];

                        GrandValet.Database.store_job(new_entry).then(() => {
                            // get again and return
                            GrandValet.Database.read_job(new_entry.jobId).then((result)=>{
                                if(result == null) {
                                    res.status(400);
                                    res.send("failed to create job");
                                    return;
                                }
                                else {
                                    res.status(201);
                                    res.set('Content-Type', 'application/json');
                                    res.json(result);
                                    return;
                                }
                            })
                        })
                    })
                })
            })
        }

        // driver - break
        else {
            if(req.body.scheduledTime == null || req.body.driverUsername == null) {
                res.status(400);
                res.send("Bad request format");
                return;
            }
            if(jobstatus != 0 && jobstatus != 11) {
                res.status(400);
                res.send("jobstatus must be 0 or 11 for jobid=0 and jobtype=3");
                return;
            }

            let jobScheduledTime = parseInt(req.body.scheduledTime);
            let time = Math.floor(Date.now() / 1000);
            if(jobScheduledTime <= time) {
                res.status(400);
                res.send("schedule break time is in the past");
                return;
            }

            // check that user exists
            GrandValet.Database.read_user(req.body.driverUsername).then((user) => {
                if(user == null) {
                        res.status(400);
                        res.send("user does not exist");
                        return;
                }

                GrandValet.Database.read_maxMaxJobId().then((maxJobId) => {
                    let new_entry = {};
                    new_entry.jobId = maxJobId + 1;
                    new_entry.type = jobtype;
                    new_entry.status = 11;
                    new_entry.scheduledTime = jobScheduledTime;
                    new_entry.licenceState = null; 
                    new_entry.licenceNum = null; 
                    new_entry.hubId = null; 
                    new_entry.code = null;
                    new_entry.carLocation = null;
                    new_entry.note = null;
                    new_entry.driverUsername = req.body.driverUsername;
                    new_entry.customerUsername = null;
                    new_entry.advanceState = [0, 0];

                    GrandValet.Database.store_job(new_entry).then(() => {
                        // get again and return
                        GrandValet.Database.read_job(new_entry.jobId).then((result)=>{
                            if(result == null) {
                                res.status(400);
                                res.send("failed to create job");
                                return;
                            }
                            else {
                                res.status(201);
                                res.set('Content-Type', 'application/json');
                                res.json(result);
                                return;
                            }
                        })
                    })
                })
            })
        }

    } 

    // TODO: updating existing jobs
    else {
        res.status(200);
        res.send("To be implemented: updating existing jobs")

    }
    
});

module.exports = router;