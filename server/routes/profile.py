import datetime
from fastapi import APIRouter, Depends, status
from config.db import get_db
from middleware.auth import get_current_user
from models.schemas import ProfileUpdate
from utils.helpers import serialize_doc

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("")
async def get_profile(user_id: str = Depends(get_current_user)):
    db = get_db()
    profile = await db.profiles.find_one({"user": user_id})
    if not profile:
        now = datetime.datetime.now(datetime.timezone.utc)
        default_profile = {
            "user": user_id,
            "notifications": {"email": True, "sms": False},
            "createdAt": now,
            "updatedAt": now
        }
        result = await db.profiles.insert_one(default_profile)
        profile = await db.profiles.find_one({"_id": result.inserted_id})
    return serialize_doc(profile)

@router.put("")
async def update_profile(
    payload: ProfileUpdate,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    now = datetime.datetime.now(datetime.timezone.utc)
    update_data["updatedAt"] = now
    
    updated = await db.profiles.find_one_and_update(
        {"user": user_id},
        {
            "$set": update_data,
            "$setOnInsert": {"createdAt": now}
        },
        upsert=True,
        return_document=True
    )
    return serialize_doc(updated)
