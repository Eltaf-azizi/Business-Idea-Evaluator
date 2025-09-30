# Business Idea Evaluator

An AI-driven web app that accepts detailed startup ideas or business plans and delivers in-depth multi-dimensional analysis including SWOT analysis, strategic recommendations, market opportunity sizing, competitor comparison, financial forecasts, and risk assessments.

## Features
- Multi-step input form capturing concept, target market, business model, and goals
- Comprehensive AI-generated business analysis
- Interactive web interface

## Setup
1. Set up OpenAI API key in `.env`
2. Install backend dependencies: `cd backend && pip install -r requirements.txt`
3. Run backend: `cd backend && uvicorn app:app --reload`
4. Run frontend: Open `frontend/public/index.html` in browser or serve with a server
