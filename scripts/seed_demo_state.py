import time
import urllib.request
import urllib.error
import json

def wait_for_server(url="http://127.0.0.1:8000/", timeout=15):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url) as res:
                if res.status == 200:
                    print("Backend server is UP and responding!")
                    return True
        except Exception:
            time.sleep(0.5)
    return False

def seed_fl_rounds():
    # 1. Login as Researcher to get JWT
    login_url = "http://127.0.0.1:8000/auth/login"
    login_payload = json.dumps({
        "email": "dr.smith@genome.edu",
        "password": "secure123"
    }).encode("utf-8")
    
    req = urllib.request.Request(
        login_url,
        data=login_payload,
        headers={"Content-Type": "application/json"}
    )
    
    with urllib.request.urlopen(req) as res:
        auth_data = json.loads(res.read().decode())
        token = auth_data["access_token"]
        print(f"Logged in successfully as Researcher. JWT token acquired.")

    # 2. Seed 3 initial federated rounds
    round_url = "http://127.0.0.1:8000/api/fl/run-round"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }

    for r in range(1, 4):
        payload = json.dumps({
            "epsilon_step": 0.25,
            "study_id": "gwas_cardio_01",
            "domain": "genomics"
        }).encode("utf-8")
        
        round_req = urllib.request.Request(round_url, data=payload, headers=headers)
        with urllib.request.urlopen(round_req) as res:
            res_data = json.loads(res.read().decode())
            data = res_data["data"]
            print(f"Seeded FL Round {data['round']}: Accuracy = {data['accuracy']*100:.1f}%, Loss = {data['loss']:.4f}, Epsilon = {data['privacy_status']['epsilon_used']}")
            time.sleep(0.3)

    print("Platform successfully seeded with active federated rounds and telemetry!")

if __name__ == "__main__":
    if wait_for_server():
        seed_fl_rounds()
    else:
        print("Backend server did not respond in time.")
