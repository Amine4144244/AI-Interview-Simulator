from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
import os
import json
from groq import Groq
from dotenv import load_dotenv

from security import verify_internal_api_key

load_dotenv()

router = APIRouter()

# Initialize Groq client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY or GROQ_API_KEY == "YOUR_REAL_GROQ_API_KEY_HERE":
    print("WARNING: GROQ_API_KEY is not set properly. Please update the .env file with your actual API key from https://console.groq.com/keys")
    client = None
else:
    client = Groq(api_key=GROQ_API_KEY)

# Pydantic models for request/response
class QuestionRequest(BaseModel):
    role: str
    difficulty: str
    questionNumber: int

class QuestionResponse(BaseModel):
    question: str

class AnswerRequest(BaseModel):
    question: str
    answer: str
    role: str
    difficulty: str

class EvaluationResponse(BaseModel):
    score: int
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]

class ReportRequest(BaseModel):
    role: str
    difficulty: str
    evaluations: List[Dict[str, Any]]

class ReportResponse(BaseModel):
    finalScore: int
    summary: str
    recommendedTopics: List[str]

# Helper function to call Groq API
def call_groq(prompt: str, temperature: float = 0.7) -> str:
    if client is None:
        raise HTTPException(status_code=500, detail="GROQ API key is not configured. Please set up your API key in the .env file.")
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert technical interviewer. Provide structured, helpful responses in JSON format only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.1-8b-instant",  # Updated to a currently supported model
            temperature=temperature,
            max_tokens=1024,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Groq API: {str(e)}")

# Helper function to extract JSON from response
def extract_json(response: str) -> Dict[str, Any]:
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
                import re
                # Remove control characters (except common ones like \n, \t, \r)
                cleaned_str = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', json_str)
                return json.loads(cleaned_str)
        else:
            raise ValueError("Could not extract valid JSON from response")

@router.post("/generate-question", response_model=QuestionResponse)
async def generate_question(request: QuestionRequest, _: str = Depends(verify_internal_api_key)):
    role = request.role
    difficulty = request.difficulty
    question_number = request.questionNumber
    
    # If GROQ client is not available, return mock questions
    if client is None:
        # Return mock questions based on role and difficulty
        mock_questions = {
            "Frontend": [
                "Explain the difference between React and Angular.",
                "What is the virtual DOM and how does it work?",
                "Explain CSS Flexbox and Grid with examples.",
                "How do you optimize a web application's performance?",
                "What are React hooks and how do they work?"
            ],
            "Backend": [
                "Explain the difference between SQL and NoSQL databases.",
                "What is RESTful API design and its principles?",
                "How do you handle authentication and authorization in web applications?",
                "Explain microservices architecture and its benefits.",
                "What is database indexing and why is it important?"
            ],
            "Full-Stack": [
                "How would you design a full-stack application for a blog?",
                "Explain the MVC architectural pattern.",
                "What is CORS and how do you handle it?",
                "How do you handle data validation on both frontend and backend?",
                "Explain JWT authentication flow."
            ],
            "default": [
                "Explain object-oriented programming principles.",
                "What is the difference between synchronous and asynchronous programming?",
                "Explain the concept of closures in JavaScript.",
                "How do you handle error handling in your applications?",
                "What is the difference between let, const, and var in JavaScript?"
            ]
        }
        
        role_questions = mock_questions.get(role, mock_questions["default"])
        question_index = (question_number - 1) % len(role_questions)
        return QuestionResponse(question=role_questions[question_index])
    
    prompt = f"""
    Generate a technical interview question for a {difficulty} level {role} developer.
    This is question number {question_number} in a series of 5 questions.
    
    The question should:
    - Be appropriate for a {difficulty} level {role} position
    - Be specific and clear
    - Test practical knowledge that would be relevant in a real job
    - Not be too easy or too difficult for the specified level
    
    Return your response as a JSON object with the following format:
    {{
        "question": "Your question here"
    }}
    """
    
    try:
        response = call_groq(prompt, temperature=0.8)
        data = extract_json(response)
        return QuestionResponse(question=data["question"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating question: {str(e)}")

@router.post("/evaluate-answer", response_model=EvaluationResponse)
async def evaluate_answer(request: AnswerRequest, _: str = Depends(verify_internal_api_key)):
    question = request.question
    answer = request.answer
    role = request.role
    difficulty = request.difficulty
    
    # If GROQ client is not available, return mock evaluation
    if client is None:
        import random
        score = random.randint(5, 9)  # Generate a random score between 5-9
        
        return EvaluationResponse(
            score=score,
            strengths=["Good understanding of the basic concepts", "Clear explanation"],
            weaknesses=["Could provide more specific examples", "Needs more depth in explanation"],
            suggestions=["Include more practical examples", "Consider edge cases"]
        )
    
    prompt = f"""
    Evaluate the following answer to a technical interview question for a {difficulty} level {role} developer.
    
    Question: {question}
    Answer: {answer}
    
    Provide a comprehensive evaluation with the following:
    1. A score from 0-10 (where 10 is excellent)
    2. A list of strengths in the answer
    3. A list of weaknesses or areas for improvement
    4. Specific suggestions for how the answer could be improved
    
    Return your response as a JSON object with the following format:
    {{
        "score": 7,
        "strengths": ["Strength 1", "Strength 2"],
        "weaknesses": ["Weakness 1", "Weakness 2"],
        "suggestions": ["Suggestion 1", "Suggestion 2"]
    }}
    """
    
    try:
        response = call_groq(prompt, temperature=0.3)
        data = extract_json(response)
        return EvaluationResponse(
            score=data["score"],
            strengths=data["strengths"],
            weaknesses=data["weaknesses"],
            suggestions=data["suggestions"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating answer: {str(e)}")

@router.post("/final-report", response_model=ReportResponse)
async def generate_final_report(request: ReportRequest, _: str = Depends(verify_internal_api_key)):
    role = request.role
    difficulty = request.difficulty
    evaluations = request.evaluations
    
    # If GROQ client is not available, return mock report
    if client is None:
        # Calculate average score from evaluations
        total_score = sum(eval["score"] for eval in evaluations)
        average_score = total_score / len(evaluations) if evaluations else 0
        final_score = int(average_score * 10)  # Convert to 0-100 scale
        
        return ReportResponse(
            finalScore=final_score,
            summary=f"The candidate performed well overall in the {role} interview. With {difficulty} level questions, they showed good understanding of core concepts but could improve in some areas.",
            recommendedTopics=["Practice more coding problems", "Review system design concepts", "Strengthen understanding of fundamentals"]
        )
    
    # Calculate average score
    total_score = sum(eval["score"] for eval in evaluations)
    average_score = total_score / len(evaluations) if evaluations else 0
    final_score = int(average_score * 10)  # Convert to 0-100 scale
    
    # Extract strengths, weaknesses, and suggestions
    all_strengths = []
    all_weaknesses = []
    all_suggestions = []
    
    for eval in evaluations:
        all_strengths.extend(eval.get("strengths", []))
        all_weaknesses.extend(eval.get("weaknesses", []))
        all_suggestions.extend(eval.get("suggestions", []))
    
    prompt = f"""
    Generate a final interview report for a {difficulty} level {role} developer based on the following evaluations:
    
    Evaluations: {json.dumps(evaluations, indent=2)}
    
    The report should include:
    1. A comprehensive summary of the candidate's performance
    2. A list of recommended topics for the candidate to study to improve
    
    The average score is {average_score}/10 (or {final_score}/100).
    
    Return your response as a JSON object with the following format:
    {{
        "finalScore": {final_score},
        "summary": "A comprehensive summary of the candidate's performance...",
        "recommendedTopics": ["Topic 1", "Topic 2", "Topic 3"]
    }}
    """
    
    try:
        response = call_groq(prompt, temperature=0.5)
        data = extract_json(response)
        return ReportResponse(
            finalScore=data["finalScore"],
            summary=data["summary"],
            recommendedTopics=data["recommendedTopics"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating final report: {str(e)}")