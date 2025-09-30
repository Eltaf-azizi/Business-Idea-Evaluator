import os
from openai import AsyncOpenAI, APIError, RateLimitError, AuthenticationError
from config import OPENAI_API_KEY, MODEL_NAME

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY is not set")

client = AsyncOpenAI(api_key=OPENAI_API_KEY)

async def generate_comprehensive_analysis(data: dict) -> dict:
    """
    Calls OpenAI GPT API to generate SWOT analysis for the provided business idea.
    Returns dictionary with keys: strengths, weaknesses, opportunities, threats.
    """

    prompt = f"""
You are an expert business analyst and AI consultant. Given the business plan details below, generate a comprehensive analysis including all requested sections.

Business Concept:
{data['concept']}

Target Market:
{data['target_market']}

Business Model:
{data['business_model']}

Goals:
{data['goals']}

Please provide a detailed analysis in the following format:

SWOT Analysis:
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

Strategic Recommendations:
- Recommendation 1
- Recommendation 2
...

Market Opportunity Sizing:
- Estimated market size: [details]
- Target segment size: [details]
- Growth projections: [details]

Competitor Comparison:
- Key competitors: [list]
- Competitive advantages: [details]
- Market positioning: [details]

Financial Forecast:
- Revenue projections: [details]
- Cost structure: [details]
- Break-even analysis: [details]
- Funding requirements: [details]

Risk Assessment and Mitigation:
- High-risk factors: [list]
- Mitigation strategies: [details]
- Contingency plans: [details]
"""

