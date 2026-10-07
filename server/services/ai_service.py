import os
import httpx
from typing import List, Dict, Any, Optional

DEFAULT_SYSTEM_PROMPT = """You are UniCare AI, an advanced, empathetic, and knowledgeable clinical & veterinary health companion.
You provide helpful, evidence-based, and easy-to-understand health information for whole families (humans of all ages) and their companion pets (dogs, cats, birds, and other animals).

Core Guidelines:
1. Medical & Veterinary Accuracy: Provide medically accurate, well-structured, and clear information. When discussing symptoms, medications, lab tests, or pet care, explain concepts in plain language.
2. Structured Format: Use headings, bullet points, and bold text for readability.
3. Multi-Species Awareness:
   - For humans: Address age-appropriate considerations (pediatric vs. adult vs. geriatric).
   - For pets: Distinguish between canine, feline, and other species. Warn about toxic human substances for animals (e.g., chocolate, xylitol, onions, NSAIDs like ibuprofen/paracetamol which are fatal to cats/dogs).
4. Safety & Triage: If a query indicates severe emergency symptoms (e.g., severe chest pain, stroke signs, difficulty breathing, pet collapse, poisoning, pale gums in dogs), clearly flag an EMERGENCY ALERT and advise seeking immediate emergency medical or veterinary care.
5. Empathy & Tone: Be warm, supportive, and reassuring.
6. Professional Disclaimer: Include a brief note that while you provide clinical health guidance, you do not replace a licensed medical doctor or veterinarian's physical examination.
"""

PROVIDERS_CONFIG = {
    "gemini": {
        "name": "Google Gemini",
        "default_model": "gemini-2.5-flash",
        "models": ["gemini-2.5-flash", "gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.7-flash"],
        "base_url": "https://generativelanguage.googleapis.com/v1beta",
        "api_key_env": "GEMINI_API_KEY",
        "is_free": True,
        "free_info": "Free 15 RPM / 1,500 requests per day via Google AI Studio (no credit card required)",
        "get_key_url": "https://aistudio.google.com/app/apikey"
    },
    "groq": {
        "name": "Groq Cloud",
        "default_model": "llama-3.3-70b-versatile",
        "models": ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "deepseek-r1-distill-llama-70b", "mixtral-8x7b-32768"],
        "base_url": "https://api.groq.com/openai/v1",
        "api_key_env": "GROQ_API_KEY",
        "is_free": True,
        "free_info": "Ultra-fast free inference on LPU chips via Groq Console (no credit card required)",
        "get_key_url": "https://console.groq.com/keys"
    },
    "openrouter": {
        "name": "OpenRouter",
        "default_model": "meta-llama/llama-3.3-70b-instruct:free",
        "models": [
            "meta-llama/llama-3.3-70b-instruct:free",
            "deepseek/deepseek-r1:free",
            "google/gemini-2.0-flash-exp:free",
            "mistralai/mistral-7b-instruct:free"
        ],
        "base_url": "https://openrouter.ai/api/v1",
        "api_key_env": "OPENROUTER_API_KEY",
        "is_free": True,
        "free_info": "Access to top open-source free models via OpenRouter",
        "get_key_url": "https://openrouter.ai/keys"
    },
    "custom": {
        "name": "Custom OpenAI-Compatible API",
        "default_model": "default",
        "models": ["default", "llama3", "mistral", "custom"],
        "base_url": "http://localhost:11434/v1",
        "api_key_env": "CUSTOM_AI_API_KEY",
        "is_free": True,
        "free_info": "Connect to local Ollama, LM Studio, vLLM, or any private AI endpoint",
        "get_key_url": "https://ollama.com"
    }
}

class AIService:
    @staticmethod
    def get_providers_info() -> Dict[str, Any]:
        """Returns metadata and free tier registration URLs for all supported providers."""
        return {
            "providers": PROVIDERS_CONFIG,
            "default_provider": "gemini",
            "recommendation": "Google Gemini and Groq are recommended for fast, 100% free medical and pet AI assistance."
        }

    @staticmethod
    def resolve_api_key(provider: str, user_provided_key: Optional[str] = None) -> Optional[str]:
        """Resolves API key with priority: user-passed key > environment variables."""
        if user_provided_key and user_provided_key.strip():
            return user_provided_key.strip()
        
        provider_cfg = PROVIDERS_CONFIG.get(provider.lower(), {})
        env_var = provider_cfg.get("api_key_env")
        if env_var:
            env_val = os.getenv(env_var)
            if env_val:
                return env_val.strip()
        
        # Fallback to general AI keys
        return os.getenv("AI_API_KEY") or os.getenv("OPENAI_API_KEY")

    @staticmethod
    async def chat_completion(
        messages: List[Dict[str, str]],
        provider: str = "gemini",
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        base_url: Optional[str] = None,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        """
        Calls the selected AI provider.
        Uses native Gemini protocol for Google Gemini, and OpenAI-compatible standard for Groq/OpenRouter/Custom.
        """
        provider_key = provider.lower() if provider else "gemini"
        config = PROVIDERS_CONFIG.get(provider_key, PROVIDERS_CONFIG["custom"])
        
        resolved_key = AIService.resolve_api_key(provider_key, api_key)
        selected_model = model or config["default_model"]

        # If user has no API key and is not using local Ollama without auth
        if not resolved_key and provider_key != "custom":
            return {
                "role": "assistant",
                "content": (
                    f"### 🔑 Free AI API Key Setup Required\n\n"
                    f"To chat with **{config['name']}**, please add your free API key in the settings panel above.\n\n"
                    f"**How to get a 100% Free API Key in 30 seconds:**\n"
                    f"1. **Google Gemini (Recommended)**: Visit [Google AI Studio]({config.get('get_key_url', 'https://aistudio.google.com/app/apikey')}), click **Create API Key**, and paste it in settings. (100% Free, no credit card required).\n"
                    f"2. **Groq Cloud (Fastest)**: Visit [Groq Console](https://console.groq.com/keys) to get an ultra-fast free key.\n"
                    f"3. **OpenRouter**: Visit [OpenRouter Keys](https://openrouter.ai/keys) for free access to LLaMA 3.3 and DeepSeek R1.\n\n"
                    f"Once added, you can ask unlimited medical, pediatric, geriatric, and pet veterinary questions!"
                ),
                "provider": provider_key,
                "model": selected_model,
                "needs_key": True
            }

        # Handle Gemini Native generateContent
        if provider_key == "gemini":
            return await AIService._call_gemini_native(
                messages=messages,
                api_key=resolved_key,
                model=selected_model,
                temperature=temperature
            )

        # Handle OpenAI-compatible providers (Groq, OpenRouter, Custom)
        return await AIService._call_openai_compatible(
            messages=messages,
            provider_key=provider_key,
            config=config,
            api_key=resolved_key,
            model=selected_model,
            base_url=base_url,
            temperature=temperature
        )

    @staticmethod
    async def _call_gemini_native(
        messages: List[Dict[str, str]],
        api_key: str,
        model: str,
        temperature: float
    ) -> Dict[str, Any]:
        """Calls Google Gemini API natively via v1beta/models/{model}:generateContent."""
        # Sanitize model name (remove 'models/' prefix if passed)
        clean_model = model.replace("models/", "")
        
        # Fallback list of models if specific model is 404
        model_candidates = [clean_model]
        for fallback in ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-3.7-flash"]:
            if fallback not in model_candidates:
                model_candidates.append(fallback)

        system_instruction = DEFAULT_SYSTEM_PROMPT
        contents = []

        for msg in messages:
            role = msg.get("role")
            content = msg.get("content", "")
            if not content:
                continue

            if role == "system":
                system_instruction = content
            elif role == "user":
                contents.append({
                    "role": "user",
                    "parts": [{"text": content}]
                })
            elif role == "assistant":
                contents.append({
                    "role": "model",
                    "parts": [{"text": content}]
                })

        if not contents:
            contents.append({"role": "user", "parts": [{"text": "Hello"}]})

        payload = {
            "system_instruction": {
                "parts": [{"text": system_instruction}]
            },
            "contents": contents,
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": 2048
            }
        }

        async with httpx.AsyncClient(timeout=45.0) as client:
            last_error = ""
            for m in model_candidates:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={api_key}"
                try:
                    response = await client.post(url, json=payload)
                    if response.status_code == 200:
                        data = response.json()
                        candidates = data.get("candidates", [])
                        if candidates and len(candidates) > 0:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            if parts and len(parts) > 0:
                                return {
                                    "role": "assistant",
                                    "content": parts[0].get("text", "No text generated."),
                                    "provider": "gemini",
                                    "model": m,
                                    "usage": data.get("usageMetadata", {})
                                }
                    elif response.status_code == 400 and "API_KEY_INVALID" in response.text:
                        return {
                            "role": "assistant",
                            "content": "⚠️ **Invalid Gemini API Key**: The provided Google Gemini API key is invalid. Please generate a new free key at [Google AI Studio](https://aistudio.google.com/app/apikey).",
                            "provider": "gemini",
                            "model": m,
                            "error": True
                        }
                    elif response.status_code == 429:
                        return {
                            "role": "assistant",
                            "content": "⚠️ **Rate Limit Exceeded (429)**: Gemini free tier request quota reached. Please wait a moment or switch to Groq in AI Settings.",
                            "provider": "gemini",
                            "model": m,
                            "error": True
                        }
                    else:
                        last_error = response.text
                except Exception as ex:
                    last_error = str(ex)

            return {
                "role": "assistant",
                "content": f"⚠️ **Gemini Service Notice**: {last_error[:300]}",
                "provider": "gemini",
                "model": clean_model,
                "error": True
            }

    @staticmethod
    async def _call_openai_compatible(
        messages: List[Dict[str, str]],
        provider_key: str,
        config: Dict[str, Any],
        api_key: Optional[str],
        model: str,
        base_url: Optional[str],
        temperature: float
    ) -> Dict[str, Any]:
        """Calls OpenAI-compatible endpoints (Groq, OpenRouter, Custom)."""
        endpoint_base = (base_url or config["base_url"]).rstrip("/")
        headers = {"Content-Type": "application/json"}
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"

        if provider_key == "openrouter":
            headers["HTTP-Referer"] = "https://unicare-health.app"
            headers["X-Title"] = "UniCare Health Dashboard"

        formatted_messages = []
        has_system = any(m.get("role") == "system" for m in messages)
        if not has_system:
            formatted_messages.append({"role": "system", "content": DEFAULT_SYSTEM_PROMPT})
        
        for msg in messages:
            if msg.get("role") and msg.get("content"):
                formatted_messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })

        url = f"{endpoint_base}/chat/completions"
        payload = {
            "model": model,
            "messages": formatted_messages,
            "temperature": temperature
        }

        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                response = await client.post(url, headers=headers, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    choices = data.get("choices", [])
                    if choices and len(choices) > 0:
                        return {
                            "role": "assistant",
                            "content": choices[0].get("message", {}).get("content", "No content generated."),
                            "provider": provider_key,
                            "model": model,
                            "usage": data.get("usage", {})
                        }
                elif response.status_code == 401:
                    return {
                        "role": "assistant",
                        "content": f"⚠️ **Authentication Failed (401)**: The API key for **{config['name']}** is invalid. Please check your key in settings.",
                        "provider": provider_key,
                        "model": model,
                        "error": True
                    }
                elif response.status_code == 429:
                    return {
                        "role": "assistant",
                        "content": f"⚠️ **Rate Limit (429)**: Rate limit reached for **{config['name']}**. Please wait a moment.",
                        "provider": provider_key,
                        "model": model,
                        "error": True
                    }
                else:
                    return {
                        "role": "assistant",
                        "content": f"⚠️ **Error {response.status_code}**: {response.text[:250]}",
                        "provider": provider_key,
                        "model": model,
                        "error": True
                    }
        except Exception as e:
            return {
                "role": "assistant",
                "content": f"⚠️ **Connection Error**: {str(e)}",
                "provider": provider_key,
                "model": model,
                "error": True
            }

    @staticmethod
    async def test_key(provider: str, api_key: str, model: Optional[str] = None) -> Dict[str, Any]:
        """Tests an API key with a small ping completion."""
        test_messages = [
            {"role": "user", "content": "Respond with 'API Key is active and working properly!' in one short sentence."}
        ]
        result = await AIService.chat_completion(
            messages=test_messages,
            provider=provider,
            api_key=api_key,
            model=model,
            temperature=0.1
        )
        if result.get("error") or result.get("needs_key"):
            return {
                "success": False,
                "message": result.get("content", "Failed to validate API key.")
            }
        return {
            "success": True,
            "message": f"Successfully connected to {provider.upper()} ({result.get('model')})!",
            "response": result.get("content")
        }

    @staticmethod
    async def extract_date_from_image_vision(
        image_bytes: bytes,
        mime_type: str = "image/jpeg",
        filename: str = "scan.jpg",
        api_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Uses Gemini Vision multimodal AI to OCR the image, identify the clinical examination/test date,
        and extract report metadata (title, doctor name).
        """
        import base64
        import json
        import datetime
        import re

        resolved_key = AIService.resolve_api_key("gemini", api_key)
        if not resolved_key:
            return {
                "date": datetime.date.today().strftime("%Y-%m-%d"),
                "method": "fallback_today",
                "confidence": "low",
                "message": "Gemini API Key required for multimodal image OCR."
            }

        base64_image = base64.b64encode(image_bytes).decode("utf-8")
        valid_mime = mime_type if mime_type and mime_type.startswith("image/") else "image/jpeg"

        prompt = f"""You are an expert clinical and veterinary document OCR analyzer.
Analyze this medical report, lab test, scan, or prescription image ('{filename}').

Tasks:
1. Extract the EXACT date on which this medical examination, lab test, scan, or doctor visit occurred. Format as YYYY-MM-DD. (Do not confuse with DOB or print date).
2. Classify the Document Category into ONE of these exact categories:
   - "Lab Reports" (e.g. Blood test, CBC, Urine, Lipid panel, Pathology, Biopsy, Biochemistry)
   - "Scan Reports" (e.g. X-Ray, MRI, CT Scan, Ultrasound, Mammogram, Echocardiogram, PET scan, Imaging)
   - "Prescriptions" (e.g. Doctor Rx, medication orders, dosages, pharmacy slips)
   - "Vaccination History" (e.g. Vaccine certificates, immunization records, booster shots)
   - "Medical Documents" (e.g. Discharge summary, Doctor consultation notes, Hospital bills, Insurance)
3. Generate 2 to 4 relevant medical/diagnostic tags (e.g. ["Imaging", "Radiology", "MRI"] or ["Blood Test", "Lipid", "Cardiology"] or ["Prescription", "Antibiotics"] or ["Vaccine", "Immunization"]).
4. Extract the Document Title and Doctor/Clinic/Hospital name.

Return ONLY raw JSON in this format:
{{
  "date": "YYYY-MM-DD",
  "category": "Lab Reports | Scan Reports | Prescriptions | Vaccination History | Medical Documents",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "title": "...",
  "doctor": "..."
}}
"""

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt},
                        {
                            "inline_data": {
                                "mime_type": valid_mime,
                                "data": base64_image
                            }
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 2048
            }
        }

        vision_candidates = ["gemini-2.5-flash", "gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.7-flash"]

        try:
            async with httpx.AsyncClient(timeout=40.0) as client:
                for model_name in vision_candidates:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={resolved_key}"
                    try:
                        res = await client.post(url, json=payload)
                        if res.status_code == 200:
                            data = res.json()
                            candidates = data.get("candidates", [])
                            if candidates:
                                parts = candidates[0].get("content", {}).get("parts", [])
                                raw_text = "\n".join(p.get("text", "") for p in parts if p.get("text"))
                                
                                # 1. Attempt JSON parsing
                                json_match = re.search(r"\{[^{}]*\}", raw_text, re.DOTALL)
                                if json_match:
                                    try:
                                        parsed = json.loads(json_match.group(0))
                                        date_val = parsed.get("date")
                                        category_val = parsed.get("category", "Medical Documents")
                                        tags_val = parsed.get("tags", [])
                                        if not isinstance(tags_val, list):
                                            tags_val = [str(tags_val)]

                                        if date_val and re.match(r"^(?:19|20)[0-9]{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$", date_val):
                                            return {
                                                "date": date_val,
                                                "category": category_val,
                                                "tags": tags_val,
                                                "title": parsed.get("title"),
                                                "doctor": parsed.get("doctor"),
                                                "method": "vision_ai",
                                                "confidence": parsed.get("confidence", "high"),
                                                "snippet": f"Extracted via Gemini Vision ({model_name}) from {filename}"
                                            }
                                    except Exception:
                                        pass

                                # 2. ISO Date Regex (YYYY-MM-DD)
                                date_match = re.search(r"\b((?:19|20)[0-9]{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01]))\b", raw_text)
                                if date_match:
                                    return {
                                        "date": date_match.group(1),
                                        "category": "Medical Documents",
                                        "tags": ["Medical Document"],
                                        "method": "vision_ai",
                                        "confidence": "high",
                                        "snippet": f"Extracted via Gemini Vision ({model_name}) from {filename}"
                                    }

                                # 3. Fuzzy date parse on lines
                                from dateutil import parser as dparser
                                for line in raw_text.splitlines():
                                    try:
                                        parsed_dt = dparser.parse(line, fuzzy=True, dayfirst=True)
                                        if 1990 <= parsed_dt.year <= datetime.datetime.now().year + 1:
                                            return {
                                                "date": parsed_dt.strftime("%Y-%m-%d"),
                                                "method": "vision_ai",
                                                "confidence": "medium",
                                                "snippet": line.strip()
                                            }
                                    except Exception:
                                        continue
                        else:
                            print(f"Gemini Vision Model '{model_name}' HTTP Error {res.status_code}: {res.text[:150]}")
                    except Exception as model_err:
                        print(f"Vision candidate '{model_name}' error: {model_err}")
        except Exception as e:
            print(f"Gemini Vision extraction error: {e}")

        today_str = datetime.date.today().strftime("%Y-%m-%d")
        return {
            "date": today_str,
            "method": "fallback_today",
            "confidence": "low",
            "snippet": "Vision could not detect a valid clinical date."
        }
