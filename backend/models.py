from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class UserProfile(BaseModel):
    name: str = "User"
    gender: str = "Women"
    age: int = 25
    height: float = 165.0
    weight: float = 55.0
    skin_tone: str = "Medium"
    style: str = "Casual"
    occasion: str = "College"
    budget: float = 3500.0
    favorite_colours: List[str] = []
    avoid_colours: List[str] = []
    preferred_fit: str = "Regular"

class ReplaceRequest(BaseModel):
    profile: UserProfile
    category: str
    locked_items: Dict[str, Any]

class RecommendRequest(BaseModel):
    profile: UserProfile

class CheaperRequest(BaseModel):
    profile: UserProfile
    category: str
    locked_items: Dict[str, Any]

class RegenerateRequest(BaseModel):
    profile: UserProfile
    locked_items: Dict[str, Any]

class ExplainRequest(BaseModel):
    profile: UserProfile
    outfit: Dict[str, Any]

class AvatarRenderRequest(BaseModel):
    profile: UserProfile
    outfit: Dict[str, Any]
    pose: str = "Front"
    hair_style: str = "Bob"
    hair_color: str = "Black"
