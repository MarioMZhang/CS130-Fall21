import unittest
import requests


SERVER = "http://localhost:3000"


class TestJobs(unittest.TestCase):
    # def test_jobs_getnotexist(self):

    def test_hubs_post_dropoff(self):
        new_dropoff_job = {"type": 1, "jobId": 0, "scheduledTime": 1637313499, "status": 0, "licenceState": "CA", "licenceNum": "CA1234", "hubId": 1, "code": None, "carLocation": None, "note": None, "driverUsername": None, "customerUsername": "smarsh", "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_dropoff_job)
        self.assertEqual(r.status_code, 201)
        print(r.json())

        new_dropoff_job = {"type": 1, "jobId": 0, "scheduledTime": 1637313499, "status": 1, "licenceState": "CA", "licenceNum": "CA1234", "hubId": 1, "code": None, "carLocation": None, "note": None, "driverUsername": None, "customerUsername": "smarsh", "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_dropoff_job)
        self.assertEqual(r.status_code, 201)
        print(r.json())

    def test_hubs_post_pickup(self):
        new_pickup_job = {"type": 2, "jobId": 0, "scheduledTime": 1637313499, "status": 0, "licenceState": "CA", "licenceNum": "CA1234", "hubId": 1, "code": None, "carLocation": None, "note": None, "driverUsername": None, "customerUsername": "smarsh", "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_pickup_job)
        self.assertEqual(r.status_code, 201)
        print(r.json())

        new_pickup_job = {"type": 2, "jobId": 0, "scheduledTime": 1637313499, "status": 6, "licenceState": "CA", "licenceNum": "CA1234", "hubId": 1, "code": None, "carLocation": None, "note": None, "driverUsername": None, "customerUsername": "smarsh", "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_pickup_job)
        self.assertEqual(r.status_code, 201)
        print(r.json())

    def test_hubs_post_break(self):
        new_pickup_job = {"type": 3, "jobId": 0, "scheduledTime": 1637313499, "status": 11, "licenceState": None, "licenceNum": None, "hubId": None, "code": None, "carLocation": None, "note": None, "driverUsername": "kyle_brof_driver", "customerUsername": None, "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_pickup_job)
        self.assertEqual(r.status_code, 201)
        print(r.json())

        new_pickup_job = {"type": 3, "jobId": 0, "scheduledTime": 1637313499, "status": 0, "licenceState": None, "licenceNum": None, "hubId": None, "code": None, "carLocation": None, "note": None, "driverUsername": "kyle_brof_driver", "customerUsername": None, "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_pickup_job)
        self.assertEqual(r.status_code, 201)
        print(r.json())


if __name__ == '__main__':
    unittest.main()