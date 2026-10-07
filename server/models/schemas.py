from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class AppointmentCreate(BaseModel):
    doctor: str
    speciality: Optional[str] = None
    date: str
    time: str
    status: Optional[str] = "Upcoming"
    reminderEnabled: Optional[bool] = False
    reminderTime: Optional[str] = "1 hour before"

class AppointmentUpdate(BaseModel):
    doctor: Optional[str] = None
    speciality: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    status: Optional[str] = None
    reminderEnabled: Optional[bool] = None
    reminderTime: Optional[str] = None

class ProfileUpdate(BaseModel):
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    family: Optional[List[Dict[str, Any]]] = None
    contacts: Optional[List[Dict[str, Any]]] = None
    notifications: Optional[Dict[str, Any]] = None

class BloodDonorCreate(BaseModel):
    name: str
    bloodGroup: str
    location: str
    phone: str
    availability: Optional[str] = "Available"

class BloodRequestCreate(BaseModel):
    bloodGroup: str
    urgency: str
    location: str
    status: Optional[str] = "Pending"

class BloodRequestStatusUpdate(BaseModel):
    status: str

class HealthRecordCreate(BaseModel):
    title: str
    category: str
    date: str
    doctor: Optional[str] = None
    fileName: Optional[str] = None
    fileUrl: Optional[str] = None
    tags: Optional[List[str]] = []
    summary: Optional[str] = None

class PetCreate(BaseModel):
    name: str
    species: str
    breed: Optional[str] = None
    age: Optional[str] = None
    owner: Optional[str] = None
    photo: Optional[str] = None

class PetVaccinationCreate(BaseModel):
    pet: str
    name: str
    date: str
    nextDue: str
    reminder: Optional[str] = "Active"

class PetRecordCreate(BaseModel):
    pet: str
    title: str
    category: str = "Medical Documents"
    date: str
    veterinarian: Optional[str] = None
    fileName: Optional[str] = None
    fileUrl: Optional[str] = None
    tags: Optional[List[str]] = []
    summary: Optional[str] = None
