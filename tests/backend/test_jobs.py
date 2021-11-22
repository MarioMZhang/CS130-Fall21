import unittest
import requests
import time


SERVER = "http://localhost:3000"


class TestJobs(unittest.TestCase):
    cur_time = int(time.time())

    def test_jobs_post_dropoff_status0_normal(self):
        new_dropoff_job = {"type": 1, "jobId": 0, "scheduledTime": self.cur_time+1000, "status": 0, "licenceState": "CA", "licenceNum": "CA1234", "hubId": 1, "code": None, "carLocation": None, "note": None, "driverUsername": None, "customerUsername": "customer1", "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_dropoff_job)
        self.assertEqual(r.status_code, 201)
        new_job_creation_returned = r.json()
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertTrue(new_job_query_returned['driverUsername'] is not None)
        self.assertEqual(new_job_query_returned['status'], 2)

    def test_jobs_post_dropoff_status1_normal(self):
        new_dropoff_job = {"type": 1, "jobId": 0, "scheduledTime": self.cur_time+1000, "status": 1, "licenceState": "CA", "licenceNum": "CA1234", "hubId": 2, "code": None, "carLocation": None, "note": None, "driverUsername": None, "customerUsername": "customer2", "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_dropoff_job)
        self.assertEqual(r.status_code, 201)
        new_job_creation_returned = r.json()
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertTrue(new_job_query_returned['driverUsername'] is not None)
        self.assertTrue(new_job_query_returned['code'] is not None)
        self.assertEqual(new_job_query_returned['status'], 2)

    def test_jobs_post_dropoff_transitions_customer_first(self):
        new_dropoff_job = {"type": 1, "jobId": 0, "scheduledTime": self.cur_time+1000, "status": 1, "licenceState": "CA", "licenceNum": "CA1234", "hubId": 2, "code": None, "carLocation": None, "note": None, "driverUsername": None, "customerUsername": "customer3", "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_dropoff_job)
        self.assertEqual(r.status_code, 201)
        new_job_creation_returned = r.json()
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        # print(new_job_query_returned)

        # 2 to 3 - customer confirm
        new_job_query_returned['advanceState'][0] = 1
        new_job_query_returned['advanceState'][1] = 0
        r = requests.post(SERVER + '/api/jobs', data=new_job_query_returned)
        self.assertEqual(r.status_code, 201)
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertEqual(new_job_query_returned['status'], 2)
        self.assertEqual(new_job_query_returned['advanceState'][0], 1)
        self.assertEqual(new_job_query_returned['advanceState'][1], 0)
        # print(new_job_query_returned)

        # 2 to 3 - driver confirm
        new_job_query_returned['advanceState'][1] = 1
        r = requests.post(SERVER + '/api/jobs', data=new_job_query_returned)
        self.assertEqual(r.status_code, 201)
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        # print(new_job_query_returned)
        self.assertEqual(new_job_query_returned['status'], 3)
        self.assertEqual(new_job_query_returned['advanceState'][0], 1)
        self.assertEqual(new_job_query_returned['advanceState'][1], 1)

        # 3 to 4
        new_job_query_returned['status'] = 4
        new_job_query_returned['note'] = "Nothing interesting"
        new_job_query_returned['carLocation'] = [-118.4452, 34.0689]
        r = requests.post(SERVER + '/api/jobs', data=new_job_query_returned)
        self.assertEqual(r.status_code, 201)
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertEqual(new_job_query_returned['status'], 4)

        # 4 to 5
        new_job_query_returned['status'] = 5
        r = requests.post(SERVER + '/api/jobs', data=new_job_query_returned)
        self.assertEqual(r.status_code, 201)
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertEqual(new_job_query_returned['status'], 5)

    def test_jobs_post_dropoff_transitions_driver_first(self):
        new_dropoff_job = {"type": 1, "jobId": 0, "scheduledTime": self.cur_time+1000, "status": 1, "licenceState": "CA", "licenceNum": "CA1234", "hubId": 2, "code": None, "carLocation": None, "note": None, "driverUsername": None, "customerUsername": "customer3", "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_dropoff_job)
        self.assertEqual(r.status_code, 201)
        new_job_creation_returned = r.json()
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        # print(new_job_query_returned)

        # 2 to 3 - driver confirm
        new_job_query_returned['advanceState'][1] = 1
        r = requests.post(SERVER + '/api/jobs', data=new_job_query_returned)
        self.assertEqual(r.status_code, 201)
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        # print(new_job_query_returned)
        self.assertEqual(new_job_query_returned['status'], 2)
        self.assertEqual(new_job_query_returned['advanceState'][0], 0)
        self.assertEqual(new_job_query_returned['advanceState'][1], 1)

        # 2 to 3 - customer confirm
        new_job_query_returned['advanceState'][0] = 1
        r = requests.post(SERVER + '/api/jobs', data=new_job_query_returned)
        self.assertEqual(r.status_code, 201)
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertEqual(new_job_query_returned['status'], 3)
        self.assertEqual(new_job_query_returned['advanceState'][0], 1)
        self.assertEqual(new_job_query_returned['advanceState'][1], 1)
        # print(new_job_query_returned)

        # 3 to 4
        new_job_query_returned['status'] = 4
        new_job_query_returned['note'] = "Nothing interesting"
        new_job_query_returned['carLocation'] = [-118.4452, 34.0689]
        r = requests.post(SERVER + '/api/jobs', data=new_job_query_returned)
        self.assertEqual(r.status_code, 201)
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertEqual(new_job_query_returned['status'], 4)

        # 4 to 5
        new_job_query_returned['status'] = 5
        r = requests.post(SERVER + '/api/jobs', data=new_job_query_returned)
        self.assertEqual(r.status_code, 201)
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertEqual(new_job_query_returned['status'], 5)

    def test_jobs_post_pickup_transitions_customer_first(self):
        new_dropoff_job = {"type": 2, "jobId": 0, "scheduledTime": self.cur_time+1000, "status": 6, "licenceState": "CA", "licenceNum": "CA1234", "hubId": 2, "code": None, "carLocation": [-118.4452, 34.0689], "note": "Some note", "driverUsername": None, "customerUsername": "customer3", "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_dropoff_job)
        self.assertEqual(r.status_code, 201)
        new_job_creation_returned = r.json()
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        # print(new_job_query_returned)

        # 7 to 8
        new_job_query_returned['status'] = 8
        r = requests.post(SERVER + '/api/jobs', data=new_job_query_returned)
        self.assertEqual(r.status_code, 201)
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertEqual(new_job_query_returned['status'], 8)

        # 8 to 9
        new_job_query_returned['status'] = 9
        r = requests.post(SERVER + '/api/jobs', data=new_job_query_returned)
        self.assertEqual(r.status_code, 201)
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertEqual(new_job_query_returned['status'], 9)

        # 9 to 13 - customer confirm
        new_job_query_returned['advanceState'][0] = 1
        new_job_query_returned['advanceState'][1] = 0
        # print(new_job_query_returned)
        r = requests.post(SERVER + '/api/jobs', data=new_job_query_returned)
        self.assertEqual(r.status_code, 201)
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertEqual(new_job_query_returned['status'], 9)
        self.assertEqual(new_job_query_returned['advanceState'][0], 1)
        self.assertEqual(new_job_query_returned['advanceState'][1], 0)
        # print(new_job_query_returned)

        # 9 to 13 - driver confirm
        new_job_query_returned['advanceState'][1] = 1
        r = requests.post(SERVER + '/api/jobs', data=new_job_query_returned)
        self.assertEqual(r.status_code, 201)
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        # print(new_job_query_returned)
        self.assertEqual(new_job_query_returned['status'], 13)
        self.assertEqual(new_job_query_returned['advanceState'][0], 1)
        self.assertEqual(new_job_query_returned['advanceState'][1], 1)

    def test_jobs_post_pickup_transitions_driver_first(self):
        new_dropoff_job = {"type": 2, "jobId": 0, "scheduledTime": self.cur_time+1000, "status": 6, "licenceState": "CA", "licenceNum": "CA1234", "hubId": 2, "code": None, "carLocation": [-118.4452, 34.0689], "note": "Some note", "driverUsername": None, "customerUsername": "customer3", "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_dropoff_job)
        self.assertEqual(r.status_code, 201)
        new_job_creation_returned = r.json()
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        # print(new_job_query_returned)

        # 7 to 8
        new_job_query_returned['status'] = 8
        r = requests.post(SERVER + '/api/jobs', data=new_job_query_returned)
        self.assertEqual(r.status_code, 201)
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertEqual(new_job_query_returned['status'], 8)

        # 8 to 9
        new_job_query_returned['status'] = 9
        r = requests.post(SERVER + '/api/jobs', data=new_job_query_returned)
        self.assertEqual(r.status_code, 201)
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertEqual(new_job_query_returned['status'], 9)

        # 9 to 13 - customer confirm
        new_job_query_returned['advanceState'][0] = 0
        new_job_query_returned['advanceState'][1] = 1
        # print(new_job_query_returned)
        r = requests.post(SERVER + '/api/jobs', data=new_job_query_returned)
        self.assertEqual(r.status_code, 201)
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertEqual(new_job_query_returned['status'], 9)
        self.assertEqual(new_job_query_returned['advanceState'][0], 0)
        self.assertEqual(new_job_query_returned['advanceState'][1], 1)
        # print(new_job_query_returned)

        # 9 to 13 - driver confirm
        new_job_query_returned['advanceState'][0] = 1
        r = requests.post(SERVER + '/api/jobs', data=new_job_query_returned)
        self.assertEqual(r.status_code, 201)
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        # print(new_job_query_returned)
        self.assertEqual(new_job_query_returned['status'], 13)
        self.assertEqual(new_job_query_returned['advanceState'][0], 1)
        self.assertEqual(new_job_query_returned['advanceState'][1], 1)

    def test_jobs_post_pickup_status0_normal(self):
        new_pickup_job = {"type": 2, "jobId": 0, "scheduledTime": self.cur_time+1000, "status": 0, "licenceState": "CA", "licenceNum": "CA1234", "hubId": 1, "code": None, "carLocation": None, "note": None, "driverUsername": None, "customerUsername": "customer1", "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_pickup_job)
        self.assertEqual(r.status_code, 201)
        new_job_creation_returned = r.json()
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertTrue(new_job_query_returned['driverUsername'] is not None)
        self.assertEqual(new_job_query_returned['status'], 7)

    def test_jobs_post_pickup_status6_normal(self):
        new_pickup_job = {"type": 2, "jobId": 0, "scheduledTime": self.cur_time+1000, "status": 6, "licenceState": "CA", "licenceNum": "CA1234", "hubId": 2, "code": None, "carLocation": None, "note": None, "driverUsername": None, "customerUsername": "customer2", "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_pickup_job)
        self.assertEqual(r.status_code, 201)
        new_job_creation_returned = r.json()
        r = requests.get(SERVER + '/api/jobs?jobid={}'.format(new_job_creation_returned['jobId']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertTrue(new_job_query_returned['driverUsername'] is not None)
        self.assertEqual(new_job_query_returned['status'], 7)

    def test_jobs_post_break_status11_normal(self):
        new_pickup_job = {"type": 3, "jobId": 0, "scheduledTime": self.cur_time+10000, "status": 11, "licenceState": None, "licenceNum": None, "hubId": None, "code": None, "carLocation": None, "note": None, "driverUsername": "driver1", "customerUsername": None, "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_pickup_job)
        self.assertEqual(r.status_code, 201)
        new_job_creation_returned = r.json()
        r = requests.get(SERVER + '/api/jobs?username={}'.format(new_job_creation_returned['driverUsername']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertTrue(3 in [x['type'] for x in new_job_query_returned])

    def test_jobs_post_break_status0_normal(self):
        new_pickup_job = {"type": 3, "jobId": 0, "scheduledTime": self.cur_time+10000, "status": 0, "licenceState": None, "licenceNum": None, "hubId": None, "code": None, "carLocation": None, "note": None, "driverUsername": "driver2", "customerUsername": None, "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_pickup_job)
        self.assertEqual(r.status_code, 201)
        new_job_creation_returned = r.json()
        r = requests.get(SERVER + '/api/jobs?username={}'.format(new_job_creation_returned['driverUsername']))
        self.assertEqual(r.status_code, 200)
        new_job_query_returned = r.json()
        self.assertTrue(3 in [x['type'] for x in new_job_query_returned])

    def test_jobs_post_break_invalid_time(self):
        # time in the past 
        new_pickup_job = {"type": 3, "jobId": 0, "scheduledTime": self.cur_time-10000, "status": 11, "licenceState": None, "licenceNum": None, "hubId": None, "code": None, "carLocation": None, "note": None, "driverUsername": "driver1", "customerUsername": None, "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_pickup_job)
        self.assertEqual(r.status_code, 400)

        # time in the past 
        new_pickup_job = {"type": 3, "jobId": 0, "scheduledTime": self.cur_time-10000, "status": 0, "licenceState": None, "licenceNum": None, "hubId": None, "code": None, "carLocation": None, "note": None, "driverUsername": "driver2", "customerUsername": None, "advanceState": [0, 0]}
        r = requests.post(SERVER + '/api/jobs', data=new_pickup_job)
        self.assertEqual(r.status_code, 400)


if __name__ == '__main__':
    unittest.main()