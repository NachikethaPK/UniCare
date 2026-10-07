import datetime
from bson import ObjectId
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from config.db import get_db
from middleware.auth import get_current_user
from models.schemas import BloodDonorCreate, BloodRequestCreate, BloodRequestStatusUpdate
from utils.helpers import serialize_doc, serialize_docs

router = APIRouter(prefix="/api/blood", tags=["BloodDonation"])

@router.get("/donors")
async def get_donors(user_id: str = Depends(get_current_user)):
    db = get_db()
    donors = await db.blooddonors.find().to_list(1000)
    return serialize_docs(donors)

@router.post("/donors", status_code=status.HTTP_201_CREATED)
async def create_donor(
    payload: BloodDonorCreate,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    doc = payload.model_dump()
    doc["user"] = user_id
    now = datetime.datetime.now(datetime.timezone.utc)
    doc["createdAt"] = now
    doc["updatedAt"] = now

    result = await db.blooddonors.insert_one(doc)
    inserted = await db.blooddonors.find_one({"_id": result.inserted_id})
    return serialize_doc(inserted)

@router.get("/requests")
async def get_requests(user_id: str = Depends(get_current_user)):
    db = get_db()
    requests = await db.bloodrequests.find().to_list(1000)
    return serialize_docs(requests)

@router.post("/requests", status_code=status.HTTP_201_CREATED)
async def create_request(
    payload: BloodRequestCreate,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    doc = payload.model_dump()
    doc["user"] = user_id
    now = datetime.datetime.now(datetime.timezone.utc)
    doc["createdAt"] = now
    doc["updatedAt"] = now

    result = await db.bloodrequests.insert_one(doc)
    inserted = await db.bloodrequests.find_one({"_id": result.inserted_id})
    return serialize_doc(inserted)

@router.patch("/requests/{id}/status")
async def update_request_status(
    id: str,
    payload: BloodRequestStatusUpdate,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    try:
        obj_id = ObjectId(id)
    except Exception:
        return JSONResponse(status_code=404, content={"message": "Request not found"})

    now = datetime.datetime.now(datetime.timezone.utc)
    updated = await db.bloodrequests.find_one_and_update(
        {"_id": obj_id, "user": user_id},
        {"$set": {"status": payload.status, "updatedAt": now}},
        return_document=True
    )
    if not updated:
        return JSONResponse(status_code=404, content={"message": "Request not found"})
    return serialize_doc(updated)
