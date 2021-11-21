import unittest
import requests


SERVER = "http://localhost:3000/test"


class TestDatabase(unittest.TestCase):
    def test_post1(self):
    	r = requests.get(SERVER + '/post1');
    	self.assertEqual(r.status_code, 200);

    	r = requests.get(SERVER + '/get1');
    	self.assertEqual(r.status_code, 200);	
    	self.assertEqual(r.text, "You got it");

    def test_post2(self):
    	r = requests.get(SERVER + '/post2');
    	self.assertEqual(r.status_code, 200);

    def test_post3(self):
    	r = requests.get(SERVER + '/post3');
    	self.assertEqual(r.status_code, 200);

    def test_get2(self):
    	r = requests.get(SERVER + '/get2');
    	self.assertEqual(r.status_code, 200);	

    def test_get3(self):
    	r = requests.get(SERVER + '/testGetJob');
    	self.assertEqual(r.status_code, 200);	

    def test_assign(self):
    	r = requests.get(SERVER + '/AssignJob');
    	self.assertEqual(r.status_code, 200);	

    	r = requests.get(SERVER + '/AssignJobLater');
    	self.assertEqual(r.status_code, 200);	

    	r = requests.get(SERVER + '/customerJob');
    	self.assertEqual(r.status_code, 200);	


if __name__ == '__main__':
    unittest.main()
