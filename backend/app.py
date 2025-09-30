from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_module import generate_comprehensive_analysis
from config import OPENAI_API_KEY, MODEL_NAME
from utils import clean_text


app = FastAPI(title="Business Idea Evaluator API")


# Allow CORS for frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class BusinessPlanInput(BaseModel):
    concept: str
    target_market: str
    business_model: str
    goals: str


@app.post("/api/analyze-business")
async def analyze_business(data: BusinessPlanInput):
    # Validate each field
    for field, value in data.dict().items():
        cleaned = clean_text(value)
        if not cleaned:
            raise HTTPException(status_code=400, detail=f"{field.replace('_', ' ').title()} cannot be empty")
        if len(cleaned) < 10:
            raise HTTPException(status_code=400, detail=f"{field.replace('_', ' ').title()} must be at least 10 characters long")
        if len(cleaned) > 2000:
            raise HTTPException(status_code=400, detail=f"{field.replace('_', ' ').title()} must be less than 2000 characters")
        setattr(data, field, cleaned)
    try:
        analysis = await generate_comprehensive_analysis(data)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
