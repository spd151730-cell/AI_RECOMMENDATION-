from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
import uvicorn
import io
import os
from pydantic import BaseModel

from backend.engine import StyleEngine
from backend.models import (
    UserProfile,
    RecommendRequest,
    ReplaceRequest,
    CheaperRequest,
    RegenerateRequest,
    ExplainRequest,
    AvatarRenderRequest
)

app = FastAPI(title="STYLEAI Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Engine
current_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(os.path.dirname(current_dir), "data", "fashion_dataset.csv")
engine = StyleEngine(data_path=data_path)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "STYLEAI"}

@app.post("/api/profile")
def save_profile(profile: UserProfile):
    # In a real system, save to DB. For now, just return it.
    return {"status": "success", "profile": profile.dict()}

@app.post("/api/analyze-skin-tone")
async def analyze_skin_tone(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        result = engine.analyze_skin_tone(contents)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/recommend")
def recommend(req: RecommendRequest):
    outfits = engine.generate(req.profile.dict(), limit=3)
    return {"outfits": outfits}

@app.post("/api/outfit/lock")
def lock_outfit(req: ReplaceRequest):
    return {"status": "locked", "category": req.category}

@app.post("/api/outfit/replace")
def replace_outfit(req: ReplaceRequest):
    candidates = engine.replace(outfit={"items": req.locked_items}, category=req.category, locked_items=req.locked_items, profile=req.profile.dict())
    return {"candidates": candidates}

@app.post("/api/outfit/cheaper")
def cheaper_outfit(req: CheaperRequest):
    alternative = engine.cheaper(outfit={"items": req.locked_items}, category=req.category)
    return {"alternative": alternative}

@app.post("/api/outfit/regenerate")
def regenerate_outfit(req: RegenerateRequest):
    # Pass an empty set for exclude_signatures for now. 
    # Frontend could pass history to avoid repeats.
    new_outfits = engine.regenerate(profile=req.profile.dict(), locked_items=req.locked_items, exclude_signatures=set())
    return {"outfits": new_outfits}

@app.post("/api/outfit/explain")
def explain_outfit(req: ExplainRequest):
    explanation = engine.explain(req.outfit, req.profile.dict())
    return explanation

@app.post("/api/avatar/render")
def render_avatar(req: dict):
    from backend.avatar_engine import render_fashion_avatar_svg
    svg = render_fashion_avatar_svg(req)
    return {"svg_html": svg}

@app.post("/api/finalize")
def finalize(req: ExplainRequest):
    return {"status": "finalized", "outfit": req.outfit}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
