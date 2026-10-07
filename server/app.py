import os
import uvicorn
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from config.db import get_db
from routes.auth import router as auth_router
from routes.appointments import router as appointments_router
from routes.profile import router as profile_router
from routes.blood_donation import router as blood_router
from routes.health_records import router as records_router
from routes.pets import router as pets_router
from routes.ai import router as ai_router

load_dotenv()

app = FastAPI(title="UniCare API", version="1.0.0")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    get_db()

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Mount routers
app.include_router(auth_router)
app.include_router(appointments_router)
app.include_router(profile_router)
app.include_router(blood_router)
app.include_router(records_router)
app.include_router(pets_router)
app.include_router(ai_router)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": str(exc) or "Server error"}
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"API running on port {port}")
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
