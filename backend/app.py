from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ai_module import generate_comprehensive_analysis
from config import OPENAI_API_KEY, MODEL_NAME
from utils import clean_text
from database import engine, get_db, Base
from models import User, BusinessIdea
from auth import authenticate_user, create_access_token, get_current_user, get_password_hash
import json


Base.metadata.create_all(bind=engine)

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

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@app.post("/api/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.username, user.password)
    if not db_user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/analyze-business")
async def analyze_business(data: BusinessPlanInput, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
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
        analysis = await generate_comprehensive_analysis(data.dict())
        # Save to database
        business_idea = BusinessIdea(
            concept=data.concept,
            target_market=data.target_market,
            business_model=data.business_model,
            goals=data.goals,
            analysis=json.dumps(analysis),
            user_id=current_user.id
        )
        db.add(business_idea)
        db.commit()
        db.refresh(business_idea)
        analysis['idea_id'] = business_idea.id
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/my-ideas")
def get_my_ideas(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ideas = db.query(BusinessIdea).filter(BusinessIdea.user_id == current_user.id).all()
    return [{"id": idea.id, "concept": idea.concept, "created_at": idea.created_at} for idea in ideas]

@app.get("/api/idea/{idea_id}")
def get_idea(idea_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    idea = db.query(BusinessIdea).filter(BusinessIdea.id == idea_id, BusinessIdea.user_id == current_user.id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    analysis = json.loads(idea.analysis)
    return {
        "id": idea.id,
        "concept": idea.concept,
        "target_market": idea.target_market,
        "business_model": idea.business_model,
        "goals": idea.goals,
        "analysis": analysis,
        "created_at": idea.created_at
    }
