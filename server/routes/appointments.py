import os
import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import JSONResponse
from config.db import get_db
from middleware.auth import get_current_user
from models.schemas import AppointmentCreate, AppointmentUpdate
from utils.helpers import serialize_doc, serialize_docs

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])

def send_appointment_email_py(doctor_email, doctor_name, patient_name, patient_email, date, time, speciality, symptoms):
    user = os.getenv("GMAIL_USER") or os.getenv("EMAIL_USER")
    password = os.getenv("GMAIL_APP_PASSWORD") or os.getenv("EMAIL_PASS")
    if not user or not password or not doctor_email:
        print("[Gmail SMTP Python] Notice: Credentials not set or no doctor email provided. Skipping.")
        return
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"New Appointment Scheduled: {patient_name or 'Patient'} - {date} at {time}"
        msg["From"] = f"UniCare Health <{user}>"
        msg["To"] = doctor_email
        if patient_email:
            msg["Reply-To"] = patient_email

        html = f"""
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
            <div style="max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 24px;">
              <h2 style="color: #2563eb; margin-top: 0;">UniCare Health Platform</h2>
              <p>Dear <strong>{doctor_name or 'Doctor'}</strong>,</p>
              <p>A new appointment has been booked with you:</p>
              <ul>
                <li><strong>Patient Name:</strong> {patient_name or 'Confidential Patient'}</li>
                <li><strong>Patient Email:</strong> {patient_email or 'N/A'}</li>
                <li><strong>Date:</strong> {date}</li>
                <li><strong>Time Slot:</strong> {time}</li>
                <li><strong>Speciality:</strong> {speciality or 'General'}</li>
                <li><strong>Reason for Visit:</strong> {symptoms or 'General Consultation'}</li>
              </ul>
              <p style="font-size: 12px; color: #64748b;">You can reply to this email to contact the patient directly.</p>
            </div>
          </body>
        </html>
        """
        msg.attach(MIMEText(html, "html"))
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(user, password)
            server.sendmail(user, doctor_email, msg.as_string())
        print(f"[Gmail SMTP Python] Successfully dispatched email to {doctor_email}")
    except Exception as e:
        print(f"[Gmail SMTP Python] Could not send email: {e}")

@router.get("/doctor/schedule")
async def get_doctor_schedule(
    date: Optional[str] = None,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    user_query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
    user_doc = await db.users.find_one(user_query)
    doctor_email = (user_doc.get("email") or "").lower().strip() if user_doc else ""
    doctor_name = (user_doc.get("name") or "").strip() if user_doc else ""

    conditions = []
    if doctor_email:
        conditions.append({"doctorEmail": {"$regex": f"^{doctor_email}$", "$options": "i"}})
    if doctor_name:
        conditions.append({"doctor": {"$regex": doctor_name, "$options": "i"}})

    query = {"$or": conditions} if conditions else {}
    if date:
        query["date"] = date

    appointments = await db.appointments.find(query).sort([("date", 1), ("time", 1)]).to_list(1000)
    return serialize_docs(appointments)

@router.get("")
async def get_appointments(user_id: str = Depends(get_current_user)):
    db = get_db()
    appointments = await db.appointments.find({"user": user_id}).to_list(1000)
    return serialize_docs(appointments)

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_appointment(
    payload: AppointmentCreate,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    doc = payload.model_dump()
    doc["user"] = user_id
    now = datetime.datetime.now(datetime.timezone.utc)
    doc["createdAt"] = now
    doc["updatedAt"] = now

    result = await db.appointments.insert_one(doc)
    inserted = await db.appointments.find_one({"_id": result.inserted_id})

    # Fetch patient info and dispatch Gmail notification
    try:
        user_query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        user_doc = await db.users.find_one(user_query)
        patient_name = doc.get("patientName") or (user_doc.get("name") if user_doc else "Patient")
        patient_email = doc.get("patientEmail") or (user_doc.get("email") if user_doc else "")

        if doc.get("doctorEmail"):
            send_appointment_email_py(
                doctor_email=doc["doctorEmail"],
                doctor_name=doc.get("doctor", "Doctor"),
                patient_name=patient_name,
                patient_email=patient_email,
                date=doc.get("date", ""),
                time=doc.get("time", ""),
                speciality=doc.get("speciality", ""),
                symptoms=doc.get("symptoms", "")
            )
    except Exception as err:
        print(f"[Appointment Dispatch Notice]: {err}")

    return serialize_doc(inserted)

@router.put("/{id}")
async def update_appointment(
    id: str,
    payload: AppointmentUpdate,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    try:
        obj_id = ObjectId(id)
    except Exception:
        return JSONResponse(status_code=404, content={"message": "Appointment not found"})

    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    user_query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
    user_doc = await db.users.find_one(user_query)
    is_doctor = user_doc and user_doc.get("role") in ["doctor", "admin"]

    filter_query = {"_id": obj_id} if is_doctor else {"_id": obj_id, "user": user_id}

    if not update_data:
        existing = await db.appointments.find_one(filter_query)
        if not existing:
            return JSONResponse(status_code=404, content={"message": "Appointment not found"})
        return serialize_doc(existing)

    update_data["updatedAt"] = datetime.datetime.now(datetime.timezone.utc)
    updated = await db.appointments.find_one_and_update(
        filter_query,
        {"$set": update_data},
        return_document=True
    )
    if not updated:
        return JSONResponse(status_code=404, content={"message": "Appointment not found"})
    return serialize_doc(updated)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(
    id: str,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    try:
        obj_id = ObjectId(id)
    except Exception:
        return JSONResponse(status_code=404, content={"message": "Appointment not found"})

    result = await db.appointments.delete_one({"_id": obj_id, "user": user_id})
    if result.deleted_count == 0:
        return JSONResponse(status_code=404, content={"message": "Appointment not found"})
    return Response(status_code=status.HTTP_204_NO_CONTENT)
