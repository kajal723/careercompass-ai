from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import re
import io

app = FastAPI(
    title="CareerCompass AI — Intelligence & Placement Readiness Engine",
    description="Backend AI service for Resume Parsing, Skill Gap Extraction, Career Recommendation & Mock Interview Evaluation.",
    version="2.4.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= DATA SCHEMAS =================
class ResumeParseRequest(BaseModel):
    resume_text: str
    target_role: Optional[str] = None
    target_company: Optional[str] = None

class ProfileAnalysisRequest(BaseModel):
    resume_text: Optional[str] = None
    skills: List[str] = []
    target_company: Optional[str] = None
    target_role: Optional[str] = None

class SkillGapRequest(ProfileAnalysisRequest):
    required_skills: Optional[List[str]] = None

class JDAnalyzeRequest(BaseModel):
    jd_text: str
    student_skills: List[str]

class InterviewEvalRequest(BaseModel):
    question_id: str
    question_text: str
    category: str
    student_answer: str
    target_keywords: List[str] = []
    ideal_outline: Optional[str] = ""

class WhatIfRequest(BaseModel):
    base_readiness: int = 68
    active_action_ids: List[str] = []

# ================= SKILL DICTIONARY =================
SKILL_TAXONOMY = {
    "languages": ["Java", "Python", "C++", "C", "JavaScript", "TypeScript", "SQL", "Go", "Kotlin", "Rust"],
    "frameworks": ["Spring Boot", "Spring", "React", "Node.js", "Express", "Django", "Flask", "Hibernate", "JPA"],
    "databases": ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Oracle", "Cassandra", "DynamoDB"],
    "devops_cloud": ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "Git", "GitHub", "Linux", "CI/CD"],
    "core_cs": ["DSA", "Data Structures", "Algorithms", "OOP", "DBMS", "Operating Systems", "Computer Networks", "System Design"],
    "soft_skills": ["Problem Solving", "Communication", "Team Collaboration", "Leadership", "Analytical Thinking"]
}

ROLE_KNOWLEDGE_BASE = [
    {"id": "java-backend", "title": "Java Backend Developer", "category": "Backend Development", "required_skills": ["Java", "Spring Boot", "REST API", "MySQL", "Docker", "Git", "DSA", "DBMS"]},
    {"id": "software-engineer", "title": "Software Engineer", "category": "General Software Engineering", "required_skills": ["DSA", "Java/C++", "OOP", "DBMS", "Operating Systems", "Computer Networks", "System Design"]},
    {"id": "full-stack", "title": "Full Stack Developer", "category": "Web Engineering", "required_skills": ["Java/Node.js", "React", "REST API", "MySQL/MongoDB", "HTML/CSS", "Git", "Docker"]},
    {"id": "cloud-devops", "title": "Cloud / DevOps Engineer", "category": "Cloud Infrastructure", "required_skills": ["Linux", "AWS/Azure", "Docker", "Kubernetes", "CI/CD", "Terraform"]},
]

COMPANY_KNOWLEDGE_BASE = {
    "microsoft": {"name": "Microsoft", "role": "Software Engineer", "required_skills": ["DSA", "Java/C++", "OOP", "DBMS", "Operating Systems", "Computer Networks", "System Design", "Problem Solving"]},
    "amazon": {"name": "Amazon", "role": "Software Development Engineer", "required_skills": ["DSA", "Java/C++", "System Design", "DBMS", "Operating Systems", "Communication"]},
    "google": {"name": "Google", "role": "Software Engineer", "required_skills": ["DSA", "Java/C++/Python", "Operating Systems", "Computer Networks", "Problem Solving"]},
}

# ================= ENDPOINTS =================
@app.get("/")
def root():
    return {
        "status": "online",
        "service": "CareerCompass AI Engine",
        "version": "2.4.0",
        "endpoints": [
            "/api/health",
            "/api/resume/parse",
            "/api/resume/analyze",
            "/api/career/recommend",
            "/api/skill-gap/analyze",
            "/api/company/match",
            "/api/jd/analyze",
            "/api/interview/evaluate",
            "/api/what-if/simulate"
        ]
    }

@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "careercompass-ai-engine"}

@app.post("/api/resume/parse")
def parse_resume(req: ResumeParseRequest):
    if not req.resume_text.strip():
        raise HTTPException(status_code=422, detail="resume_text must contain readable resume content.")
    result = analyze_resume_text(req.resume_text, req.target_role, req.target_company)
    if req.target_role:
        selected_role = next(
            (role for role in ROLE_KNOWLEDGE_BASE if role["title"].lower() == req.target_role.lower()),
            None
        )
        if selected_role:
            matched, missing = compare_skills(
                selected_role["required_skills"],
                {skill["name"] for skill in result["detected_skills"]}
            )
            result["role_match"] = {
                "role": selected_role["title"],
                "match_score": round(len(matched) / len(selected_role["required_skills"]) * 100),
                "matched_skills": matched,
                "missing_skills": missing
            }
    return result

@app.post("/api/career/recommend")
def recommend_careers(req: ProfileAnalysisRequest):
    skills = resolve_profile_skills(req)
    recommendations = []
    for role in ROLE_KNOWLEDGE_BASE:
        matched, missing = compare_skills(role["required_skills"], skills)
        score = round(len(matched) / len(role["required_skills"]) * 100) if role["required_skills"] else 0
        recommendations.append({
            **role,
            "match_score": score,
            "matched_skills": matched,
            "missing_skills": missing,
            "alignment": "High Alignment" if score >= 80 else "Moderate Alignment" if score >= 60 else "Developing Alignment"
        })
    recommendations.sort(key=lambda role: role["match_score"], reverse=True)
    return {"skills": sorted(skills), "recommendations": recommendations}

@app.post("/api/skill-gap/analyze")
def analyze_skill_gap(req: SkillGapRequest):
    skills = resolve_profile_skills(req)
    required_skills = req.required_skills
    if not required_skills and req.target_role:
        selected_role = next((role for role in ROLE_KNOWLEDGE_BASE if role["title"].lower() == req.target_role.lower()), None)
        required_skills = selected_role["required_skills"] if selected_role else []
    required_skills = required_skills or ROLE_KNOWLEDGE_BASE[0]["required_skills"]
    matched, missing = compare_skills(required_skills, skills)
    return {
        "required_skills": required_skills,
        "matched_skills": matched,
        "missing_skills": [{"name": skill, "priority": "High" if index < 2 else "Medium"} for index, skill in enumerate(missing)],
        "coverage_percentage": round(len(matched) / len(required_skills) * 100) if required_skills else 0
    }

@app.post("/api/company/match")
def match_company(req: ProfileAnalysisRequest):
    skills = resolve_profile_skills(req)
    companies = [COMPANY_KNOWLEDGE_BASE[req.target_company.lower()]] if req.target_company and req.target_company.lower() in COMPANY_KNOWLEDGE_BASE else list(COMPANY_KNOWLEDGE_BASE.values())
    results = []
    for company in companies:
        matched, missing = compare_skills(company["required_skills"], skills)
        score = round(len(matched) / len(company["required_skills"]) * 100) if company["required_skills"] else 0
        results.append({**company, "match_score": score, "matched_skills": matched, "missing_skills": missing})
    return {"skills": sorted(skills), "companies": sorted(results, key=lambda company: company["match_score"], reverse=True)}

def resolve_profile_skills(req: ProfileAnalysisRequest):
    skills = set(skill.strip() for skill in req.skills if skill and skill.strip())
    if req.resume_text:
        parsed = analyze_resume_text(req.resume_text, req.target_role, req.target_company)
        skills.update(skill["name"] for skill in parsed["detected_skills"])
    return skills

def compare_skills(required_skills, profile_skills):
    matched = []
    missing = []
    for required in required_skills:
        if any(skill_matches(required, available) for available in profile_skills):
            matched.append(required)
        else:
            missing.append(required)
    return matched, missing

def skill_matches(required, available):
    required_options = re.split(r"[/&]", required.lower())
    available_name = available.lower()
    return any(option.strip() in available_name or available_name in option.strip() for option in required_options)

@app.post("/api/resume/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    target_role: str = Form("Software Engineer"),
    target_company: str = Form("Microsoft")
):
    contents = await file.read()
    filename = (file.filename or "").lower()

    try:
        if filename.endswith(".pdf") or file.content_type == "application/pdf":
            from pypdf import PdfReader
            reader = PdfReader(io.BytesIO(contents))
            text = "\n\n".join(page.extract_text() or "" for page in reader.pages)
        elif filename.endswith(".docx") or file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            from docx import Document
            document = Document(io.BytesIO(contents))
            text = "\n".join(paragraph.text for paragraph in document.paragraphs)
        elif filename.endswith(".txt") or file.content_type == "text/plain":
            text = contents.decode("utf-8", errors="replace")
        else:
            raise HTTPException(status_code=415, detail="Only TXT, PDF, and DOCX files are supported.")
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=422, detail=f"Could not read resume: {error}") from error

    if not text.strip():
        raise HTTPException(status_code=422, detail="No readable text was found in the resume.")

    result = analyze_resume_text(text, target_role, target_company)
    result["raw_text"] = text
    return result

def analyze_resume_text(resume_text: str, target_role: str = "Software Engineer", target_company: str = "Microsoft"):
    text = resume_text.lower()
    
    extracted = {
        "languages": [s for s in SKILL_TAXONOMY["languages"] if re.search(r'\b' + re.escape(s.lower()) + r'\b', text)],
        "frameworks": [s for s in SKILL_TAXONOMY["frameworks"] if re.search(r'\b' + re.escape(s.lower()) + r'\b', text)],
        "databases": [s for s in SKILL_TAXONOMY["databases"] if re.search(r'\b' + re.escape(s.lower()) + r'\b', text)],
        "devops_cloud": [s for s in SKILL_TAXONOMY["devops_cloud"] if re.search(r'\b' + re.escape(s.lower()) + r'\b', text)],
        "core_cs": [s for s in SKILL_TAXONOMY["core_cs"] if re.search(r'\b' + re.escape(s.lower()) + r'\b', text)],
        "soft_skills": [s for s in SKILL_TAXONOMY["soft_skills"] if re.search(r'\b' + re.escape(s.lower()) + r'\b', text)],
    }
    
    all_skills = []
    for cat, items in extracted.items():
        for item in items:
            mentions = len(re.findall(r'\b' + re.escape(item.lower()) + r'\b', text))
            confidence = "Strong" if mentions >= 2 or "projects" in text else "Moderate"
            all_skills.append({
                "name": item,
                "category": cat.replace("_", " ").title(),
                "confidence": confidence,
                "mentions": mentions
            })

    return {
        "extracted_categories": extracted,
        "detected_skills": all_skills,
        "detectedSkills": [
            {**skill, "mentionCount": skill["mentions"]}
            for skill in all_skills
        ],
        "detectedLanguages": extracted["languages"],
        "detectedFrameworks": extracted["frameworks"],
        "detectedDatabases": extracted["databases"],
        "detectedCloud": extracted["devops_cloud"],
        "detectedCoreCS": extracted["core_cs"],
        "detectedSoftSkills": extracted["soft_skills"],
        "skillEvidenceTable": [],
        "summaryStats": {
            "totalSkillsDetected": len(all_skills),
            "strongSkillsCount": sum(1 for skill in all_skills if skill["confidence"] == "Strong"),
            "missingSkillsCount": 0
        },
        "total_skills": len(all_skills),
        "target_role": target_role,
        "target_company": target_company
    }

@app.post("/api/jd/analyze")
def analyze_jd(req: JDAnalyzeRequest):
    lower_jd = req.jd_text.lower()
    student_set = {s.lower() for s in req.student_skills}
    
    keywords = ["Java", "Spring Boot", "REST API", "MySQL", "Docker", "Git", "DSA", "Microservices", "Python", "AWS"]
    detected_reqs = [kw for kw in keywords if re.search(r'\b' + re.escape(kw.lower()) + r'\b', lower_jd) or (kw == "REST API" and ("rest" in lower_jd or "api" in lower_jd))]
    if not detected_reqs:
        detected_reqs = ["Java", "Spring Boot", "REST API", "MySQL", "Docker", "Git"]

    matched = []
    missing = []
    
    for req_item in detected_reqs:
        if any(req_item.lower() in sn or sn in req_item.lower() for sn in student_set):
            matched.append(req_item)
        else:
            missing.append(req_item)

    score = int((len(matched) / len(detected_reqs)) * 100) if detected_reqs else 68

    return {
        "job_match_score": score,
        "required_skills": detected_reqs,
        "matched_skills": matched,
        "missing_skills": missing,
        "match_status": "Strong Match" if score >= 80 else "Moderate Gap" if score >= 60 else "Critical Gap"
    }

@app.post("/api/interview/evaluate")
def evaluate_interview(req: InterviewEvalRequest):
    answer = req.student_answer.lower().strip()
    word_count = len(answer.split())
    
    if not answer:
        return {
            "score": 35,
            "technical_accuracy": 30,
            "conceptual_depth": 30,
            "communication": 40,
            "strength": "Attempted question.",
            "improvement": "Response too brief. Provide technical depth and real-world examples."
        }

    matched_kw = sum(1 for kw in req.target_keywords if kw.lower() in answer)
    kw_coverage = (matched_kw / len(req.target_keywords)) if req.target_keywords else 0.75
    length_mult = min(1.0, max(0.5, word_count / 100.0))

    if req.category == "HR":
        has_star = any(w in answer for w in ["situation", "task", "action", "result", "because", "learned"])
        comm = min(95, int(75 + (kw_coverage * 15) + (15 if has_star else 5)))
        depth = min(92, int(70 + (kw_coverage * 20)))
        tech = min(90, int(75 + (length_mult * 15)))
    else:
        tech = min(96, int(55 + (kw_coverage * 35) + (length_mult * 10)))
        depth = min(94, int(50 + (kw_coverage * 30) + (length_mult * 15)))
        comm = min(95, int(65 + (length_mult * 25)))

    overall = int(tech * 0.4 + depth * 0.3 + comm * 0.3)

    return {
        "score": overall,
        "technical_accuracy": tech,
        "conceptual_depth": depth,
        "communication": comm,
        "strength": "Strong grasp of fundamental mechanics and correct industry terminology." if overall >= 80 else "Good foundational intuition.",
        "improvement": "Deepen discussion on performance trade-offs, scaling limits, or corner cases." if overall >= 80 else "Include specific keywords like " + ", ".join(req.target_keywords[:2])
    }

@app.post("/api/what-if/simulate")
def simulate_what_if(req: WhatIfRequest):
    deltas = {
        "sim-spring-boot": 6,
        "sim-rest-api": 4,
        "sim-project": 6,
        "sim-mock-interview": 3,
        "sim-dsa-50": 4,
        "sim-docker": 3
    }
    gain = sum(deltas.get(action_id, 0) for action_id in req.active_action_ids)
    simulated_score = min(96, req.base_readiness + gain)
    return {
        "base_readiness": req.base_readiness,
        "simulated_score": simulated_score,
        "total_gain": gain
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
