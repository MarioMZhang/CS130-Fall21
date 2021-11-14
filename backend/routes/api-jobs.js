var express = require('express');
var router = express.Router();
// const server=express();
// const bodyParser = require('body-parser');
// server.use(bodyParser.urlencoded());
var createError = require('http-errors');


let dbv2 = require('../db-v2');

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
        dbv2.Database.read_job(jobid).then((result)=>{
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
        dbv2.Database.read_assignedJobs(username).then((result)=>{
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
    console.log(req.body);
    // console.log(req.body.jobid>0);
    // dbv2.Database.store_job(req.body).then((result)=>{
    //    if(result!=""){
    //        res.status(201);
    //        res.json(result);
    //    }else{
    //        next(createError(404));
    //    }
    // });
    res.status(201);
    res.send("Job created");
    
});

module.exports = router;