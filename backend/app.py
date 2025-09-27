from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_module import generate_swot_analysis
from config import OPENAI_API_KEY, MODEL_NAME


app = FastAPI(title="Business Idea Evaluator API")

