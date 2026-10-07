import io
import re
import datetime
from typing import Optional, Dict, Any, List
from dateutil import parser as date_parser
from services.ai_service import AIService

# Regular expression patterns for clinical report dates
CLINICAL_DATE_PATTERNS = [
    # Explicit Clinical Keywords: e.g. "Collection Date: 12-May-2025" or "Test Date: 2024/11/03"
    r"(?:date\s*of\s*collection|collection\s*date|collected\s*on|sample\s*collected|specimen\s*date|sample\s*date|test\s*date|testing\s*date|exam\s*date|examination\s*date|date\s*of\s*service|visit\s*date|consultation\s*date|procedure\s*date|investigation\s*date|report\s*date|reported\s*on|study\s*date)[:\s]+([A-Za-z0-9\s,\/\.\-]+?)(?=\s{2,}|\n|\r|;|$)",
    
    # DD-Mon-YYYY or DD Mon YYYY: e.g. 14-Aug-2025, 14 August 2025, 05-Feb-2024
    r"\b((?:0?[1-9]|[12][0-9]|3[01])(?:st|nd|rd|th)?[\s\-\/\.](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-\/\.,]+(?:19|20)[0-9]{2})\b",
    
    # Mon-DD-YYYY or Mon DD, YYYY: e.g. Aug 14, 2025, August-14-2025
    r"\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-\/\.](?:0?[1-9]|[12][0-9]|3[01])(?:st|nd|rd|th)?[\s\-\/\.,]+(?:19|20)[0-9]{2})\b",

    # Generic "Date:" followed by date format (if not DOB or Printed)
    r"(?:^|\n|\r)\s*(?:date|dated)[:\s]+([0-9]{1,4}[\/\-\.\s]+[A-Za-z0-9]{1,9}[\/\-\.\s]+[0-9]{2,4})",
    
    # Standalone ISO YYYY-MM-DD
    r"\b((?:19|20)[0-9]{2}[-\/.](?:0[1-9]|1[0-2])[-\/.](?:0[1-9]|[12][0-9]|3[01]))\b",

    # European / US: DD/MM/YYYY or MM/DD/YYYY
    r"\b((?:0[1-9]|[12][0-9]|3[01])[-\/.](?:0[1-9]|1[0-2])[-\/.](?:19|20)[0-9]{2})\b",
]

NEGATIVE_PATTERNS = [
    r"date\s*of\s*birth",
    r"\bdob\b",
    r"birth\s*date",
    r"printed\s*on",
    r"print\s*date",
    r"report\s*printed",
    r"billing\s*date",
    r"invoice\s*date",
    r"expiry\s*date",
    r"valid\s*until",
    r"generated\s*on"
]

def classify_medical_category_and_tags(text: str) -> Dict[str, Any]:
    """Classifies document category and generates relevant human/veterinary medical tags from text content."""
    t_lower = text.lower()
    
    # 1. Scan Reports / Imaging
    if re.search(r"\b(mri|x-?ray|xray|ct scan|computed tomography|ultrasound|sonography|mammogram|echocardiogram|echo|pet scan|radiology|imaging|radiograph|radiographic)\b", t_lower):
        tags = ["Imaging", "Radiology"]
        if "mri" in t_lower: tags.append("MRI")
        elif "ct" in t_lower: tags.append("CT Scan")
        elif "x-ray" in t_lower or "xray" in t_lower or "radiograph" in t_lower: tags.append("X-Ray")
        elif "ultrasound" in t_lower or "sonography" in t_lower or "echo" in t_lower: tags.append("Ultrasound")
        return {"category": "Scan Reports", "tags": tags}

    # 2. Vaccination History (Human & Veterinary)
    if re.search(r"\b(vaccin|immuniz|booster|dose 1|dose 2|rabies|dhpp|fvrcp|bordetella|distemper|parvo|leptospirosis|lyme|felv|fiv|deworm|deworming|covid-?19|covaxin|covishield|polio|mmr|tetanus)\b", t_lower):
        tags = ["Vaccination", "Immunization"]
        if "rabies" in t_lower: tags.append("Rabies")
        elif "dhpp" in t_lower: tags.append("DHPP")
        elif "fvrcp" in t_lower: tags.append("FVRCP")
        elif "bordetella" in t_lower or "kennel cough" in t_lower: tags.append("Bordetella")
        elif "distemper" in t_lower or "parvo" in t_lower: tags.append("Core Vaccine")
        elif "deworm" in t_lower or "deworming" in t_lower: tags.append("Deworming")
        elif "booster" in t_lower: tags.append("Booster")
        elif "covid" in t_lower: tags.append("COVID-19")
        return {"category": "Vaccination History", "tags": tags}

    # 3. Prescriptions & Medication (Human & Veterinary)
    if re.search(r"\b(rx\b|prescription|prescribed|dosage|tablet|capsule|syrup|mg\b|mcg\b|take daily|oral suspension|antibiotic|ointment|drontal|bravecto|nexgard|frontline|apoquel|cerenia|metronidazole|amoxicillin|vetmedin|rimadyl|carprofen|prednisone|eye drops|flea|tick|heartworm)\b", t_lower):
        tags = ["Prescriptions", "Medication"]
        if "antibiotic" in t_lower or "amoxicillin" in t_lower or "metronidazole" in t_lower: tags.append("Antibiotics")
        elif "bravecto" in t_lower or "nexgard" in t_lower or "frontline" in t_lower or "flea" in t_lower or "tick" in t_lower: tags.append("Antiparasitic")
        elif "heartworm" in t_lower or "deworm" in t_lower: tags.append("Deworming")
        elif "pain" in t_lower or "rimadyl" in t_lower or "carprofen" in t_lower: tags.append("Pain Relief")
        return {"category": "Prescriptions", "tags": tags}

    # 4. Lab Reports / Diagnostics
    if re.search(r"\b(blood|cbc|hemoglobin|platelet|wbc|rbc|glucose|fasting|lipid|cholesterol|triglycerides|serum|creatinine|urea|liver function|lft|kft|urine|urinalysis|fecal|stool|pathology|biopsy|haematology|biochemistry|idexx|zoetis|snap test|4dx)\b", t_lower):
        tags = ["Lab Reports", "Pathology"]
        if "cbc" in t_lower or "hemoglobin" in t_lower or "haematology" in t_lower: tags.append("Blood Panel")
        elif "lipid" in t_lower or "cholesterol" in t_lower: tags.append("Lipid Panel")
        elif "glucose" in t_lower or "sugar" in t_lower: tags.append("Diabetes")
        elif "urinalysis" in t_lower or "urine" in t_lower: tags.append("Urinalysis")
        elif "fecal" in t_lower or "stool" in t_lower: tags.append("Fecal Test")
        elif "4dx" in t_lower or "snap test" in t_lower or "heartworm" in t_lower: tags.append("Diagnostic Panel")
        return {"category": "Lab Reports", "tags": tags}

    # 5. Vet Notes / Clinical Consultation
    if re.search(r"\b(veterinary|vet clinic|animal hospital|consultation|checkup|wellness exam|neuter|spay|castration|dental scaling|surgery|physical exam)\b", t_lower):
        tags = ["Vet Notes", "Consultation"]
        if "surgery" in t_lower or "spay" in t_lower or "neuter" in t_lower: tags.append("Surgery")
        elif "dental" in t_lower: tags.append("Dental")
        elif "checkup" in t_lower or "wellness" in t_lower: tags.append("Wellness Check")
        return {"category": "Medical Documents", "tags": tags}

    # Default
    return {"category": "Medical Documents", "tags": ["Medical Document"]}

def extract_text_from_file_bytes(file_bytes: bytes, filename: str) -> str:
    """Extracts raw text from PDF or text-based documents."""
    lower_name = filename.lower()
    if lower_name.endswith(".pdf"):
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            text_parts = []
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text_parts.append(extracted)
            return "\n".join(text_parts)
        except Exception as e:
            print(f"PDF extraction error: {e}")
            return file_bytes.decode("utf-8", errors="ignore")
    else:
        try:
            return file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            return file_bytes.decode("latin-1", errors="ignore")

def parse_and_validate_date(date_str: str) -> Optional[datetime.date]:
    """Parses a messy date string into a normalized datetime.date (1990 to Current Year + 1)."""
    clean_str = date_str.strip().strip(":,.;-()")
    if len(clean_str) < 4:
        return None
    try:
        # If string starts with a 4-digit year (e.g. 2026/04/12 or 2026-04-12)
        starts_with_year = bool(re.match(r"^(?:19|20)[0-9]{2}", clean_str))
        dt = date_parser.parse(clean_str, fuzzy=True, dayfirst=not starts_with_year, yearfirst=starts_with_year)
        current_year = datetime.datetime.now().year
        if 1990 <= dt.year <= current_year + 1:
            return dt.date()
    except Exception:
        pass
    return None

def extract_date_rule_based(text: str) -> Optional[Dict[str, Any]]:
    """Phase 1: Deterministic regex parser with automatic category/tag classification."""
    if not text or not text.strip():
        return None

    lines = text.splitlines()
    candidates = []

    for line in lines:
        line_lower = line.lower()
        if any(re.search(neg, line_lower) for neg in NEGATIVE_PATTERNS):
            continue

        for idx, pattern in enumerate(CLINICAL_DATE_PATTERNS):
            match = re.search(pattern, line, re.IGNORECASE)
            if match:
                extracted_str = match.group(1) if match.groups() else match.group(0)
                parsed_date = parse_and_validate_date(extracted_str)
                if parsed_date:
                    is_explicit_clinical = (idx == 0)
                    candidates.append({
                        "date": parsed_date.strftime("%Y-%m-%d"),
                        "raw": extracted_str,
                        "line": line.strip(),
                        "priority": 10 if is_explicit_clinical else 5
                    })

    cat_info = classify_medical_category_and_tags(text)

    if not candidates:
        return None

    candidates.sort(key=lambda x: x["priority"], reverse=True)
    best = candidates[0]
    confidence = "high" if best["priority"] == 10 else "medium"
    return {
        "date": best["date"],
        "category": cat_info["category"],
        "tags": cat_info["tags"],
        "method": "regex",
        "confidence": confidence,
        "snippet": best["line"]
    }

async def extract_date_with_ai_nlp(text: str, filename: str) -> Optional[Dict[str, Any]]:
    """Phase 2: AI / NLP Contextual Extractor for text with category tagging."""
    prompt = f"""You are an automated medical document date and category analyzer.
Analyze the following medical/veterinary report text from file '{filename}'.
Tasks:
1. Identify the EXACT date on which the medical test, sample collection, scan, or doctor consultation occurred (YYYY-MM-DD).
2. DO NOT return the patient's Date of Birth (DOB) or print timestamps.
3. Classify Category into: "Lab Reports", "Scan Reports", "Prescriptions", "Vaccination History", or "Medical Documents".
4. Generate 2-4 medical tags (e.g. ["Imaging", "MRI"] or ["Blood Test", "Lipid"] or ["Prescription", "Antibiotics"]).

Output format JSON:
{{
  "date": "YYYY-MM-DD",
  "category": "...",
  "tags": ["..."],
  "title": "..."
}}
"""

    try:
        response = await AIService.chat_completion(
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1
        )
        content = response.get("content", "").strip()
        json_match = re.search(r"\{[^{}]*\}", content, re.DOTALL)
        if json_match:
            try:
                import json
                parsed = json.loads(json_match.group(0))
                date_val = parsed.get("date")
                if date_val and re.match(r"^(?:19|20)[0-9]{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$", date_val):
                    return {
                        "date": date_val,
                        "category": parsed.get("category", "Medical Documents"),
                        "tags": parsed.get("tags", ["Medical Document"]),
                        "title": parsed.get("title"),
                        "method": "ai_nlp",
                        "confidence": "high",
                        "model": response.get("model", "gemini"),
                        "snippet": content
                    }
            except Exception:
                pass

        match = re.search(r"\b((?:19|20)[0-9]{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01]))\b", content)
        if match:
            cat_info = classify_medical_category_and_tags(text)
            return {
                "date": match.group(1),
                "category": cat_info["category"],
                "tags": cat_info["tags"],
                "method": "ai_nlp",
                "confidence": "high",
                "model": response.get("model", "gemini"),
                "snippet": content
            }
    except Exception as e:
        print(f"AI Date Extraction Error: {e}")

    return None

async def extract_clinical_date_hybrid(text: str, filename: str = "document.pdf") -> Dict[str, Any]:
    """Hybrid Date Extraction Pipeline for Text/PDFs."""
    regex_result = extract_date_rule_based(text)
    if regex_result and regex_result.get("confidence") == "high":
        return regex_result

    ai_result = await extract_date_with_ai_nlp(text, filename)
    if ai_result and ai_result.get("date"):
        return ai_result

    if regex_result and regex_result.get("date"):
        return regex_result

    cat_info = classify_medical_category_and_tags(text)
    today_str = datetime.date.today().strftime("%Y-%m-%d")
    return {
        "date": today_str,
        "category": cat_info["category"],
        "tags": cat_info["tags"],
        "method": "fallback_today",
        "confidence": "low",
        "snippet": "No clinical date detected; defaulted to current date."
    }

async def extract_clinical_date_from_file_or_text(
    file_bytes: Optional[bytes] = None,
    mime_type: Optional[str] = None,
    filename: str = "document.pdf",
    text: Optional[str] = None
) -> Dict[str, Any]:
    """
    Unified extractor for Images (PNG, JPG, JPEG, WEBP), PDFs, and raw text.
    - If Image file: uses Gemini Vision Multimodal AI to directly read the image and extract date, category, tags, title, doctor.
    - If PDF / Text: uses hybrid regex + AI NLP text model with automated category tagging.
    """
    lower_name = filename.lower()
    is_image = (mime_type and mime_type.startswith("image/")) or any(lower_name.endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"])

    if is_image and file_bytes:
        # Multimodal Gemini Vision OCR & Clinical Date/Category Extraction
        return await AIService.extract_date_from_image_vision(
            image_bytes=file_bytes,
            mime_type=mime_type or "image/jpeg",
            filename=filename
        )

    # For PDFs and text documents
    extracted_text = ""
    if file_bytes:
        extracted_text = extract_text_from_file_bytes(file_bytes, filename)
    elif text:
        extracted_text = text

    if not extracted_text or not extracted_text.strip():
        today_str = datetime.date.today().strftime("%Y-%m-%d")
        return {
            "date": today_str,
            "category": "Medical Documents",
            "tags": ["Medical Document"],
            "method": "fallback_today",
            "confidence": "low",
            "snippet": "No document text found."
        }

    return await extract_clinical_date_hybrid(extracted_text, filename)
