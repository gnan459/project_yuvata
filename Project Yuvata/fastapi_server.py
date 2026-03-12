"""
FastAPI Server for Instagram Post Evaluator
Exposes endpoints for analyzing Instagram posts combining caption and image text
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

from post_analyzer import PostAnalyzer

app = FastAPI(title="Yuvata Instagram Evaluator API")

# Add CORS middleware to allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InstagramPostRequest(BaseModel):
    """Request model for Instagram post analysis"""
    caption: str
    username: Optional[str] = None


class CredibilityResult(BaseModel):
    """Response model for credibility analysis"""
    claim: str
    credibility_score: float
    risk_level: str
    explanation: str
    evidence: List[str]


class AnalysisResponse(BaseModel):
    """Response model for post analysis"""
    username: Optional[str]
    caption: str
    overall_risk_level: str
    source_credibility: str
    prediction: str
    explanation: str
    has_image_text: Optional[bool] = False



@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.post("/api/evaluate-instagram-post")
async def evaluate_instagram_post(request: InstagramPostRequest) -> AnalysisResponse:
    """
    Evaluate an Instagram post for misinformation
    Analyzes caption text and image text (via OCR) for comprehensive assessment
    
    Args:
        request: Instagram post with caption and optional username
        
    Returns:
        AnalysisResponse: Analysis results including risk level, prediction, source credibility, and explanation
    """
    try:
        if not request.caption or request.caption.strip() == "":
            raise HTTPException(status_code=400, detail="Caption cannot be empty")
        
        # Use the new comprehensive PostAnalyzer
        analyzer = PostAnalyzer()
        analysis_result = analyzer.analyze_post(
            caption=request.caption,
            username=request.username,
            image_paths=None  # Image paths would be passed separately in full implementation
        )
        
        return AnalysisResponse(
            username=request.username,
            caption=request.caption,
            overall_risk_level=analysis_result["overall_risk_level"],
            source_credibility=analysis_result["source_credibility"],
            prediction=analysis_result["prediction"],
            explanation=analysis_result["explanation"],
            has_image_text=analysis_result.get("has_image_text", False)
        )
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing post: {str(e)}")


@app.post("/api/detect-claims")
async def detect_claims(request: InstagramPostRequest) -> Dict:
    """
    Detect claims from Instagram post caption
    
    Args:
        request: Instagram post with caption
        
    Returns:
        Dictionary containing detected claims count
    """
    try:
        if not request.caption or request.caption.strip() == "":
            raise HTTPException(status_code=400, detail="Caption cannot be empty")
        
        claim_detector = ClaimDetector()
        claims = claim_detector.detect_claims(request.caption)
        
        return {
            "caption": request.caption,
            "claim_count": len(claims)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting claims: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
