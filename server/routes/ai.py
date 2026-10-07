from typing import Optional, List, Dict, Any
from fastapi import APIRouter, status
from pydantic import BaseModel
from services.ai_service import AIService

router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    provider: Optional[str] = "gemini"
    apiKey: Optional[str] = None
    model: Optional[str] = None
    baseUrl: Optional[str] = None
    temperature: Optional[float] = 0.7

class TestKeyRequest(BaseModel):
    provider: str
    apiKey: str
    model: Optional[str] = None

class ReportAnalysisRequest(BaseModel):
    reportText: str
    patientName: Optional[str] = "Patient"
    patientType: Optional[str] = "human" # "human" | "pet"
    species: Optional[str] = None
    provider: Optional[str] = "gemini"
    apiKey: Optional[str] = None
    model: Optional[str] = None

@router.get("/providers")
async def get_providers():
    """Returns available AI providers and free tier details."""
    return AIService.get_providers_info()

@router.post("/chat")
async def chat_with_ai(payload: ChatRequest):
    """Generates an intelligent conversational response from the selected AI provider."""
    raw_messages = [{"role": m.role, "content": m.content} for m in payload.messages]
    result = await AIService.chat_completion(
        messages=raw_messages,
        provider=payload.provider or "gemini",
        api_key=payload.apiKey,
        model=payload.model,
        base_url=payload.baseUrl,
        temperature=payload.temperature or 0.7
    )
    return result

@router.post("/test-key")
async def test_api_key(payload: TestKeyRequest):
    """Validates an AI API key with a ping request."""
    return await AIService.test_key(
        provider=payload.provider,
        api_key=payload.apiKey,
        model=payload.model
    )

@router.post("/analyze-report")
async def analyze_report(payload: ReportAnalysisRequest):
    """Performs deep clinical or veterinary report analysis using AI."""
    system_instruction = f"""You are UniCare's Lead Clinical & Diagnostic AI Analyst.
Analyze the following medical report for a {payload.patientType.upper()} subject named {payload.patientName} {f'({payload.species})' if payload.species else ''}.

Provide a structured, detailed clinical report analysis containing:
1. 📋 Summary of Findings (In clear plain language)
2. 🔬 Biomarker & Test Values Breakdown (Flag Normal vs. Elevated/Abnormal values with reference ranges)
3. 🩺 Health Implications & Potential Diagnoses to discuss with a doctor/vet
4. 💊 Actionable Recommendations & Questions for the Healthcare Provider / Veterinarian
"""
    messages = [
        {"role": "system", "content": system_instruction},
        {"role": "user", "content": f"Please analyze this health report:\n\n{payload.reportText}"}
    ]

    return await AIService.chat_completion(
        messages=messages,
        provider=payload.provider or "gemini",
        api_key=payload.apiKey,
        model=payload.model
    )
