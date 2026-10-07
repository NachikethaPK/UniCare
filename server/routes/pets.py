import datetime
from typing import Optional, List
from bson import ObjectId
from fastapi import APIRouter, Depends, status, Response, UploadFile, File, Form
from fastapi.responses import JSONResponse
from config.db import get_db
from middleware.auth import get_current_user, get_optional_current_user
from models.schemas import PetCreate, PetVaccinationCreate, PetRecordCreate
from utils.helpers import serialize_doc, serialize_docs
from utils.date_extractor import extract_clinical_date_from_file_or_text

router = APIRouter(prefix="/api/pets", tags=["Pets"])

@router.get("")
async def get_pets(user_id: str = Depends(get_current_user)):
    db = get_db()
    pets = await db.pets.find({"user": user_id}).to_list(1000)
    return serialize_docs(pets)

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_pet(
    payload: PetCreate,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    doc = payload.model_dump()
    doc["user"] = user_id
    now = datetime.datetime.now(datetime.timezone.utc)
    doc["createdAt"] = now
    doc["updatedAt"] = now

    result = await db.pets.insert_one(doc)
    inserted = await db.pets.find_one({"_id": result.inserted_id})
    return serialize_doc(inserted)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pet(
    id: str,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    try:
        obj_id = ObjectId(id)
    except Exception:
        return JSONResponse(status_code=404, content={"message": "Pet not found"})

    result = await db.pets.delete_one({"_id": obj_id, "user": user_id})
    if result.deleted_count == 0:
        return JSONResponse(status_code=404, content={"message": "Pet not found"})
    
    # Also clean up associated vaccinations and records
    await db.petvaccinations.delete_many({"pet": id})
    await db.petrecords.delete_many({"pet": id})
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/vaccinations")
async def get_vaccinations(
    petId: Optional[str] = None,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    if petId:
        query = {"$or": [{"pet": petId}]}
        try:
            query["$or"].append({"pet": ObjectId(petId)})
        except Exception:
            pass
    else:
        user_pets = await db.pets.find({"user": user_id}).to_list(1000)
        pet_ids = []
        for p in user_pets:
            pet_ids.append(str(p["_id"]))
            pet_ids.append(p["_id"])
        query = {"pet": {"$in": pet_ids}}

    vaccinations = await db.petvaccinations.find(query).sort("date", -1).to_list(1000)
    return serialize_docs(vaccinations)

@router.post("/vaccinations", status_code=status.HTTP_201_CREATED)
async def add_vaccination(
    payload: PetVaccinationCreate,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    pet_query = {"user": user_id}
    try:
        pet_query["_id"] = ObjectId(payload.pet)
    except Exception:
        pet_query["_id"] = payload.pet

    pet = await db.pets.find_one(pet_query)
    if not pet:
        return JSONResponse(status_code=404, content={"message": "Pet not found or unauthorized"})

    doc = payload.model_dump()
    now = datetime.datetime.now(datetime.timezone.utc)
    doc["createdAt"] = now
    doc["updatedAt"] = now

    result = await db.petvaccinations.insert_one(doc)
    inserted = await db.petvaccinations.find_one({"_id": result.inserted_id})
    return serialize_doc(inserted)

# ----------------- Pet Medical Records Endpoints ----------------- #

@router.get("/records")
async def get_pet_records(
    petId: Optional[str] = None,
    category: Optional[str] = None,
    sort_order: Optional[str] = "desc", # "desc" = newest clinical examination date first, "asc" = oldest first
    user_id: str = Depends(get_current_user)
):
    """
    Returns pet medical records sorted in strict chronological order by internal report/treatment date.
    """
    db = get_db()
    
    # Verify user owns the requested pet or find all pets owned by user
    if petId:
        user_pets = await db.pets.find({"_id": ObjectId(petId), "user": user_id} if ObjectId.is_valid(petId) else {"user": user_id}).to_list(100)
        query = {"pet": petId}
    else:
        user_pets = await db.pets.find({"user": user_id}).to_list(1000)
        pet_ids = [str(p["_id"]) for p in user_pets]
        query = {"pet": {"$in": pet_ids}}

    if category:
        query["category"] = category

    sort_direction = -1 if sort_order == "desc" else 1
    # Sort strictly by the veterinary report date, then creation timestamp
    records = await db.petrecords.find(query).sort([("date", sort_direction), ("createdAt", -1)]).to_list(1000)
    return serialize_docs(records)

@router.post("/records", status_code=status.HTTP_201_CREATED)
async def create_pet_record(
    payload: PetRecordCreate,
    user_id: str = Depends(get_current_user)
):
    """
    Creates a new pet medical record with normalized clinical date and chronological indexing.
    """
    db = get_db()
    
    # Verify pet ownership if valid ObjectId
    if ObjectId.is_valid(payload.pet):
        pet = await db.pets.find_one({"_id": ObjectId(payload.pet), "user": user_id})
        if not pet:
            # Check if user has any pets or create record
            pass

    doc = payload.model_dump()
    doc["user"] = user_id
    now = datetime.datetime.now(datetime.timezone.utc)
    doc["createdAt"] = now
    doc["updatedAt"] = now

    if not doc.get("date") or not doc["date"].strip():
        doc["date"] = datetime.date.today().strftime("%Y-%m-%d")

    result = await db.petrecords.insert_one(doc)
    inserted = await db.petrecords.find_one({"_id": result.inserted_id})
    return serialize_doc(inserted)

@router.delete("/records/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pet_record(
    id: str,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    try:
        obj_id = ObjectId(id)
    except Exception:
        return JSONResponse(status_code=404, content={"message": "Record not found"})

    result = await db.petrecords.delete_one({"_id": obj_id, "user": user_id})
    if result.deleted_count == 0:
        return JSONResponse(status_code=404, content={"message": "Record not found"})
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.post("/extract-date")
async def extract_date_from_pet_report(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    user_id: str = Depends(get_optional_current_user)
):
    """
    Analyzes an uploaded pet medical document (image/PDF) or text and extracts the internal examination/vaccination date,
    category, and veterinary tags using the Hybrid Multimodal OCR / NLP Engine.
    """
    filename = "pet_report.pdf"
    file_bytes = None
    mime_type = None

    if file:
        filename = file.filename or "pet_report.pdf"
        mime_type = file.content_type
        file_bytes = await file.read()

    result = await extract_clinical_date_from_file_or_text(
        file_bytes=file_bytes,
        mime_type=mime_type,
        filename=filename,
        text=text
    )
    return result
