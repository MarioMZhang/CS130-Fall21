var express = require('express');
var router = express.Router();

var JobsModel = require('../db/models/JobsModel');
var db = require('../db/db');

//*jobs api*/
router.get('/', function (req, res, next) {
    let model = {
        jobid: req.query.jobid,
        username: req.query.username
    }
    console.log('model', model);
    console.log('model.jobid && model.jobid !== \'\'', (model.jobid && model.jobid !== ''));
    if (model.jobid && model.jobid !== '') {
        console.log("Job Generating!", model.jobid)
        JobsModel.JobsModel.find({jobid: model.jobid})
            .exec(function (err, docs) {
                if (err) {
                    var returninfo = "";
                    var i = 1;
                    for (key in err.errors) {
                        console.log(err.errors[key].message);
                        returninfo += i + '.' + err.errors[key].message + '\n';
                        ++i;
                    }
                    res.json({errors: returninfo});
                } else {
                    if (docs.length == 0) {
                        res.status(404);
                        res.send("No post is found for given username and postid.")
                    } else {
                        res.status(200);
                        res.json(docs);
                    }
                }
            });
    } else if (model.username && model.username !== '') {
        JobsModel.JobsModel.find({username: model.username})
            .exec(function (err, docs) {
                if (err) {
                    var returninfo = "";
                    var i = 1;
                    for (key in err.errors) {
                        console.log(err.errors[key].message);
                        returninfo += i + '.' + err.errors[key].message + '\n';
                        ++i;
                    }
                    res.json({errors: returninfo});
                } else {
                    if (docs.length == 0) {
                        res.status(404);
                        res.send("No post is found for given username and postid.")
                    } else {
                        res.status(200);
                        res.json(docs);
                    }
                }
            });
    } else {
        JobsModel.JobsModel.find({})
            .exec(function (err, docs) {
                if (err) {
                    var returninfo = "";
                    var i = 1;
                    for (key in err.errors) {
                        console.log(err.errors[key].message);
                        returninfo += i + '.' + err.errors[key].message + '\n';
                        ++i;
                    }
                    res.json({errors: returninfo});
                } else {
                    if (docs.length == 0) {
                        res.status(404);
                        res.send("No post is found for given username and postid.")
                    } else {
                        res.status(200);
                        res.json(docs);
                    }
                }
            });
    }
});

/*delete*/
router.delete('/', function (req, res, next) {
    console.log('req.query.jobid', req.query.jobid);
    JobsModel.JobsModel.deleteOne({jobid: req.query.jobid}, function (err, docs) {
        if (err) {
            //throw new Error("save exception!");
            var returninfo = "";
            var i = 1;
            for (key in err.errors) {
                console.log(err.errors[key].message);
                returninfo += i + '.' + err.errors[key].message + '\n';
                ++i;
            }
            res.json({errors: returninfo});
            //console.log(err.stack());
        } else {
            if (docs.length == 0) {
                res.status(404);
                res.send("No post is found for given username and postid.")
            } else {
                res.status(200);
                res.json({"code": "delete success"});
            }

        }
    });
})

// add update
router.post('/', function (req, res, next) {
    let model = {
        jobid: req.body.jobid,
        jobtype: req.body.jobtype,
        status: req.body.status,
        scheduledTime: req.body.scheduledTime,
        licenceState: req.body.licenceState,
        licenceNum: req.body.licenceNum,
        slot: req.body.slot,
        note: req.body.note,
        driverid: req.body.driverid,
        customerid: req.body.customerid,
        carInfo: req.body.carInfo,
        hub: req.body.hub,
        advanceState: req.body.advanceState,
        username: req.body.username
    }
    console.log("jobs", model)
    JobsModel.JobsModel.count({jobid: req.body.jobid}, function (err, count) {
        console.log('count1111 : ' + count);
        if (count > 0) {
            JobsModel.JobsModel.update(model, function (err, docs) {
                if (err) {

                    //throw new Error("save exception!");
                    var returninfo = "";
                    var i = 1;
                    for (key in err.errors) {
                        console.log(err.errors[key].message);
                        returninfo += i + '.' + err.errors[key].message + '\n';
                        ++i;
                    }
                    res.json({errors: returninfo});
                    //console.log(err.stack());
                } else {

                    JobsModel.JobsModel.find(model).exec(function (err, docs) {
                        if (err) {
                            var returninfo = "";
                            var i = 1;
                            for (key in err.errors) {
                                console.log(err.errors[key].message);
                                returninfo += i + '.' + err.errors[key].message + '\n';
                                ++i;
                            }
                            res.json({errors: returninfo});
                        } else {
                            if (docs.length == 0) {
                                res.status(404);
                                res.send("No post is found for given username and postid.")
                            } else {
                                res.status(200);
                                res.json(docs);
                            }
                        }
                    });
                }
            })

        } else {
            JobsModel.JobsModel.create(model, function (err, docs) {
                if (err) {

                    //throw new Error("save exception!");
                    var returninfo = "";
                    var i = 1;
                    for (key in err.errors) {
                        console.log(err.errors[key].message);
                        returninfo += i + '.' + err.errors[key].message + '\n';
                        ++i;
                    }
                    res.json({errors: returninfo});
                    //console.log(err.stack());
                } else {
                    res.status(200);
                    res.json({"code": "insert success"});
                }
            });
        }
    });


});
module.exports = router;
