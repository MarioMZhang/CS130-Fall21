use GrandValet

db.createCollection("Users")
db.createCollection("Hubs")
db.createCollection("Jobs")
db.createCollection("Meta")

db.Hubs.insertMany([{ "hubId": 1, "description": "South entry of Bruin Plaza", "location": {"lat": "34.0689", "long": "-118.4452"}, "startTime": 1635313479, "endTime": 1635314479}])
db.Users.insertMany([{ "type": 1, "name": "Stan Marsh", "username": "smarsh", "password": "$2a$10$2DGJ96C77f/WwIwClPwSNuQRqjoSnDFj9GDKjg6X/PePgFdXoE4W6", "email": "smarsh@spelementary.edu", "phone": "7190000000", "driverStatus": 0 },{ "type": 2, "name": "Kyle Broflovski", "username": "kyle_brof_driver", "password": "$2a$10$2DGJ96C77f/WwIwClPwSNuQRqjoSnDFj9GDKjg6X/PePgFdXoE4W6", "email": "kyle@spelementary.edu", "phone": "7190000001", "driverStatus": 1 }])
db.Jobs.insertMany([{"type": 1, "jobId": 1, "scheduledTime": 1635313499, "status": 0, "licenceState": "CO", "licenceNum": "CABD12", "hubId": 1, "code": 132561, "carLocation": null, "note": null, "driverUsername": null, "customerUsername": "smarsh", "advanceState": [0, 0]}])
db.Meta.insertMany([{"maxJobId": 1, "maxHubId": 1}])