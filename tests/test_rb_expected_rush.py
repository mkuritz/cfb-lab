import json, os, unittest
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")

class TestCFBRBExpected(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(os.path.join(DATA, "rb_expected_rush.json")) as f:
            cls.d = json.load(f)

    def test_sheppard_math(self):
        s = self.d["players"].get("5164332")
        self.assertIsNotNone(s)
        self.assertEqual(s["name"], "Nate Sheppard")
        self.assertIn("att ×", s["formula"]); self.assertIn(str(s["expected"]), s["formula"]); self.assertTrue(abs(s["avg_att"] * s["opp_ypc"] - s["expected"]) < 0.3)
        self.assertGreater(s["opp_ra"], 10)
        self.assertIsNotNone(s["line"])
        self.assertIsNotNone(s["sl_proj"])

    def test_rb_only(self):
        for p in self.d["players"].values():
            self.assertEqual(p["pos"], "RB")

    def test_no_invented_ypc_without_attempts(self):
        for p in self.d["players"].values():
            self.assertIsNotNone(p.get("opp_ra"))
            self.assertGreaterEqual(p["opp_ra"], 10)

if __name__ == "__main__":
    unittest.main()
