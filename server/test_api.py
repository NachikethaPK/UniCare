import sys
import time
import requests

BASE_URL = "http://127.0.0.1:5000/api"

def run_tests():
    print("Testing /api/health...")
    r = requests.get(f"{BASE_URL}/health")
    assert r.status_code == 200, f"Health failed: {r.status_code}"
    assert r.json() == {"status": "ok"}
    print("[PASS] /api/health")

    test_email = f"test_{int(time.time())}@example.com"
    print(f"Testing /api/auth/register with {test_email}...")
    reg_payload = {"name": "Python Test User", "email": test_email, "password": "password123"}
    r = requests.post(f"{BASE_URL}/auth/register", json=reg_payload)
    assert r.status_code == 201, f"Register failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data and "user" in data
    token = data["token"]
    user_id = data["user"]["id"]
    print(f"[PASS] /api/auth/register (user_id={user_id})")

    print("Testing duplicate registration...")
    r = requests.post(f"{BASE_URL}/auth/register", json=reg_payload)
    assert r.status_code == 409, f"Duplicate reg expected 409, got {r.status_code}"
    print("[PASS] Duplicate registration returns 409")

    print("Testing /api/auth/login...")
    r = requests.post(f"{BASE_URL}/auth/login", json={"email": test_email, "password": "password123"})
    assert r.status_code == 200, f"Login failed: {r.status_code}"
    assert "token" in r.json()
    print("[PASS] /api/auth/login")

    headers = {"Authorization": f"Bearer {token}"}

    print("Testing /api/profile...")
    r = requests.get(f"{BASE_URL}/profile", headers=headers)
    assert r.status_code == 200, f"Get profile failed: {r.status_code}"
    print("[PASS] GET /api/profile")

    r = requests.put(f"{BASE_URL}/profile", json={"phone": "9876543210", "gender": "Female"}, headers=headers)
    assert r.status_code == 200, f"Update profile failed: {r.status_code}"
    assert r.json().get("phone") == "9876543210"
    print("[PASS] PUT /api/profile")

    print("Testing /api/appointments...")
    app_payload = {"doctor": "Dr. Smith", "date": "2026-09-01", "time": "10:00 AM", "speciality": "General"}
    r = requests.post(f"{BASE_URL}/appointments", json=app_payload, headers=headers)
    assert r.status_code == 201, f"Create appointment failed: {r.status_code} {r.text}"
    app_data = r.json()
    app_id = app_data.get("_id") or app_data.get("id")
    print(f"[PASS] POST /api/appointments (app_id={app_id})")

    r = requests.get(f"{BASE_URL}/appointments", headers=headers)
    assert r.status_code == 200, f"Get appointments failed: {r.status_code}"
    assert len(r.json()) > 0
    print("[PASS] GET /api/appointments")

    r = requests.put(f"{BASE_URL}/appointments/{app_id}", json={"status": "Completed"}, headers=headers)
    assert r.status_code == 200, f"Update appointment failed: {r.status_code}"
    assert r.json().get("status") == "Completed"
    print("[PASS] PUT /api/appointments/{id}")

    r = requests.delete(f"{BASE_URL}/appointments/{app_id}", headers=headers)
    assert r.status_code == 204, f"Delete appointment failed: {r.status_code}"
    print("[PASS] DELETE /api/appointments/{id}")

    print("Testing /api/blood...")
    r = requests.get(f"{BASE_URL}/blood/donors", headers=headers)
    assert r.status_code == 200
    print("[PASS] GET /api/blood/donors")

    donor_payload = {"name": "John Donor", "bloodGroup": "O+", "location": "City", "phone": "1234567890"}
    r = requests.post(f"{BASE_URL}/blood/donors", json=donor_payload, headers=headers)
    assert r.status_code == 201
    print("[PASS] POST /api/blood/donors")

    r = requests.get(f"{BASE_URL}/blood/requests", headers=headers)
    assert r.status_code == 200
    print("[PASS] GET /api/blood/requests")

    req_payload = {"bloodGroup": "A+", "urgency": "High", "location": "Hospital A"}
    r = requests.post(f"{BASE_URL}/blood/requests", json=req_payload, headers=headers)
    assert r.status_code == 201
    req_id = r.json().get("_id") or r.json().get("id")
    print("[PASS] POST /api/blood/requests")

    r = requests.patch(f"{BASE_URL}/blood/requests/{req_id}/status", json={"status": "Fulfilled"}, headers=headers)
    assert r.status_code == 200
    assert r.json().get("status") == "Fulfilled"
    print("[PASS] PATCH /api/blood/requests/{id}/status")

    print("Testing /api/records...")
    rec_payload = {"title": "Blood Test", "category": "Lab", "date": "2026-08-01"}
    r = requests.post(f"{BASE_URL}/records", json=rec_payload, headers=headers)
    assert r.status_code == 201
    rec_id = r.json().get("_id") or r.json().get("id")
    print("[PASS] POST /api/records")

    r = requests.get(f"{BASE_URL}/records?category=Lab", headers=headers)
    assert r.status_code == 200
    assert len(r.json()) > 0
    print("[PASS] GET /api/records")

    r = requests.delete(f"{BASE_URL}/records/{rec_id}", headers=headers)
    assert r.status_code == 204
    print("[PASS] DELETE /api/records/{id}")

    print("Testing /api/pets...")
    pet_payload = {"name": "Buddy", "species": "Dog", "breed": "Golden Retriever"}
    r = requests.post(f"{BASE_URL}/pets", json=pet_payload, headers=headers)
    assert r.status_code == 201
    pet_id = r.json().get("_id") or r.json().get("id")
    print(f"[PASS] POST /api/pets (pet_id={pet_id})")

    r = requests.get(f"{BASE_URL}/pets", headers=headers)
    assert r.status_code == 200
    assert len(r.json()) > 0
    print("[PASS] GET /api/pets")

    vax_payload = {"pet": pet_id, "name": "Rabies", "date": "2026-01-01", "nextDue": "2027-01-01"}
    r = requests.post(f"{BASE_URL}/pets/vaccinations", json=vax_payload, headers=headers)
    assert r.status_code == 201
    print("[PASS] POST /api/pets/vaccinations")

    r = requests.get(f"{BASE_URL}/pets/vaccinations?petId={pet_id}", headers=headers)
    assert r.status_code == 200
    assert len(r.json()) > 0
    print("[PASS] GET /api/pets/vaccinations")

    print("\nALL API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
