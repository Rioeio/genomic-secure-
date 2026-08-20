import os
import sys
import subprocess

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))

TEST_FILES = [
    "test_task2.py",
    "test_task6.py",
    "test_task11.py",
    "test_task12.py",
    "test_task13.py",
    "test_task14_15.py",
]

def run_all_tests():
    print("=" * 70)
    print("      MED-LINK COMPREHENSIVE PLATFORM VERIFICATION AUDIT")
    print("=" * 70)
    
    passed = 0
    failed = 0
    
    for test in TEST_FILES:
        test_path = os.path.join(BACKEND_DIR, test)
        print(f"\n[RUNNING] {test} ...")
        res = subprocess.run([sys.executable, test_path], cwd=BACKEND_DIR, capture_output=True, text=True)
        if res.returncode == 0:
            print(f"[PASS] {test}")
            for line in res.stdout.strip().split("\n"):
                if "PASS" in line or "CRITERIA" in line:
                    print(f"       {line}")
            passed += 1
        else:
            print(f"[FAIL] {test}")
            print(res.stderr or res.stdout)
            failed += 1
            
    print("\n" + "=" * 70)
    print(f"AUDIT SUMMARY: {passed} PASSED, {failed} FAILED across {len(TEST_FILES)} verification suites.")
    print("=" * 70)
    return failed == 0

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
