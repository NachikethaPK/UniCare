import datetime
from typing import Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, status, Response, UploadFile, File, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from config.db import get_db
from middleware.auth import get_current_user, get_optional_current_user
from models.schemas import HealthRecordCreate
from utils.helpers import serialize_doc, serialize_docs
from utils.date_extractor import extract_clinical_date_from_file_or_text

router = APIRouter(prefix="/api/records", tags=["HealthRecords"])

class DateExtractionRequest(BaseModel):
    text: Optional[str] = None
    fileName: Optional[str] = "medical_report.pdf"

@router.get("")
async def get_records(
    category: Optional[str] = None,
    sort_order: Optional[str] = "desc", # "desc" = newest clinical date first, "asc" = oldest first
    user_id: str = Depends(get_current_user)
):
    """
    Returns medical records sorted in strict chronological order by the internal report date.
    """
    db = get_db()
    query = {"user": user_id}
    if category:
        query["category"] = category

    sort_direction = -1 if sort_order == "desc" else 1
    # Sort strictly by the clinical report date, then by creation timestamp
    records = await db.healthrecords.find(query).sort([("date", sort_direction), ("createdAt", -1)]).to_list(1000)
    return serialize_docs(records)

@router.post("/extract-date")
async def extract_date_from_report(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    user_id: str = Depends(get_optional_current_user)
):
    """
    Analyzes an uploaded medical document (image/PDF) or pasted text and extracts the internal clinical date using the Hybrid Vision/NLP engine.
    """
    filename = "document.pdf"
    file_bytes = None
    mime_type = None

    if file:
        filename = file.filename or "document.pdf"
        mime_type = file.content_type
        file_bytes = await file.read()

    result = await extract_clinical_date_from_file_or_text(
        file_bytes=file_bytes,
        mime_type=mime_type,
        filename=filename,
        text=text
    )
    return result

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_record(
    payload: HealthRecordCreate,
    user_id: str = Depends(get_current_user)
):
    """
    Creates a new medical record with normalized clinical date and chronological indexing.
    """
    db = get_db()
    doc = payload.model_dump()
    doc["user"] = user_id
    now = datetime.datetime.now(datetime.timezone.utc)
    doc["createdAt"] = now
    doc["updatedAt"] = now

    # Ensure date is populated (default to today if omitted)
    if not doc.get("date") or not doc["date"].strip():
        doc["date"] = datetime.date.today().strftime("%Y-%m-%d")

    result = await db.healthrecords.insert_one(doc)
    inserted = await db.healthrecords.find_one({"_id": result.inserted_id})
    return serialize_doc(inserted)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_record(
    id: str,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    try:
        obj_id = ObjectId(id)
    except Exception:
        return JSONResponse(status_code=404, content={"message": "Record not found"})

    result = await db.healthrecords.delete_one({"_id": obj_id, "user": user_id})
    if result.deleted_count == 0:
        return JSONResponse(status_code=404, content={"message": "Record not found"})
    return Response(status_code=status.HTTP_204_NO_CONTENT)
