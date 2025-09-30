import os
import asyncio
from openai import AsyncOpenAI, APIError, RateLimitError, AuthenticationError
from config import OPENAI_API_KEY, MODEL_NAME

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY is not set")

client = AsyncOpenAI(api_key=OPENAI_API_KEY)

def parse_list(text):
    """Parse bullet points from text"""
    lines = text.strip().split('\n')
    items = [line.strip('- ').strip() for line in lines if line.strip().startswith('-')]
    return items

def parse_section(text, section_name):
    """Parse a section from the response"""
    if section_name + ':' in text:
        start = text.find(section_name + ':')
        next_section = text.find('\n\n', start)
        if next_section == -1:
            next_section = len(text)
        section_text = text[start:next_section].replace(section_name + ':', '').strip()
        return parse_list(section_text) if section_text.startswith('-') else section_text
    return []

async def generate_section(prompt, model=MODEL_NAME):
    """Generate a section using OpenAI"""
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error generating section: {str(e)}"

async def generate_comprehensive_analysis(data: dict) -> dict:
    """
    Calls OpenAI GPT API multiple times to generate comprehensive analysis.
    Returns structured dictionary.
    """

    base_info = f"""
Business Concept: {data['concept']}
Target Market: {data['target_market']}
Business Model: {data['business_model']}
Goals: {data['goals']}
"""

    swot_prompt = f"""
You are an expert business analyst. Based on the following business details, provide a detailed SWOT analysis.

{base_info}

Format your response as:
Strengths:
- Point 1
- Point 2
...

Weaknesses:
- Point 1
- Point 2
...

Opportunities:
- Point 1
- Point 2
...

Threats:
- Point 1
- Point 2
...
"""

    recommendations_prompt = f"""
You are a strategic consultant. Provide personalized strategic recommendations and next steps for this business.

{base_info}

Format as a list of actionable recommendations.
"""

    market_prompt = f"""
You are a market research expert. Provide market opportunity sizing for this business.

{base_info}

Include:
- Estimated total market size
- Target segment size
- Growth projections
- Key market trends
"""

    competitor_prompt = f"""
You are a competitive analyst. Provide competitor comparison for this business.

{base_info}

Include:
- Key competitors
- Competitive advantages
- Market positioning
- Differentiation strategies
"""

    financial_prompt = f"""
You are a financial analyst. Provide financial forecast and budgeting guidance.

{base_info}

Include:
- Revenue projections (3-5 years)
- Cost structure
- Break-even analysis
- Funding requirements
- Key financial metrics
"""

    risk_prompt = f"""
You are a risk management expert. Provide risk assessment and mitigation strategies.

{base_info}

Include:
- High-risk factors
- Mitigation strategies
- Contingency plans
- Risk monitoring recommendations
"""

    # Run all prompts in parallel
    swot_text, rec_text, market_text, comp_text, fin_text, risk_text = await asyncio.gather(
        generate_section(swot_prompt),
        generate_section(recommendations_prompt),
        generate_section(market_prompt),
        generate_section(competitor_prompt),
        generate_section(financial_prompt),
        generate_section(risk_prompt)
    )

    # Parse SWOT
    swot = {
        "strengths": parse_list(swot_text.split('Weaknesses:')[0].replace('Strengths:', '')),
        "weaknesses": parse_list(swot_text.split('Weaknesses:')[1].split('Opportunities:')[0] if 'Opportunities:' in swot_text.split('Weaknesses:')[1] else swot_text.split('Weaknesses:')[1].split('Threats:')[0]),
        "opportunities": parse_list(swot_text.split('Opportunities:')[1].split('Threats:')[0] if 'Threats:' in swot_text.split('Opportunities:')[1] else swot_text.split('Opportunities:')[1]),
        "threats": parse_list(swot_text.split('Threats:')[1]) if 'Threats:' in swot_text else []
    }

    return {
        "swot": swot,
        "strategic_recommendations": parse_list(rec_text),
        "market_opportunity": market_text,
        "competitor_comparison": comp_text,
        "financial_forecast": fin_text,
        "risk_assessment": risk_text
    }
