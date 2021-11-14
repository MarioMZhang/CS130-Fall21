import unittest
import requests


SERVER = "http://localhost:3000"


class TestJobs(unittest.TestCase):
    # def test_jobs_getnotexist(self):
    #     r = requests.get(SERVER + '/api/hubs?hubId=0')
    #     self.assertEqual(r.status_code, 404)
    #     r = requests.get(SERVER + '/api/hubs?hubId=-1')
    #     self.assertEqual(r.status_code, 404)
    #     r = requests.get(SERVER + '/api/hubs?hubId=alpha')
    #     self.assertEqual(r.status_code, 404)

    def test_hubs_post(self):
        # new_hub = { 'hubId': 0, 'description': '330 De Neve Drive', 'location': [-118.9, 34.1], 'startTime': 1636095000, 'endTime': 1637095091 }
        # r = requests.post(SERVER + '/api/hubs', data=new_hub)
        # self.assertEqual(r.status_code, 201)
        # hub = r.json()
        # self.assertTrue(hub['hubId'] > 0)
        # self.assertEqual(hub['description'], new_hub['description'])
        # self.assertTrue(len(hub['location']) == 2 
        #     and (hub['location'][0] == new_hub['location'][0])
        #     and (hub['location'][1] == new_hub['location'][1]))

        # self.assertEqual(hub['startTime'], new_hub['startTime'])
        # self.assertEqual(hub['endTime'], new_hub['endTime'])
        new_dropoff_job = {"type": 1, "jobId": 1, "scheduledTime": 1635313499, "status": 0, "licenceState": "CA", "licenceNum": "CA1234", "hubId": 1, "code": None, "carLocation": None, "note": None, "driverUsername": None, "customerUsername": "smarsh", "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_dropoff_job)
        self.assertEqual(r.status_code, 201)

if __name__ == '__main__':
    unittest.main()