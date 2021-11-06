var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var hubModel = require('JobsModel');
var Jobs = new Schema({
    jobid : {
        type : Number,
        required : [true,'jobs id needed'],
    },
    jobtype : {
        type : String,
    },
    username : {
        type : String,
    },
    status : {
        type : String,
    },
    scheduledTime : {
        type : String,
    },
    licenceState : {
        type : String,
    }
    licenceNum : {
        type : String,
    }
    slot : {
        type : String,
    },
    note : {
        type : String,
    }
    driverid : {
        type : String,
    },
    customerid : {
        type : String,
    },
    carInfo : {
        type : String,
    },
    advanceState : {
        type : String,
    }
    hub: {
        type : Object,
        // required : [true,'jobs name needed'],
    }
},{collection:'jobs'});

var jobsModel = mongoose.model('jobs',Jobs);

exports.JobsSchema = Jobs;
exports.JobsModel = jobsModel;
