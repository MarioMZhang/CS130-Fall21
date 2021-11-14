var express = require('express');
const server=express();
const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded());
var createError = require('http-errors');
var router = express.Router();
var http = require('http');
var MongoClient = require('mongodb').MongoClient;
let dbv2 = require('../db-v2');
const url="mongodb://localhost:27017";
/* GET home page. */
router.get('/',function(req, res, next) {
    var username = req.query.username;
    var jobid = req.query.jobid;
    if(username!=""){
        dbv2.Database.read_assignedJobs(username).then((result)=>{
        if(result!=""){
            res.json(result);
        }else{
            next(createError(404));
            }
        });
    }
    if(jobid!=""){
       dbv2.Database.read_job(jobid).then((result)=>{
        if(result!=""){
            res.json(result);
        }else{
            next(createError(404));
          }
       });
    }
    
});

router.post('/',function(req, res) {
    console.log(req.body);
    console.log(req.body.jobid>0);
    dbv2.Database.store_job(req.body).then((result)=>{
       if(result!=""){
           res.json(result);
       }else{
           next(createError(404));
       }
    });
    
});
module.exports = router;