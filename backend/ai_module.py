import os
import openai
from config import OPENAI_API_KEY, MODEL_NAME

openai.api_key = OPENAI_API_KEY

async def generate_swot_analysis(idea_text: str) -> dict:
    """
    Calls OpenAI GPT API to generate SWOT analysis for the provided business idea.
    Returns dictionary with keys: strengths, weaknesses, opportunities, threats.
    """

    prompt = f"""
You are an expert business analyst. Given the startup idea below, generate a detailed SWOT analysis.

Startup Idea:
{idea_text}

Format the response as:

Strengths:
1.
2.
...