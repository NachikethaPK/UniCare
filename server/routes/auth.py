import os
import datetime
import jwt
import bcrypt
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from config.db import get_db
from models.schemas import RegisterRequest, LoginRequest
from utils.helpers import serialize_doc

load_dotenv()

router = APIRouter(prefix="/api/auth", tags=["Auth"])
JWT_SECRET = os.getenv("JWT_SECRET", "default_secret")

def create_jwt_token(user_id: str) -> str:
    payload = {
        "id": user_id,
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest):
    db = get_db()
    existing_user = await db.users.find_one({"email": payload.email})
    if existing_user:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"message": "Email already registered"}
        )
    
    hashed_pw = bcrypt.hashpw(payload.password.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')
    now = datetime.datetime.now(datetime.timezone.utc)
    user_doc = {
        "name": payload.name,
        "email": payload.email,
        "password": hashed_pw,
        "createdAt": now,
        "updatedAt": now
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    token = create_jwt_token(user_id)

    return {
        "token": token,
        "user": {
            "id": user_id,
            "name": payload.name,
            "email": payload.email
        }
    }

@router.post("/login")
async def login(payload: LoginRequest):
    db = get_db()
    user = await db.users.find_one({"email": payload.email})
    if not user:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"message": "Invalid credentials"}
        )
    
    if not bcrypt.checkpw(payload.password.encode('utf-8'), user["password"].encode('utf-8')):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"message": "Invalid credentials"}
        )
    
    user_id = str(user["_id"])
    token = create_jwt_token(user_id)

    return {
        "token": token,
        "user": {
            "id": user_id,
            "name": user.get("name", ""),
            "email": user.get("email", "")
        }
    }
