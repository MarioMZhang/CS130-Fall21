import unittest
import requests


SERVER = "http://localhost:3000"


class TestBasics(unittest.TestCase):
    def test_connection(self):
        r = requests.get(SERVER)
        self.assertEqual(r.status_code, 200)

    def test_hubs(self):
        r = requests.get(SERVER + '/api/hubs')
        self.assertEqual(r.status_code, 200)
        self.assertTrue(len(r.json()) > 0)


if __name__ == '__main__':
    unittest.main()