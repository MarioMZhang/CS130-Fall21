import unittest
import requests


SERVER = "http://localhost:3000"


class TestHubs(unittest.TestCase):
    one_hub_id = None

    def test_hubs_getlist(self):
        r = requests.get(SERVER + '/api/hubs')
        self.assertEqual(r.status_code, 200)
        hublist = r.json()
        self.assertTrue(len(hublist) > 0)
        for hub in hublist:
            self.assertTrue(hub['hubId'] > 0)
            self.assertTrue('description' in hub)
            self.assertTrue('location' in hub and len(hub['location']) == 2 
                and -180 <= hub['location'][0] <= 180
                and -90 <= hub['location'][1] <= 90)
            self.assertTrue(hub['startTime'] > 0)
            self.assertTrue(hub['endTime'] >= hub['startTime'])
            TestHubs.one_hub_id = hub['hubId']

    def test_hubs_getone(self):
        r = requests.get(SERVER + '/api/hubs?hubId={}'.format(TestHubs.one_hub_id))
        self.assertEqual(r.status_code, 200)
        hub = r.json()
        self.assertTrue(hub['hubId'] > 0)
        self.assertTrue('description' in hub)
        self.assertTrue('location' in hub and len(hub['location']) == 2 
            and -180 <= hub['location'][0] <= 180
            and -90 <= hub['location'][1] <= 90)
        self.assertTrue(hub['startTime'] > 0)
        self.assertTrue(hub['endTime'] >= hub['startTime'])

    def test_hubs_getnotexist(self):
        r = requests.get(SERVER + '/api/hubs?hubId=0')
        self.assertEqual(r.status_code, 404)
        r = requests.get(SERVER + '/api/hubs?hubId=-1')
        self.assertEqual(r.status_code, 404)
        r = requests.get(SERVER + '/api/hubs?hubId=alpha')
        self.assertEqual(r.status_code, 404)

    def test_hubs_post(self):
        new_hub = { 'hubId': 0, 'description': '330 De Neve Drive', 'location': [-118.9, 34.1], 'startTime': 1636095000, 'endTime': 1637095091 }
        r = requests.post(SERVER + '/api/hubs', data=new_hub)
        self.assertEqual(r.status_code, 201)
        hub = r.json()
        self.assertTrue(hub['hubId'] > 0)
        self.assertEqual(hub['description'], new_hub['description'])
        self.assertTrue(len(hub['location']) == 2 
            and (hub['location'][0] == new_hub['location'][0])
            and (hub['location'][1] == new_hub['location'][1]))

        self.assertEqual(hub['startTime'], new_hub['startTime'])
        self.assertEqual(hub['endTime'], new_hub['endTime'])


if __name__ == '__main__':
    unittest.main()