var express = require('express');
const server=express();
const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded());
var createError = require('http-errors');
var router = express.Router();
var http = require('http');
var MongoClient = require('mongodb').MongoClient;

const url="mongodb://localhost:27017";
/* GET home page. */
router.get('/',function(req, res, next) {
    var username = req.query.username;
    var jobid = req.query.jobid;
    let query = { "customerUsername": username};
    if(jobid != null){
        let query={"jobid":jobid}
        dbcollection(query,function end(a1){
        if(a1!=""){
            res.send(a1);
            return 0;
        }else{
            res.end("sss");
            return 0;
            next(createError(404));
            } 
        });
    }else{
       dbcollection(query,function end(a1){
        if(a1!=""){
            let query1={ "driverUsername": username};
            dbcollection(query1,function end(a){
                a1.push(a);
                res.send(a1);
                return 0;
            });
        }else{
            res.end("sss");
            return 0;
            next(createError(404));
        } 
    }); 
    }    
});

router.post('/',function(req, res) {
    console.log(req.body);
    console.log(req.body.jobid>0);
    if(req.body.jobid==0){
        MongoClient.connect(url,{ useUnifiedTopology: true }, function(err, db) {
           if (err) throw err;
           var dbo = db.db("GrandValet");
           dbo.collection("Jobs").insertOne(req.body, function(err, res1) {
              if (err) throw err;
              console.log("Insert successful");
              res.send("Insert successful");
              return 0;
              db.close();
              });
            });
    }
    if(req.body.jobid>0){
        MongoClient.connect(url,{ useUnifiedTopology: true }, function(err, db) {
           if (err) throw err;
           var dbo = db.db("GrandValet");
           var whereStr = {"customerUsername": req.body.customerUsername}; 
           var updateStr = {$set: req.body};
           dbo.collection("Jobs").updateOne(whereStr, updateStr, function(err, res1) {
            if (err) throw err;
            console.log("updated successfully");
            res.send("updated successfully");
            return 0;
            db.close();
            });
        });
    }
    
});
function dbcollection(query,callback){
    MongoClient.connect(url,{ useUnifiedTopology: true },(err,db)=>{
    if (err) throw err;
    console.log('connected!');
    const dbo = db.db("GrandValet");
    let query1=query;
    dbo.collection("Jobs").find(query1).toArray(async function(err, result) { 
        if (err) throw err;
        callback(result);
        db.close();
       
    });
  });
}

module.exports = router;