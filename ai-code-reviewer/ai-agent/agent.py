import os
import json
import logging
from typing import Optional
from groq import Groq

from prompts import get_system_prompt, get_analysis_prompt
from scoring import calculate_scores
from detectors import run_all_detectors

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CodeReviewAgent:
    def __init__(self):
        self.groq_client = None
        groq_api_key = os.getenv("GROQ_API_KEY")
        
        if groq_api_key:
            try:
                self.groq_client = Groq(api_key=groq_api_key)
                logger.info("Groq client initialized successfully")
            except Exception as e:
                logger.warning(f"Failed to initialize Groq client: {e}")
                self.groq_client = None
        else:
            logger.warning("GROQ_API_KEY not found, using mock mode")
    
    def analyze_code(self, code: str, language: str, skill_level: str, focus_areas: list) -> dict:
        logger.info(f"Analyzing {language} code at {skill_level} level")
        
        detected_issues = run_all_detectors(code, language, focus_areas)
        logger.info(f"Static analysis found {len(detected_issues)} issues")
        
        if self.groq_client:
            try:
                ai_analysis = self._analyze_with_groq(code, language, skill_level, focus_areas)
                if ai_analysis:
                    detected_issues.extend(ai_analysis.get("issues", []))
                    improved_code = ai_analysis.get("improved_code", code)
                    explanation = ai_analysis.get("explanation", "")
                    follow_up_questions = ai_analysis.get("follow_up_questions", [])
                else:
                    improved_code, explanation, follow_up_questions = self._generate_mock_output(code, detected_issues, language)
            except Exception as e:
                logger.error(f"Groq analysis failed: {e}")
                improved_code, explanation, follow_up_questions = self._generate_mock_output(code, detected_issues, language)
        else:
            improved_code, explanation, follow_up_questions = self._generate_mock_output(code, detected_issues, language)
        
        scores = calculate_scores(detected_issues, code, improved_code)
        
        return {
            "issues": detected_issues,
            "improved_code": improved_code,
            "explanation": explanation,
            "scores": scores,
            "follow_up_questions": follow_up_questions
        }
    
    def _analyze_with_groq(self, code: str, language: str, skill_level: str, focus_areas: list) -> Optional[dict]:
        try:
            system_prompt = get_system_prompt(skill_level)
            user_prompt = get_analysis_prompt(code, language, skill_level, focus_areas)
            
            response = self.groq_client.chat.completions.create(
                model="mixtral-8x7b-32768",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                max_tokens=4000,
            )
            
            content = response.choices[0].message.content
            
            try:
                json_start = content.find('{')
                json_end = content.rfind('}') + 1
                if json_start >= 0 and json_end > json_start:
                    json_str = content[json_start:json_end]
                    return json.loads(json_str)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON from Groq response: {e}")
                return None
            
        except Exception as e:
            logger.error(f"Groq API call failed: {e}")
            return None
    
    def _generate_mock_output(self, code: str, issues: list, language: str) -> tuple:
        improved_code = self._generate_improved_code(code, issues, language)
        
        explanation = self._generate_explanation(issues, language)
        
        follow_up_questions = [
            "What edge cases have you considered for this implementation?",
            "How would this code perform with 10,000+ concurrent requests?",
            "What testing strategy would you use to validate this code?",
            "How would you monitor this in production?"
        ]
        
        return improved_code, explanation, follow_up_questions
    
    def _generate_improved_code(self, code: str, issues: list, language: str) -> str:
        if not issues:
            return code
        
        improved = code
        
        if language in ['javascript', 'typescript']:
            improved = improved.replace('var ', 'const ')
            improved = improved.replace('==', '===')
            improved = improved.replace('console.log', '// console.log')
        
        elif language == 'python':
            improved = improved.replace('except:', 'except Exception as e:')
        
        return improved
    
    def _generate_explanation(self, issues: list, language: str) -> str:
        if not issues:
            return "Your code looks solid! No major issues detected. Consider adding comprehensive error handling and tests."
        
        explanation = f"""## Code Review Summary

I've identified {len(issues)} issue(s) in your {language} code. Here's what needs attention:

### Critical Issues
"""
        
        critical = [i for i in issues if i["severity"] == "critical"]
        high = [i for i in issues if i["severity"] == "high"]
        medium = [i for i in issues if i["severity"] == "medium"]
        
        if critical:
            for issue in critical:
                explanation += f"\n**Line {issue['line']}: {issue['title']}**\n"
                explanation += f"- Problem: {issue['description']}\n"
                explanation += f"- Risk: {issue['risk']}\n"
                explanation += f"- Fix: {issue['suggestion']}\n"
        
        if high:
            explanation += "\n### High Priority Issues\n"
            for issue in high:
                explanation += f"\n**Line {issue['line']}: {issue['title']}**\n"
                explanation += f"- {issue['description']}\n"
        
        if medium:
            explanation += "\n### Medium Priority Issues\n"
            for issue in medium:
                explanation += f"- Line {issue['line']}: {issue['title']}\n"
        
        explanation += "\n### Recommendations\n"
        explanation += "1. Address critical and high-severity issues immediately\n"
        explanation += "2. Add comprehensive error handling\n"
        explanation += "3. Write unit tests covering edge cases\n"
        explanation += "4. Consider adding logging for production debugging\n"
        
        return explanation


agent = CodeReviewAgent()


def analyze_code_main(code: str, language: str, skill_level: str, focus_areas: list) -> dict:
    return agent.analyze_code(code, language, skill_level, focus_areas)
