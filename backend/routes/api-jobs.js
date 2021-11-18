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
    let jobscheduledtime = parseInt(req.body.scheduledTime);
    let jobhubid = parseInt(req.body.hubId);
    let jobcode = null;
    if (req.body.code) {
        jobcode = parseInt(req.body.code);
    }
    let joblocation = null;
    if (req.body.carLocation) {
        joblocation = [parseFloat(req.body.carLocation[0]),parseFloat(req.body.carLocation[1])];
    }
    let jobadvancestate = [parseInt(req.body.advanceState[0]),parseInt(req.body.advanceState[1])];
    
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
                        new_entry.carLocation = joblocation;
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

    else {
        // State 2
        if (jobstatus==2) {
            GrandValet.Database.read_job(jobid).then((job) => {
                let new_entry = {};
                new_entry.jobId = jobid;
                new_entry.type = job.type;
                new_entry.status = job.status;
                new_entry.scheduledTime = job.scheduledTime;
                new_entry.licenceState = job.licenceState; 
                new_entry.licenceNum = job.licenceNum; 
                new_entry.hubId = job.hubId; 
                new_entry.code = job.code;
                new_entry.carLocation = job.carLocation;
                new_entry.note = job.note;
                new_entry.driverUsername = job.driverUsername;
                new_entry.customerUsername = job.customerUsername;
                new_entry.advanceState = job.advanceState;
                if (jobadvancestate[0] == 1 || new_entry.advanceState[0] == 1) {
                    new_entry.advanceState[0] = 1;
                }
                if (jobadvancestate[1] == 1 || new_entry.advanceState[1] == 1) {
                    new_entry.advanceState[1] = 1;
                }
                if (new_entry.advanceState[0] == 1 && new_entry.advanceState[1] == 1) {
                    new_entry.status == new_entry.status + 1;
                }
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
        }
        // State 3
        else if (jobstatus==3) {
            let new_entry = {};
            new_entry.jobId = jobid;
            new_entry.type = jobtype;
            new_entry.status = jobstatus;
            new_entry.scheduledTime = jobscheduledtime;
            new_entry.licenceState = req.body.licenceState; 
            new_entry.licenceNum = req.body.licenceNum; 
            new_entry.hubId = jobhubid; 
            new_entry.code = jobcode;
            new_entry.carLocation = joblocation;
            new_entry.note = req.body.note;
            new_entry.driverUsername = req.body.driverUsername;
            new_entry.customerUsername = req.body.customerUsername;
            new_entry.advanceState = jobadvancestate;
            if (jobadvancestate[0] != 1 || jobadvancestate[1] != 1) {
                res.status(400);
                res.send("Wrong advance state");
                return;
            }
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
        }
        //State 4, assumption: note can't be empty
        else if (jobstatus==4) {
            let new_entry = {};
            new_entry.jobId = jobid;
            new_entry.type = jobtype;
            new_entry.status = jobstatus;
            new_entry.scheduledTime = jobscheduledtime;
            new_entry.licenceState = req.body.licenceState; 
            new_entry.licenceNum = req.body.licenceNum; 
            new_entry.hubId = jobhubid; 
            new_entry.code = jobcode;
            new_entry.carLocation = joblocation;
            new_entry.note = req.body.note;
            new_entry.driverUsername = req.body.driverUsername;
            new_entry.customerUsername = req.body.customerUsername;
            new_entry.advanceState = jobadvancestate;
            if (!joblocation || !req.body.note) {
                res.status(400);
                res.send("Missing car location or note");
                return;
            }
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
        }
        //State 5
        else if (jobstatus==5) {
            let new_entry = {};
            new_entry.jobId = jobid;
            new_entry.type = jobtype;
            new_entry.status = jobstatus;
            new_entry.scheduledTime = jobscheduledtime;
            new_entry.licenceState = req.body.licenceState; 
            new_entry.licenceNum = req.body.licenceNum; 
            new_entry.hubId = jobhubid; 
            new_entry.code = jobcode;
            new_entry.carLocation = joblocation;
            new_entry.note = req.body.note;
            new_entry.driverUsername = req.body.driverUsername;
            new_entry.customerUsername = req.body.customerUsername;
            new_entry.advanceState = jobadvancestate;
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
        }
        //State 6
        else if (jobstatus==6) {
            let new_entry = {};
            new_entry.jobId = jobid;
            new_entry.type = jobtype;
            new_entry.status = jobstatus;
            new_entry.scheduledTime = jobscheduledtime;
            new_entry.licenceState = req.body.licenceState; 
            new_entry.licenceNum = req.body.licenceNum; 
            new_entry.hubId = jobhubid; 
            new_entry.code = jobcode;
            new_entry.carLocation = null;
            new_entry.note = null;
            new_entry.driverUsername = null;
            new_entry.customerUsername = req.body.customerUsername;
            new_entry.advanceState = [0,0];
            if (jobtype != 2) {
                res.status(400);
                res.send("Not a pickup");
                return;
            }
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
        }
        
        //State 7
        else if (jobstatus==7) { /*
            GrandValet.Database.read_job(jobid).then((job) => {
                let new_entry = {};
                new_entry.jobId = jobid;
                new_entry.type = job.type;
                new_entry.status = job.status;
                new_entry.scheduledTime = job.scheduledTime;
                new_entry.licenceState = job.licenceState; 
                new_entry.licenceNum = job.licenceNum; 
                new_entry.hubId = job.hubId; 
                new_entry.code = job.code;
                new_entry.carLocation = job.carLocation;
                new_entry.note = job.note;
                new_entry.driverUsername = job.driverUsername;
                new_entry.customerUsername = job.customerUsername;
                new_entry.advanceState = job.advanceState;
                if (jobadvancestate[0] == 1 || new_entry.advanceState[0] == 1) {
                    new_entry.advanceState[0] = 1;
                }
                if (jobadvancestate[1] == 1 || new_entry.advanceState[1] == 1) {
                    new_entry.advanceState[1] = 1;
                }
                if (new_entry.advanceState[0] == 1 && new_entry.advanceState[1] == 1) {
                    new_entry.status == new_entry.status + 1;
                }
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
            */
            res.status(304);
            res.json(req.body);
            return;
        }
        
        //State 8, assumption: note can't be empty
        else if (jobstatus==8) {
            let new_entry = {};
            new_entry.jobId = jobid;
            new_entry.type = jobtype;
            new_entry.status = jobstatus;
            new_entry.scheduledTime = jobscheduledtime;
            new_entry.licenceState = req.body.licenceState; 
            new_entry.licenceNum = req.body.licenceNum; 
            new_entry.hubId = jobhubid; 
            new_entry.code = jobcode;
            new_entry.carLocation = joblocation;
            new_entry.note = req.body.note;
            new_entry.driverUsername = req.body.driverUsername;
            new_entry.customerUsername = req.body.customerUsername;
            new_entry.advanceState = jobadvancestate;
            if (!joblocation || !req.body.note) {
                res.status(400);
                res.send("Missing car location or note");
                return;
            }
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
        }
        //State 9
        else if (jobstatus==9) {
            GrandValet.Database.read_job(jobid).then((job) => {
                let new_entry = {};
                new_entry.jobId = jobid;
                new_entry.type = job.type;
                new_entry.status = jobstatus;
                new_entry.scheduledTime = job.scheduledTime;
                new_entry.licenceState = job.licenceState; 
                new_entry.licenceNum = job.licenceNum; 
                new_entry.hubId = job.hubId; 
                new_entry.code = job.code;
                new_entry.carLocation = job.carLocation;
                new_entry.note = job.note;
                new_entry.driverUsername = job.driverUsername;
                new_entry.customerUsername = job.customerUsername;
                new_entry.advanceState = job.advanceState;
                if (jobadvancestate[0] == 1 || new_entry.advanceState[0] == 1) {
                    new_entry.advanceState[0] = 1;
                }
                if (jobadvancestate[1] == 1 || new_entry.advanceState[1] == 1) {
                    new_entry.advanceState[1] = 1;
                }
                if (new_entry.advanceState[0] == 1 && new_entry.advanceState[1] == 1) {
                    new_entry.status == 13;
                }
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
        }
        //State 10 deprecated
        //State 11 handled by the other logic
        //State 12 and 13 will just store without check
        //State 5
        else if (jobstatus==12 || jobstatus==13) {
            let new_entry = {};
            new_entry.jobId = jobid;
            new_entry.type = jobtype;
            new_entry.status = jobstatus;
            new_entry.scheduledTime = jobscheduledtime;
            new_entry.licenceState = req.body.licenceState; 
            new_entry.licenceNum = req.body.licenceNum; 
            new_entry.hubId = jobhubid; 
            new_entry.code = jobcode;
            new_entry.carLocation = joblocation;
            new_entry.note = req.body.note;
            new_entry.driverUsername = req.body.driverUsername;
            new_entry.customerUsername = req.body.customerUsername;
            new_entry.advanceState = jobadvancestate;
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
        }
    }
    
});

module.exports = router;