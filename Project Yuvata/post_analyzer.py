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
        Use Gemini to analyze the post content and determine all 4 metrics.
        
        Args:
            combined_content: Combined caption + image text
            username: Instagram username
            has_image_text: Whether image text was included in analysis
            
        Returns:
            Dictionary with all 4 metrics
        """
        try:
            username_context = f"Instagram account username: {username}\n" if username else ""
            image_note = "\nNote: This analysis includes text extracted from post images via OCR." if has_image_text else "\nNote: This analysis is based on caption text only (no images)."
            
            prompt = f"""You are an expert digital literacy analyst and misinformation detector for social media posts.

INSTAGRAM POST CONTENT:
{combined_content}

{username_context}
TASK: Analyze this Instagram post and determine the following 4 metrics and provide your response as plain text:

1. OVERALL RISK LEVEL: Based on the content, how risky is this post for spreading misinformation?
   Choose one: Low | Medium | High | Critical

2. PREDICTION: Is this post likely Real or Fake/Misleading?
   Choose one: real | fake

3. SOURCE CREDIBILITY: Based on the account username (if provided), how credible is the source?
   Choose one: High | Medium | Low

4. EXPLANATION: Provide a 3-4 sentence detailed explanation that:
   - Justifies why you rated the source credibility as you did
   - Explains why you assigned the overall risk level
   - References specific claims or content concerns from the post
   - Provides actionable advice for users{image_note}

FORMAT YOUR RESPONSE EXACTLY LIKE THIS (with line breaks):
OVERALL_RISK_LEVEL: [Low|Medium|High|Critical]
PREDICTION: [real|fake]
SOURCE_CREDIBILITY: [High|Medium|Low]
EXPLANATION: [Your 3-4 sentence explanation here]"""
            
            print("DEBUG: Calling Gemini API...")
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()
            
            print(f"DEBUG: Gemini raw response:\n{response_text}\n")
            
            # Parse the response line by line
            result = self._parse_gemini_response(response_text)
            
            print(f"DEBUG: Parsed result: {result}")
            
            return result
        
        except Exception as e:
            print(f"ERROR: Gemini API error: {str(e)}")
            import traceback
            traceback.print_exc()
            print("DEBUG: Falling back to fallback analysis")
            return self._generate_fallback_analysis(combined_content, username)
            
    
    def _parse_gemini_response(self, response_text: str) -> Dict:
        """
        Parse Gemini response in format:
        OVERALL_RISK_LEVEL: [value]
        PREDICTION: [value]
        SOURCE_CREDIBILITY: [value]
        EXPLANATION: [value]
        
        Args:
            response_text: Raw response from Gemini
            
        Returns:
            Parsed metrics dictionary
        """
        try:
            lines = response_text.strip().split('\n')
            
            result = {
                "overall_risk_level": "Medium",
                "prediction": "real",
                "source_credibility": "Medium",
                "explanation": ""
            }
            
            explanation_lines = []
            parsing_explanation = False
            
            for line in lines:
                line = line.strip()
                
                if line.startswith("OVERALL_RISK_LEVEL:"):
                    value = line.replace("OVERALL_RISK_LEVEL:", "").strip()
                    if value in ["Low", "Medium", "High", "Critical"]:
                        result["overall_risk_level"] = value
                
                elif line.startswith("PREDICTION:"):
                    value = line.replace("PREDICTION:", "").strip().lower()
                    if value in ["real", "fake"]:
                        result["prediction"] = value
                
                elif line.startswith("SOURCE_CREDIBILITY:"):
                    value = line.replace("SOURCE_CREDIBILITY:", "").strip()
                    if value in ["High", "Medium", "Low"]:
                        result["source_credibility"] = value
                
                elif line.startswith("EXPLANATION:"):
                    parsing_explanation = True
                    explanation_text = line.replace("EXPLANATION:", "").strip()
                    if explanation_text:
                        explanation_lines.append(explanation_text)
                
                elif parsing_explanation and line:
                    explanation_lines.append(line)
            
            result["explanation"] = " ".join(explanation_lines) if explanation_lines else "Analysis completed."
            
            return result
        
        except Exception as e:
            print(f"Warning: Could not parse Gemini response: {str(e)}")
            print(f"Raw response: {response_text}")
            return {
                "overall_risk_level": "Medium",
                "prediction": "real",
                "source_credibility": "Medium",
                "explanation": "Unable to generate detailed analysis. Please try again."
            }
        
        
    
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
