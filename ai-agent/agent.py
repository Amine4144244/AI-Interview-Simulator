"""
AI Code Reviewer & Mentor - Agent

This is the core reasoning system that combines static analysis with LLM reasoning
to provide comprehensive code reviews as a strict senior developer mentor.
"""

import ast
import re
import json
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from detectors import CodeDetector
from scoring import CodeScorer
from prompts import PromptGenerator
from utils import extract_json_from_response, calculate_complexity

@dataclass
class Issue:
    """Represents a code issue found during analysis"""
    line: Optional[int]
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    issue_type: str  # performance, security, correctness, readability, maintainability
    title: str
    description: str
    explanation: str
    suggestion: str

@dataclass
class Score:
    """Represents code quality scores"""
    correctness: int
    readability: int
    maintainability: int
    performance: int
    security: int
    overall: int

@dataclass
class ReviewResult:
    """Complete result of code review"""
    score: Score
    issues: List[Issue]
    improved_code: str
    mentor_explanation: str
    follow_up_questions: List[str]

class AICodeReviewAgent:
    """
    Main orchestrator for AI code review.
    
    This agent combines static analysis with LLM reasoning to provide
    comprehensive, mentor-style code reviews.
    """
    
    def __init__(self):
        self.detector = CodeDetector()
        self.scorer = CodeScorer()
        self.prompt_generator = PromptGenerator()
        
    def analyze_code(
        self, 
        code: str, 
        language: str, 
        skill_level: str, 
        focus: str
    ) -> ReviewResult:
        """
        Main method to analyze code and generate comprehensive review
        
        Args:
            code: Source code to analyze
            language: Programming language
            skill_level: Developer skill level (junior/mid/senior)
            focus: Review focus area
            
        Returns:
            Complete review result with scores, issues, and recommendations
        """
        
        # Step 1: Static Analysis
        static_issues = self.detector.detect_issues(code, language)
        
        # Step 2: Code Complexity Analysis
        complexity_metrics = self._analyze_complexity(code, language)
        
        # Step 3: LLM Analysis
        llm_analysis = self._llm_analysis(code, language, skill_level, focus, static_issues)
        
        # Step 4: Combine Results
        combined_issues = self._combine_issues(static_issues, llm_analysis.get("issues", []))
        
        # Step 5: Scoring
        scores = self.scorer.calculate_scores(
            code, language, combined_issues, complexity_metrics, skill_level
        )
        
        # Step 6: Generate Improved Code
        improved_code = self._generate_improved_code(code, language, llm_analysis.get("improved_code", ""))
        
        # Step 7: Generate Mentor Explanation
        mentor_explanation = self._generate_mentor_explanation(
            code, language, combined_issues, scores, skill_level
        )
        
        # Step 8: Generate Follow-up Questions
        follow_up_questions = self._generate_follow_up_questions(
            code, language, combined_issues, skill_level
        )
        
        return ReviewResult(
            score=scores,
            issues=combined_issues,
            improved_code=improved_code,
            mentor_explanation=mentor_explanation,
            follow_up_questions=follow_up_questions
        )
    
    def _analyze_complexity(self, code: str, language: str) -> Dict[str, Any]:
        """Analyze code complexity metrics"""
        metrics = {
            "cyclomatic_complexity": 0,
            "lines_of_code": len(code.splitlines()),
            "function_count": 0,
            "class_count": 0,
            "nested_depth": 0,
            "duplicate_code": False
        }
        
        if language == "python":
            try:
                tree = ast.parse(code)
                metrics.update(calculate_complexity(tree))
            except SyntaxError:
                pass
        elif language in ["javascript", "typescript"]:
            # Basic JS/TS complexity estimation
            metrics["cyclomatic_complexity"] = code.count("if") + code.count("while") + code.count("for") + code.count("&&") + code.count("||")
            metrics["function_count"] = code.count("function") + code.count("=>")
            metrics["class_count"] = code.count("class")
        
        return metrics
    
    def _llm_analysis(
        self, 
        code: str, 
        language: str, 
        skill_level: str, 
        focus: str,
        static_issues: List[Issue]
    ) -> Dict[str, Any]:
        """Get LLM-based analysis"""
        try:
            prompt = self.prompt_generator.generate_review_prompt(
                code, language, skill_level, focus, static_issues
            )
            
            # Call LLM (this would integrate with Groq)
            # For now, return structured mock data
            return self._get_mock_llm_response(code, language, skill_level, focus)
            
        except Exception as e:
            print(f"LLM analysis error: {e}")
            return {
                "issues": [],
                "improved_code": code,
                "mentor_explanation": "Unable to generate detailed analysis due to service error.",
                "follow_up_questions": []
            }
    
    def _combine_issues(self, static_issues: List[Issue], llm_issues: List[Dict]) -> List[Issue]:
        """Combine static analysis issues with LLM-detected issues"""
        combined = list(static_issues)
        
        # Convert LLM issues to Issue objects and add
        for llm_issue in llm_issues:
            if isinstance(llm_issue, dict):
                combined.append(Issue(
                    line=llm_issue.get("line"),
                    severity=llm_issue.get("severity", "MEDIUM"),
                    issue_type=llm_issue.get("type", "readability"),
                    title=llm_issue.get("title", "Code Issue"),
                    description=llm_issue.get("description", ""),
                    explanation=llm_issue.get("explanation", ""),
                    suggestion=llm_issue.get("suggestion", "")
                ))
        
        return combined
    
    def _generate_improved_code(self, original_code: str, language: str, llm_improved: str) -> str:
        """Generate improved version of the code"""
        if llm_improved and llm_improved != original_code:
            return llm_improved
        
        # Fallback: basic improvements based on static analysis
        improved = original_code
        
        # Add basic formatting if needed
        if language == "python":
            try:
                tree = ast.parse(original_code)
                # Could add AST-based improvements here
            except SyntaxError:
                pass
        
        return improved
    
    def _generate_mentor_explanation(
        self, 
        code: str, 
        language: str, 
        issues: List[Issue], 
        scores: Score, 
        skill_level: str
    ) -> str:
        """Generate holistic mentor explanation"""
        
        # Get score summary
        score_summary = f"Your code scored {scores.overall}/100 overall."
        
        # Identify main areas for improvement
        lowest_scores = sorted([
            ("Correctness", scores.correctness),
            ("Readability", scores.readability),
            ("Maintainability", scores.maintainability),
            ("Performance", scores.performance),
            ("Security", scores.security)
        ], key=lambda x: x[1])[:2]
        
        areas_for_improvement = ", ".join([area for area, _ in lowest_scores])
        
        # Generate mentor tone explanation
        tone_templates = {
            "junior": "As you're learning, focus on the fundamentals. ",
            "mid": "You're on the right track, but there's room to grow. ",
            "senior": "As a senior developer, you should be setting the standard. "
        }
        
        mentor_tone = tone_templates.get(skill_level, "")
        
        explanation = f"{mentor_tone}{score_summary} The main areas that need attention are {areas_for_improvement}."
        
        if issues:
            critical_issues = [issue for issue in issues if issue.severity == "CRITICAL"]
            if critical_issues:
                explanation += f" There are {len(critical_issues)} critical issues that need immediate attention."
        
        return explanation
    
    def _generate_follow_up_questions(
        self, 
        code: str, 
        language: str, 
        issues: List[Issue], 
        skill_level: str
    ) -> List[str]:
        """Generate thoughtful follow-up questions"""
        
        questions = []
        
        # Generic questions based on code analysis
        if "function" in code.lower() or "def " in code:
            questions.append("What is the time complexity of your main algorithm?")
        
        if "if" in code or "else" in code:
            questions.append("Have you considered all the edge cases in your conditional logic?")
        
        if language == "python":
            questions.append("How would you handle exceptions in this code?")
        elif language in ["javascript", "typescript"]:
            questions.append("What happens when this code encounters unexpected input?")
        
        # Skill-level specific questions
        if skill_level == "junior":
            questions.extend([
                "What resources did you use to solve this problem?",
                "Which part of this code took you the longest to figure out?"
            ])
        elif skill_level == "senior":
            questions.extend([
                "How would you scale this solution for production use?",
                "What design patterns could improve this code's maintainability?",
                "How would you test this code thoroughly?"
            ])
        
        return questions[:3]  # Return max 3 questions
    
    def _get_mock_llm_response(self, code: str, language: str, skill_level: str, focus: str) -> Dict[str, Any]:
        """Mock LLM response for demonstration"""
        
        # Generate realistic mock data based on code analysis
        mock_issues = []
        
        # Check for common issues
        if "for" in code and "for" in code:
            mock_issues.append({
                "line": 1,
                "severity": "MEDIUM",
                "type": "performance",
                "title": "Inefficient iteration",
                "description": "Nested loops detected - potential O(n²) complexity",
                "explanation": "Nested iterations can become slow with large datasets",
                "suggestion": "Consider using more efficient data structures or algorithms"
            })
        
        if len(code.splitlines()) > 20:
            mock_issues.append({
                "line": None,
                "severity": "LOW",
                "type": "readability",
                "title": "Long function",
                "description": "Function is quite long and could be broken down",
                "explanation": "Long functions are harder to understand, test, and maintain",
                "suggestion": "Consider splitting into smaller, focused functions"
            })
        
        # Generate improved code
        improved_code = "# Improved version would include:\n"
        improved_code += "# 1. Better variable naming\n"
        improved_code += "# 2. Proper error handling\n"
        improved_code += "# 3. Code comments\n"
        improved_code += "# 4. Performance optimizations\n"
        
        return {
            "issues": mock_issues,
            "improved_code": improved_code,
            "mentor_explanation": f"Your {language} code shows understanding of basic concepts but needs improvement in structure and efficiency.",
            "follow_up_questions": [
                "What is the expected input size for this code?",
                "How would you test this implementation?",
                "What edge cases should this handle?"
            ]
        }

# Global agent instance
agent = AICodeReviewAgent()