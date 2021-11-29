use GrandValet

db.dropDatabase()

db.createCollection("Users")
db.createCollection("Hubs")
db.createCollection("Jobs")
db.createCollection("Meta")

db.Hubs.insertMany([{ "hubId": 1, "description": "South entry of Bruin Plaza", "location": [-118.4452, 34.0689], "startTime": 1636095480, "endTime": 1736095091}, 
					{ "hubId": 2, "description": "Sunset Recreation Center", "location": [-118.4987, 34.0456], "startTime": 1637095480, "endTime": 1646095091},
					{ "hubId": 3, "description": "Covel Commons", "location": [-118.4567, 34.0678], "startTime": 1636095480, "endTime": 1636097480}])

db.Users.insertMany([{ "type": 1, "name": "Customer 1", "username": "customer1", "password": "$2a$10$2DGJ96C77f/WwIwClPwSNuQRqjoSnDFj9GDKjg6X/PePgFdXoE4W6", "email": "c1@spelementary.edu", "phone": "7190000000", "driverStatus": 0 },
					{ "type": 1, "name": "Customer 2", "username": "customer2", "password": "$2a$10$2DGJ96C77f/WwIwClPwSNuQRqjoSnDFj9GDKjg6X/PePgFdXoE4W6", "email": "c2@spelementary.edu", "phone": "7190000001", "driverStatus": 0 },
					{ "type": 1, "name": "Customer 3", "username": "customer3", "password": "$2a$10$2DGJ96C77f/WwIwClPwSNuQRqjoSnDFj9GDKjg6X/PePgFdXoE4W6", "email": "c3@spelementary.edu", "phone": "7190000001", "driverStatus": 0 },	
					{ "type": 2, "name": "Driver 1", "username": "driver1", "password": "$2a$10$2DGJ96C77f/WwIwClPwSNuQRqjoSnDFj9GDKjg6X/PePgFdXoE4W6", "email": "d1@spelementary.edu", "phone": "7190000002", "driverStatus": 1 },
					{ "type": 2, "name": "Driver 2", "username": "driver2", "password": "$2a$10$2DGJ96C77f/WwIwClPwSNuQRqjoSnDFj9GDKjg6X/PePgFdXoE4W6", "email": "d2@spelementary.edu", "phone": "7190000003", "driverStatus": 1 }])

db.Jobs.insertMany([{"type": 1, "jobId": 1, "scheduledTime": 1638126500, "status": 2, "licenceState": "CO", "licenceNum": "CABD12", "hubId": 1, "code": 132561, "carLocation": null, "note": null, "driverUsername": "driver1", "customerUsername": "customer1", "advanceState": [1, 0]},
					{"type": 1, "jobId": 2, "scheduledTime": 1638127000, "status": 2, "licenceState": "CO", "licenceNum": "CABD12", "hubId": 2, "code": 132561, "carLocation": null, "note": null, "driverUsername": "driver1", "customerUsername": "customer2", "advanceState": [1, 0]},
					{"type": 2, "jobId": 3, "scheduledTime": 1638126300, "status": 7, "licenceState": "CO", "licenceNum": "CABD34", "hubId": 2, "code": 132533, "carLocation": [34.0693226, -118.4434938], "note": "at the door", "driverUsername": "driver1", "customerUsername": "customer3", "advanceState": [1, 0]},])

db.Meta.insertMany([{"maxJobId": 3, "maxHubId": 3}])
