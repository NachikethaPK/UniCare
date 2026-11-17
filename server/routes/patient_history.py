import datetime
from typing import List, Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import JSONResponse
from config.db import get_db
from middleware.auth import get_current_user
from models.schemas import PatientHistoryCreate, PatientHistoryUpdate
from utils.helpers import serialize_doc, serialize_docs

router = APIRouter(prefix="/api/patient-history", tags=["Patient History"])

@router.get("")
async def get_patient_histories(
    patientEmail: Optional[str] = None,
    search: Optional[str] = None,
    date: Optional[str] = None,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    user_query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
    user_doc = await db.users.find_one(user_query)

    query = {}
    if user_doc and user_doc.get("role") == "doctor":
        doc_email = (user_doc.get("email") or "").lower().strip()
        doc_name = (user_doc.get("name") or "").strip()
        conditions = [
            {"doctorId": user_id},
            {"doctorEmail": {"$regex": f"^{doc_email}$", "$options": "i"}},
            {"doctor": {"$regex": doc_name, "$options": "i"}}
        ]
        query["$or"] = conditions

    if patientEmail:
        query["patientEmail"] = {"$regex": f"^{patientEmail.strip()}$", "$options": "i"}

    if date:
        query["date"] = date

    if search:
        s = search.strip()
        query["$or"] = [
            {"patientName": {"$regex": s, "$options": "i"}},
            {"patientEmail": {"$regex": s, "$options": "i"}},
            {"diagnosis": {"$regex": s, "$options": "i"}},
            {"symptoms": {"$regex": s, "$options": "i"}}
        ]

    records = await db.patient_history.find(query).sort([("date", -1), ("createdAt", -1)]).to_list(1000)
    return serialize_docs(records)

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_patient_history(
    payload: PatientHistoryCreate,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    user_query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
    user_doc = await db.users.find_one(user_query)

    doc = payload.model_dump()
    doc["doctorId"] = user_id
    if not doc.get("doctor") and user_doc:
        doc["doctor"] = user_doc.get("name", "Doctor")
    if not doc.get("doctorEmail") and user_doc:
        doc["doctorEmail"] = user_doc.get("email", "")
    if not doc.get("date"):
        doc["date"] = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")

    now = datetime.datetime.now(datetime.timezone.utc)
    doc["createdAt"] = now
    doc["updatedAt"] = now

    result = await db.patient_history.insert_one(doc)
    inserted = await db.patient_history.find_one({"_id": result.inserted_id})
    return serialize_doc(inserted)

@router.put("/{id}")
async def update_patient_history(
    id: str,
    payload: PatientHistoryUpdate,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    try:
        obj_id = ObjectId(id)
    except Exception:
        return JSONResponse(status_code=404, content={"message": "Record not found"})

    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update_data:
        existing = await db.patient_history.find_one({"_id": obj_id})
        if not existing:
            return JSONResponse(status_code=404, content={"message": "Record not found"})
        return serialize_doc(existing)

    update_data["updatedAt"] = datetime.datetime.now(datetime.timezone.utc)
    updated = await db.patient_history.find_one_and_update(
        {"_id": obj_id},
        {"$set": update_data},
        return_document=True
    )
    if not updated:
        return JSONResponse(status_code=404, content={"message": "Record not found"})
    return serialize_doc(updated)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient_history(
    id: str,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    try:
        obj_id = ObjectId(id)
    except Exception:
        return JSONResponse(status_code=404, content={"message": "Record not found"})

    result = await db.patient_history.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        return JSONResponse(status_code=404, content={"message": "Record not found"})
    return Response(status_code=status.HTTP_204_NO_CONTENT)
