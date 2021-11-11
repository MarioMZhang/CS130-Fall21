/* Helper functions for the MongoDB Database. */
/* This can be refactored to OO style for better modularity. */

const MongoClient = require('mongodb').MongoClient;
const options = { useUnifiedTopology: true, writeConcern: { j: true } };

/** Class wrapping database operations. */
class Database {
    client = null;

    // create a connection to url and call callback()
    /**
     * Connect the database
     */
     static connect(callback) {
        let url = 'mongodb://localhost:27017/';
        if (Database.client == null) {
            // create a mongodb client
            Database.client = new MongoClient(url, options);
            // establish a new connection
            Database.client.connect((err) => {
                if (err) {
                    // error occurred during connection
                    Database.client = null;
                    callback(err);
                } else {
                    // all done
                    callback();
                }
            });
        } else {
            // connection was established earlier. just call callback()
            callback();
        }
    }

    /**
     * Database wrapper
     * @param {string} dbName - Name of the database.
     * @returns {database} - Database for MongoDB operations.
     */
     static db(dbName) {
        return Database.client.db(dbName);
    }

    /**
     * Close the connection
     */
     static close() {
        if (Database.client) {
            Database.client.close();
            Database.client = null;
        }
    }

    /**
     * Stores a user
     * @param {User} body - JSON of a user file.
     */
     static store_user(body, next) {
        return Database.db('GrandValet').collection('Users').findOne({username: body.username})
        .then((user) => {
            if (user == null) 
            {
                let newData = {type: body.type, username: body.username, name: body.name, password: body.password, email: body.email, phone: body.phone, driverStatus: body.driverStatus};
                Database.db('GrandValet').collection('Users').insertOne(newData);
                return;
            }
            Database.db('GrandValet').collection('Users').updateOne({username: body.username}, { $set: {type: body.type, name: body.name, password: body.password, email: body.email, phone: body.phone, driverStatus: body.driverStatus}});
        });
    }

    /**
     * Reads a user
     * @param {string} username - Username of the requested user.
     * @returns {User} - JSON of the requested user file.
     */
      static read_user(username, next) {
        return Database.db('GrandValet').collection('Users').findOne({username: username})
        .then((user) => {
            if (user == null) 
            {
                //console.log("bad")
                return null;
            }
            return user;
        });
    }
    
    /**
     * Returns all currently active hubs.
     * @returns {Hub[]} - Array of JSON of currently active hubs.
     */
     static read_activeHubs(next) {
        let time = Math.floor(Date.now() / 1000);
        return Database.db('GrandValet').collection('Hubs').find({$and: [{ startTime : { $lt :  time}}, { endTime : { $gt :  time}}]}).toArray()
        .then((hubs) => {
            if (hubs == null) 
            {
                //console.log("bad")
                throw "Error in database";
            }
            return hubs;
        });
    }

    /**
     * Reads nearby hubs
     * @param {coordinates} loc - Cordinates of the center of the search.
     * @param {number} radius - Radius of the search in miles.
     * @returns {Hub[]} - Array of JSON of hubs satisfying the query.
     */
    // Radius is in miles, longitude first (this is important, as normally latitutde first)
    static read_nearbyHubs(loc, radius, next) {
        let milesToRadian = function(miles){
            let earthRadiusInMiles = 3959;
            return miles / earthRadiusInMiles;
        };
        let query = {
            $and: [
                { location : {
                    $geoWithin : {
                        $centerSphere : [loc, milesToRadian(radius) ]
                    }
                }}, 
                { startTime : { $lt :  time}}, 
                { endTime : { $gt :  time}}
            ]
        };
        return Database.db('GrandValet').collection('Hubs').find(query).toArray()
        .then((hubs) => {
            if (hubs == null) 
            {
                //console.log("bad")
                throw "Error in database";
            }
            return hubs;
        });
    }

    /**
     * Reads a hub
     * @param {number} hubId - ID of the requested hub.
     * @returns {Hub} - JSON of the requested hub.
     */
     static read_hub(hubId, next) {
        return Database.db('GrandValet').collection('Hubs').findOne({hubId: hubId})
        .then((hub) => {
            if (hub == null) 
            {
                //console.log("bad")
                return null;
            }
            return hub;
        });
    }

    /**
     * Stores a hub
     * @param {Hub} body - JSON of a hub file.
     */
     static store_hub(body, next) {
        //console.log(body);
        return Database.db('GrandValet').collection('Hubs').findOne({hubId: body.hubId})
        .then((hub) => {
            if (hub == null) 
            {
                //console.log(body);
                let newData = {hubId: body.hubId, description: body.description, location: body.location, startTime: body.startTime, endTime: body.endTime};
                Database.db('GrandValet').collection('Meta').updateOne({}, { $set: {maxHubId: body.hubId}});
                Database.db('GrandValet').collection('Hubs').insertOne(newData);
                return;
            }
            //console.log(body);
            if (body.location != null) {
                Database.db('GrandValet').collection('Hubs').updateOne({hubId: body.hubId}, { $set: {hubId: body.hubId, description: body.description, location: body.location, startTime: body.startTime, endTime: body.endTime}});
            }
            else {
                Database.db('GrandValet').collection('Hubs').updateOne({hubId: body.hubId}, { $set: {hubId: body.hubId, description: body.description, startTime: body.startTime, endTime: body.endTime}});
            }
        });
    }

    /**
     * Schedule unassigned jobs that are within 1 hr from scheduled time.
     */
     static schedule_jobs(next) {
        let currentTime = new Date().getTime();
        let query1 = {
            $and:[
                {$or: [{ status : 1 }, { status : 6 }]},
                { scheduledTime : { $lt :  (currentTime + 3600)}}
            ]
        };
        return Database.db('GrandValet').collection('Jobs').find(query1).toArray()
        .then((jobsToBeAssigned) => {
            // To check available drivers
            let query2 = {
                $and:[
                    { type : 2 },
                    { driverStatus : 1 }
                ]
            };    
            
            for (let jobToBeAssigned of jobsToBeAssigned) {
                //console.log('should not be here');
                Database.db('GrandValet').collection('Users').aggregate([
                    {
                        $match: {
                            $and:[
                                { type : 2 },
                                { driverStatus : 1 }
                            ]
                        }
                    },
                    {
                        $lookup: {
                                from: "Jobs",
                                localField: "username",
                                foreignField: "driverUsername",
                                as: "driverJobs"
                            }
                    },
                    {
                       $project: {
                            username: 1,
                            numberOfJobs: { $size: "$driverJobs" }
                       }
                    }
                ]).sort( { numberOfJobs: 1 } ).toArray()
                .then((driversAvailable) => {
                    if (driversAvailable.length > 0)
                    {
                        let assignedDriver = driversAvailable[0].username;
                        Database.db('GrandValet').collection('Jobs').updateOne({jobId: jobToBeAssigned.jobId}, { $set: {driverUsername: assignedDriver, status: jobToBeAssigned.status+1 }});
                    }
                })
            }
        })
    }

    // TODO: Potential problem in time zone
    // TODO: Does not return immediate update
    /**
     * Reads jobs assigned to a driver and assign jobs using schedule_jobs.
     * @param {string} username - Username of the requested driver.
     * @returns {Job[]} - Array of JSON of jobs assigned to the driver.
     */
     static read_assignedJobs(username, next) {
        return Database.schedule_jobs().then(() => {
            return Database.db('GrandValet').collection('Jobs').find({driverUsername: username}).toArray()
            .then((jobs) => {
                if (jobs == null) 
                {
                    throw "Error in database";
                }
                return jobs;
            });
        });
    }

    // TODO: Potential problem in time zone
    // TODO: Does not return immediate update
    /**
     * Reads a job and assign jobs using schedule_jobs.
     * @param {number} jobId - ID of the requested job.
     * @returns {Job} - JSON of the requested job.
     */
     static read_job(jobId, next) {
        return Database.schedule_jobs().then(() => {
            return Database.db('GrandValet').collection('Jobs').findOne({jobId: jobId})
            .then((job) => {
                if (job == null) 
                {
                    return null;
                }
                return job;
            });
        });
    }

    /**
     * Stores a job
     * @param {Job} body - JSON of a job file.
     */
     static store_job(body, next) {
        //console.log(body);
        return Database.db('GrandValet').collection('Jobs').findOne({jobId: body.jobId})
        .then((job) => {
            if (job == null) 
            {
                //console.log(body);
                let newData = {type: body.type, jobId: body.jobId, scheduledTime: body.scheduledTime, status: body.status, licenceState: body.licenceState,
                    licenceNum: body.licenceNum, code: body.code, hubId: body.hubId, carLocation: body.carLocation, note: body.note,
                    driverUsername: body.driverUsername, customerUsername: body.customerUsername, advanceState: body.advanceState};
                Database.db('GrandValet').collection('Meta').updateOne({}, { $set: {maxJobId: body.JobId}});
                Database.db('GrandValet').collection('Jobs').insertOne(newData);
                return;
            }
            //console.log(body);
            Database.db('GrandValet').collection('Jobs').updateOne({jobId: body.jobId}, { $set: {type: body.type, jobId: body.jobId, scheduledTime: body.scheduledTime, status: body.status, licenceState: body.licenceState,
                licenceNum: body.licenceNum, code: body.code, hubId: body.hubId, carLocation: body.carLocation, note: body.note,
                driverUsername: body.driverUsername, customerUsername: body.customerUsername, advanceState: body.advanceState}});
        });
    }

    /**
     * Reads the currect maximum jobId
     * @returns {number} - Currect maximum jobId.
     */
     static read_maxMaxJobId(next) {
        return Database.db('GrandValet').collection('Meta').findOne()
        .then((meta) => {
            if (meta == null) 
            {
                //console.log("bad")
                throw "Error in database";
            }
            return meta.maxJobId;
        });
    }

    /**
     * Reads the currect maximum hubId
     * @returns {number} - Currect maximum hubId.
     */
     static read_maxMaxHubId(next) {
        return Database.db('GrandValet').collection('Meta').findOne()
        .then((meta) => {
            if (meta == null) 
            {
                //console.log("bad")
                throw "Error in database";
            }
            return meta.maxHubId;
        });
    }
}


module.exports = {Database};
