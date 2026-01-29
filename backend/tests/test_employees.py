import pytest


def make_employee_payload(eid="EMP-001", name="Alice", email="alice@example.com", dept="Engineering"):
    return {
        "employee_id": eid,
        "full_name": name,
        "email": email,
        "department": dept,
    }


def test_create_duplicate_returns_409(client):
    payload = make_employee_payload()
    res1 = client.post("/employees/", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/employees/", json=payload)
    assert res2.status_code == 409
    assert res2.json().get("error", {}).get("message") is not None


def test_invalid_input_returns_400(client):
    # invalid email
    payload = make_employee_payload(email="not-an-email")
    res = client.post("/employees/", json=payload)
    # Request validation errors are mapped to 400 by the app
    assert res.status_code == 400
    body = res.json()
    assert "error" in body
    assert body["error"]["code"] == 400


def test_transactional_delete_removes_attendance(client):
    # Create employee
    payload = make_employee_payload(eid="EMP-DEL", name="Bob", email="bob@example.com")
    res = client.post("/employees/", json=payload)
    assert res.status_code == 201
    emp = res.json()
    emp_id = emp["id"]

    # Add attendance
    att_payload = {"date": "2026-01-01", "status": "Present"}
    res_att = client.post(f"/attendance/{emp_id}", json=att_payload)
    assert res_att.status_code == 201

    # Delete employee
    res_del = client.delete(f"/employees/{emp_id}")
    assert res_del.status_code == 204

    # Ensure attendance is gone
    res_get = client.get(f"/attendance/{emp_id}")
    assert res_get.status_code == 200
    assert res_get.json() == []
