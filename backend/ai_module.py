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

Weaknesses:
1.
2.
...

Opportunities:
1.
2.
...

Threats:
1.
2.
...
"""

    response = openai.ChatCompletion.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
        n=1,
        temperature=0.7,
    )

    text = response.choices[0].message.content.strip()

    swot = parse_swot(text)
    return swot



def parse_swot(text: str) -> dict:
    """
    Parses GPT response text into a dictionary of SWOT categories.
    """

    swot_dict = {"strengths": [], "weaknesses": [], "opportunities": [], "threats": []}
    current_key = None

    lines = text.splitlines()
    for line in lines:
        line_lower = line.strip().lower()
        # Detect section headers
        if line_lower.startswith("strengths:"):
            current_key = "strengths"
            continue
        elif line_lower.startswith("weaknesses:"):
            current_key = "weaknesses"
            continue
        elif line_lower.startswith("opportunities:"):
            current_key = "opportunities"
            continue
        elif line_lower.startswith("threats:"):
            current_key = "threats"
            continue