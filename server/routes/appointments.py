import datetime
from typing import List
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import JSONResponse
from config.db import get_db
from middleware.auth import get_current_user
from models.schemas import AppointmentCreate, AppointmentUpdate
from utils.helpers import serialize_doc, serialize_docs

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])

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
    if not update_data:
        existing = await db.appointments.find_one({"_id": obj_id, "user": user_id})
        if not existing:
            return JSONResponse(status_code=404, content={"message": "Appointment not found"})
        return serialize_doc(existing)

    update_data["updatedAt"] = datetime.datetime.now(datetime.timezone.utc)
    updated = await db.appointments.find_one_and_update(
        {"_id": obj_id, "user": user_id},
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
