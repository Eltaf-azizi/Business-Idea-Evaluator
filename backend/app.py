from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_module import generate_swot_analysis
from config import OPENAI_API_KEY, MODEL_NAME


app = FastAPI(title="Business Idea Evaluator API")


# Allow CORS for frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class IdeaInput(BaseModel):
    idea: str


@app.post("/api/generate-swot")
async def generate_swot(data: IdeaInput):
    if not data.idea or data.idea.strip() == "":
        raise HTTPException(status_code=400, detail="Startup idea cannot be empty")
    try:
        swot = await generate_swot_analysis(data.idea)
        return {"swot": swot}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
