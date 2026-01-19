from typing import List, Dict, Any, Optional
import os
import json
from groq import Groq
from dotenv import load_dotenv
import re
import ast
import astpretty

load_dotenv()

# Initialize Groq client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY or GROQ_API_KEY == "YOUR_REAL_GROQ_API_KEY_HERE":
    print("WARNING: GROQ_API_KEY is not set properly. Using mock responses.")
    groq_client = None
else:
    groq_client = Groq(api_key=GROQ_API_KEY)

def extract_json_from_response(response: str) -> Dict[str, Any]:
    """Extract JSON from LLM response"""
    try:
        # Try to parse the entire response as JSON
        return json.loads(response)
    except json.JSONDecodeError:
        # If that fails, try to extract JSON from the response
        start_idx = response.find('{')
        end_idx = response.rfind('}')
        
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            json_str = response[start_idx:end_idx+1]
            try:
                return json.loads(json_str)
            except json.JSONDecodeError:
                # Clean the string to remove problematic characters
                cleaned_str = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', json_str)
                return json.loads(cleaned_str)
        else:
            raise ValueError("Could not extract valid JSON from response")

def call_groq(prompt: str, temperature: float = 0.3) -> str:
    """Call Groq API with structured prompt"""
    if groq_client is None:
        # Return mock response for demonstration
        return json.dumps({
            "score": {"correctness": 75, "readability": 70, "maintainability": 65, "performance": 60, "security": 80, "overall": 70},
            "issues": [
                {
                    "line": 1,
                    "severity": "MEDIUM",
                    "type": "readability",
                    "title": "Poor variable naming",
                    "description": "Variable names are not descriptive",
                    "explanation": "Clear variable names improve code maintainability and reduce cognitive load",
                    "suggestion": "Use descriptive names like 'user_data' instead of 'data'"
                }
            ],
            "improved_code": "# Improved code would be here",
            "mentor_explanation": "Your code shows basic understanding but needs improvement in naming conventions.",
            "follow_up_questions": ["How would you name variables to be more descriptive?"]
        })
    
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """You are a strict but fair senior developer mentor providing code reviews. 
                    You analyze code thoroughly, detect issues, and provide honest feedback with learning insights.
                    Always respond with valid JSON only. Your tone is direct, educational, and professional."""
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            model="llama-3.1-8b-instant",
            temperature=temperature,
            max_tokens=2000,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        # Return fallback response
        return json.dumps({
            "score": {"correctness": 70, "readability": 70, "maintainability": 70, "performance": 70, "security": 70, "overall": 70},
            "issues": [],
            "improved_code": "Unable to generate improved code due to API error",
            "mentor_explanation": "Code review temporarily unavailable. Please try again later.",
            "follow_up_questions": []
        })

def generate_review_prompt(code: str, language: str, skill_level: str, focus: str) -> str:
    """Generate structured prompt for code review"""
    focus_descriptions = {
        "bugs": "Focus on correctness, logic errors, and potential bugs",
        "performance": "Focus on algorithmic efficiency, time complexity, and optimization opportunities",
        "clean_code": "Focus on code structure, readability, design patterns, and maintainability",
        "security": "Focus on security vulnerabilities, input validation, and secure coding practices",
        "all": "Provide comprehensive review covering all aspects of code quality"
    }
    
    skill_expectations = {
        "junior": "Basic programming concepts, simple logic, fundamental best practices",
        "mid": "Intermediate concepts, some design patterns, good problem-solving approach",
        "senior": "Advanced patterns, architectural decisions, complex problem-solving, industry best practices"
    }
    
    return f"""
    Please review the following {language} code as a strict but fair senior developer mentor.

    CODE TO REVIEW:
    ```{language}
    {code}
    ```

    CONTEXT:
    - Developer skill level: {skill_level}
    - Review focus: {focus_descriptions.get(focus, focus_descriptions["all"])}
    - Expected knowledge level: {skill_expectations.get(skill_level, skill_expectations["mid"])}

    ANALYSIS REQUIREMENTS:
    1. Detect specific issues with line numbers when possible
    2. Score each dimension (0-100): correctness, readability, maintainability, performance, security
    3. Provide improved version of the code
    4. Give holistic mentor explanation
    5. Ask thoughtful follow-up questions

    Return your analysis as a JSON object with this exact structure:
    {{
        "score": {{
            "correctness": <0-100 integer>,
            "readability": <0-100 integer>,
            "maintainability": <0-100 integer>,
            "performance": <0-100 integer>,
            "security": <0-100 integer>,
            "overall": <0-100 integer>
        }},
        "issues": [
            {{
                "line": <line number or null>,
                "severity": "<LOW|MEDIUM|HIGH|CRITICAL>",
                "type": "<performance|security|correctness|readability|maintainability>",
                "title": "<short descriptive title>",
                "description": "<detailed description>",
                "explanation": "<why this matters>",
                "suggestion": "<how to fix>"
            }}
        ],
        "improved_code": "<complete improved code>",
        "mentor_explanation": "<holistic explanation of the review>",
        "follow_up_questions": ["<question 1>", "<question 2>", "<question 3>"]
    }}
    """

def calculate_overall_score(scores: Dict[str, int]) -> int:
    """Calculate weighted overall score"""
    weights = {
        "correctness": 0.25,
        "readability": 0.20, 
        "maintainability": 0.20,
        "performance": 0.20,
        "security": 0.15
    }
    
    weighted_sum = sum(scores[dimension] * weight for dimension, weight in weights.items())
    return round(weighted_sum)

class AICodeReviewer:
    """Main AI code review service"""
    
    def __init__(self):
        self.groq_client = groq_client
    
    async def analyze_code(self, code: str, language: str, skill_level: str, focus: str) -> Dict[str, Any]:
        """Main method to analyze code and generate review"""
        
        # Generate structured prompt
        prompt = generate_review_prompt(code, language, skill_level, focus)
        
        # Call LLM for analysis
        llm_response = call_groq(prompt)
        
        # Parse response
        try:
            review_data = extract_json_from_response(llm_response)
        except Exception as e:
            print(f"Error parsing LLM response: {e}")
            # Return fallback response
            review_data = {
                "score": {
                    "correctness": 70, "readability": 70, "maintainability": 70,
                    "performance": 70, "security": 70, "overall": 70
                },
                "issues": [],
                "improved_code": "Unable to parse improved code",
                "mentor_explanation": "Code review parsing error. Please try again.",
                "follow_up_questions": []
            }
        
        # Ensure overall score is calculated
        if "score" in review_data and "overall" not in review_data["score"]:
            review_data["score"]["overall"] = calculate_overall_score(review_data["score"])
        
        return review_data

# Global instance
ai_reviewer = AICodeReviewer()