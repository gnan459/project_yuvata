"""
Comprehensive Instagram Post Analyzer
Simplified architecture:
1. Extract caption text
2. Extract image text using OCR
3. Use Gemini to analyze combined content and return all 4 metrics

Metrics returned:
- Overall Risk Level (Low/Medium/High/Critical)
- Prediction (Real/Fake)
- Source Credibility (High/Medium/Low)
- Explanation (Detailed justification)
"""

from typing import Optional, Dict, List
import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path
import json

# Load environment variables from .env file
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)


class PostAnalyzer:
    """Comprehensive analyzer for Instagram posts using Gemini directly."""
    
    def __init__(self):
        """Initialize the post analyzer with Gemini API."""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('models/gemini-2.0-flash')
    
    def extract_caption(self, caption: str) -> str:
        """
        Extract and clean caption text.
        
        Args:
            caption: Raw caption text
            
        Returns:
            Cleaned caption text
        """
        if not caption:
            return ""
        return caption.strip()
    
    def extract_image_text(self, image_paths: Optional[List[str]] = None) -> str:
        """
        Extract text from images using OCR.
        
        Args:
            image_paths: List of image file paths
            
        Returns:
            Combined OCR-extracted text from all images
        """
        if not image_paths:
            return ""
        
        try:
            from ocr_extractor import OCRExtractor
            
            ocr_extractor = OCRExtractor()
            if not ocr_extractor.tesseract_available:
                return ""
            
            combined_text = ""
            for image_path in image_paths:
                try:
                    text = ocr_extractor.extract_text_from_image(image_path)
                    if text:
                        combined_text += f"\n{text}"
                except Exception as e:
                    print(f"Warning: Could not extract text from {image_path}: {str(e)}")
            
            return combined_text.strip()
        except Exception as e:
            print(f"Warning: OCR extraction failed: {str(e)}")
            return ""
    
    def combine_content(self, caption: str, image_text: str) -> str:
        """
        Combine caption and OCR-extracted image text.
        
        Args:
            caption: Caption text
            image_text: OCR-extracted image text
            
        Returns:
            Combined content for analysis
        """
        parts = []
        
        if caption:
            parts.append(f"CAPTION:\n{caption}")
        
        if image_text:
            parts.append(f"IMAGE TEXT (OCR):\n{image_text}")
        
        return "\n\n".join(parts) if parts else ""
    
    def analyze_post(
        self,
        caption: str,
        username: Optional[str] = None,
        image_paths: Optional[List[str]] = None
    ) -> Dict:
        """
        Comprehensive analysis of Instagram post using Gemini.
        
        Args:
            caption: Instagram post caption
            username: Instagram account username
            image_paths: List of image file paths to analyze with OCR
            
        Returns:
            Dictionary with analysis results including:
            - overall_risk_level: Low/Medium/High/Critical
            - prediction: real/fake
            - source_credibility: High/Medium/Low
            - explanation: Detailed justification
            - content_summary: Caption + OCR text used for analysis
            - has_image_text: Whether image text was analyzed
        """
        try:
            # Step 1: Extract and combine content
            caption_text = self.extract_caption(caption)
            image_text = self.extract_image_text(image_paths)
            combined_content = self.combine_content(caption_text, image_text)
            
            if not combined_content:
                return {
                    "overall_risk_level": "Low",
                    "prediction": "real",
                    "source_credibility": "High",
                    "explanation": "No content to analyze.",
                    "content_summary": "",
                    "has_image_text": False
                }
            
            # Step 2: Use Gemini to analyze the combined content and determine all metrics
            analysis_result = self._analyze_with_gemini(
                combined_content=combined_content,
                username=username,
                has_image_text=bool(image_text)
            )
            
            return {
                "overall_risk_level": analysis_result.get("overall_risk_level", "Medium"),
                "prediction": analysis_result.get("prediction", "real"),
                "source_credibility": analysis_result.get("source_credibility", "Medium"),
                "explanation": analysis_result.get("explanation", "Unable to generate analysis."),
                "content_summary": combined_content[:300] + "..." if len(combined_content) > 300 else combined_content,
                "has_image_text": bool(image_text)
            }
        
        except Exception as e:
            print(f"Error analyzing post: {str(e)}")
            return {
                "overall_risk_level": "Medium",
                "prediction": "real",
                "source_credibility": "Medium",
                "explanation": f"Error: {str(e)}",
                "content_summary": "",
                "has_image_text": False
            }
    
    def _analyze_with_gemini(
        self,
        combined_content: str,
        username: Optional[str] = None,
        has_image_text: bool = False
    ) -> Dict:
        """
        Hybrid analysis: Use formulas for metrics, Gemini only for explanation.
        This drastically reduces API calls and token usage.
        
        Args:
            combined_content: Combined caption + image text
            username: Instagram username
            has_image_text: Whether image text was included in analysis
            
        Returns:
            Dictionary with all 4 metrics
        """
        # Step 1: Calculate metrics using formulas (no API calls)
        metrics = self._calculate_metrics_with_formulas(combined_content, username)
        
        # Step 2: Only call Gemini for explanation (minimal tokens)
        try:
            print("DEBUG: Calling Gemini API for explanation only...")
            
            explanation = self._get_gemini_explanation(
                combined_content=combined_content,
                metrics=metrics,
                username=username,
                has_image_text=has_image_text
            )
            
            metrics["explanation"] = explanation
            print(f"DEBUG: Parsed result: {metrics}")
            
            return metrics
        
        except Exception as e:
            print(f"ERROR: Gemini API error for explanation: {str(e)}")
            # Use fallback explanation if Gemini fails
            metrics["explanation"] = self._generate_fallback_explanation(combined_content, metrics, username)
            print("DEBUG: Using fallback explanation")
            return metrics
    
    def _calculate_metrics_with_formulas(self, content: str, username: Optional[str]) -> Dict:
        """
        Calculate all metrics using heuristic formulas (no API calls).
        
        Args:
            content: Combined caption + image text
            username: Instagram username
            
        Returns:
            Dictionary with calculated metrics
        """
        content_lower = content.lower()
        
        # === OVERALL RISK LEVEL ===
        risk_keywords = {
            "critical": [
                "urgent", "dying", "destroyed", "shocking truth", "they dont want", "banned", "classified",
                "cure instantly", "cures instantly", "miracle cure", "miracle", "secret revealed", "governments hiding",
                "hiding the truth", "before they remove", "share before", "they don't want"
            ],
            "high": [
                "click here", "limited offer", "buy now", "limited time", "fake", "hoax", "scam", "warning",
                "free iphone", "free giveaway", "first 1000", "hurry", "only available", "cure naturally",
                "naturally cure", "pharmaceutical companies", "big pharma", "aliens landed", "conspiracy", "confirmed aliens",
                "secret fruit", "doctors hate", "naturally in", "doctor reveal"
            ],
            "medium": [
                "check this out", "you wont believe", "amazing", "incredible", "proof", "evidence",
                "free", "giveaway", "win", "prize", "exclusive", "confirmed", "secretly", "scientists", "reveal"
            ]
        }
        
        risk_score = 0
        for level, keywords in risk_keywords.items():
            for kw in keywords:
                if kw in content_lower:
                    if level == "critical":
                        risk_score += 3
                    elif level == "high":
                        risk_score += 2
                    elif level == "medium":
                        risk_score += 1
        
        if risk_score >= 6:
            overall_risk_level = "Critical"
        elif risk_score >= 4:
            overall_risk_level = "High"
        elif risk_score >= 2:
            overall_risk_level = "Medium"
        else:
            overall_risk_level = "Low"
        
        # === PREDICTION (Real/Fake) ===
        fake_indicators = [
            "fake", "photoshopped", "deepfake", "manipulated", "hoax", "myth", "debunked", "false",
            "giveaway", "free iphone", "apple giveaway", "conspiracy", "aliens", "hiding", "scam",
            "cure instantly", "miracle cure", "secret revealed", "governments hiding", "before they remove"
        ]
        real_indicators = ["verified", "official", "authentic", "real", "genuine", "confirmed", "nasa", "science"]
        
        fake_count = sum(1 for ind in fake_indicators if ind in content_lower)
        real_count = sum(1 for ind in real_indicators if ind in content_lower)
        
        # More suspicious keywords = likely fake
        if fake_count > real_count or risk_score >= 4:
            prediction = "fake"
        else:
            prediction = "real"
        
        # === SOURCE CREDIBILITY ===
        credible_terms = ["official", "verified", "expert", "news", "journalist", "doctor", "scientist", "institution", "nasa", "government"]
        suspicious_terms = [
            "anonymous", "leaked", "insider", "unknown", "classified", "conspiracy", "truth", "giveaway", "free",
            "secret", "hate", "don't want", "doesn't want", "pharmaceutical", "pharma", "naturally", "naturally cure",
            "cure naturally", "simple trick", "don't know"
        ]
        
        credible_score = sum(1 for term in credible_terms if term in content_lower)
        suspicious_score = sum(1 for term in suspicious_terms if term in content_lower)
        
        if username:
            username_lower = username.lower()
            if any(term in username_lower for term in ["official", "verified", "news", "nasa"]):
                credible_score += 2
            if any(term in username_lower for term in ["fake", "troll", "spam", "conspiracy", "truth_channel", "giveaway", "free"]):
                suspicious_score += 3  # Higher penalty for suspicious usernames
        
        # Suspicious takes priority over credible if suspicious_score is high
        if suspicious_score >= 3:
            source_credibility = "Low"
        elif credible_score >= 2:
            source_credibility = "High"
        elif suspicious_score >= 1:
            source_credibility = "Low"
        else:
            source_credibility = "Medium"
        
        return {
            "overall_risk_level": overall_risk_level,
            "prediction": prediction,
            "source_credibility": source_credibility,
            "explanation": ""  # Will be filled by Gemini or fallback
        }
    
    def _get_gemini_explanation(
        self,
        combined_content: str,
        metrics: Dict,
        username: Optional[str],
        has_image_text: bool
    ) -> str:
        """
        Get explanation from Gemini with minimal tokens.
        
        Args:
            combined_content: Combined caption + image text
            metrics: Already calculated metrics
            username: Instagram username
            has_image_text: Whether image text was included
            
        Returns:
            Explanation from Gemini
        """
        username_context = f"Instagram username: {username}\n" if username else ""
        image_note = " (includes OCR text from images)" if has_image_text else " (caption only)"
        
        # Compact prompt to minimize tokens
        prompt = f"""Briefly justify (2-3 sentences) why this Instagram post is {metrics['overall_risk_level'].lower()} risk and {metrics['source_credibility'].lower()} credibility{image_note}:

{combined_content[:500]}"""
        
        print(f"DEBUG: Gemini prompt:\n{prompt}\n")
        
        response = self.model.generate_content(prompt)
        explanation = response.text.strip()
        
        print(f"DEBUG: Gemini response:\n{explanation}\n")
        
        return explanation if explanation else "Analysis completed."
    
    def _generate_fallback_explanation(self, content: str, metrics: Dict, username: Optional[str]) -> str:
        """
        Generate fallback explanation when Gemini fails.
        """
        risk = metrics["overall_risk_level"]
        credibility = metrics["source_credibility"]
        prediction = metrics["prediction"]
        
        return f"This post appears {risk.lower()} risk with {credibility.lower()} source credibility. " \
               f"The content is likely {prediction}. Please verify with official sources before sharing."
            
    
    def _generate_fallback_analysis(self, combined_content: str, username: Optional[str]) -> Dict:
        """
        Generate fallback analysis when Gemini API fails.
        
        Args:
            combined_content: Combined caption + image text
            username: Instagram username
            
        Returns:
            Fallback metrics
        """
        # Simple heuristic-based fallback
        content_lower = combined_content.lower()
        
        # Check for suspicious keywords
        suspicious_keywords = ["urgent", "click here", "limited offer", "buy now", "free", "guaranteed", "instant"]
        suspicious_count = sum(1 for kw in suspicious_keywords if kw in content_lower)
        
        # Determine risk level based on suspicious content
        if suspicious_count >= 3:
            risk_level = "High"
            prediction = "fake"
        elif suspicious_count >= 1:
            risk_level = "Medium"
            prediction = "real"
        else:
            risk_level = "Low"
            prediction = "real"
        
        # Determine source credibility
        if username and any(word in username.lower() for word in ["official", "verified", "news"]):
            source_credibility = "High"
        elif username:
            source_credibility = "Medium"
        else:
            source_credibility = "Low"
        
        explanation = f"This post has been marked as {risk_level} risk. The account credibility is {source_credibility}. Please verify the information before sharing."
        
        return {
            "overall_risk_level": risk_level,
            "prediction": prediction,
            "source_credibility": source_credibility,
            "explanation": explanation
        }
