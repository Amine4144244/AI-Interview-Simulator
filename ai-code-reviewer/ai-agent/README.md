# AI Code Review Agent

This is the autonomous AI agent responsible for analyzing code and providing senior-level code reviews.

## Architecture

The agent uses a hybrid approach:
1. **Static Analysis**: Pattern detection for common issues
2. **LLM Analysis**: Deep semantic understanding via Groq
3. **Scoring Engine**: Multi-dimensional quality assessment

## Components

### agent.py
Main orchestrator that:
- Coordinates static detectors and LLM
- Falls back to mock analysis if LLM unavailable
- Generates comprehensive review output

### detectors.py
Static pattern detection for:
- **Bugs**: Logic errors, type issues, edge cases
- **Anti-patterns**: Code smells, TODOs, debug statements
- **Performance**: Algorithmic complexity, unnecessary operations
- **Security**: Injection vulnerabilities, credential exposure

### scoring.py
Calculates quality scores (0-100) across:
- Correctness
- Readability
- Maintainability
- Performance
- Security

### prompts.py
LLM prompt engineering:
- System prompts tailored to skill level
- Few-shot examples
- Structured JSON output formatting

## Running

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export GROQ_API_KEY=your_groq_api_key
export AI_AGENT_API_KEY=your_internal_api_key

# Run the service
python app.py
```

The agent runs on port 8001 by default.

## API

### POST /analyze
Analyzes code and returns structured review.

**Headers:**
- `X-API-Key`: Internal API key for authentication

**Request:**
```json
{
  "code": "function example() { ... }",
  "language": "javascript",
  "skill_level": "senior",
  "focus_areas": ["bugs", "performance", "security"]
}
```

**Response:**
```json
{
  "issues": [...],
  "improved_code": "...",
  "explanation": "...",
  "scores": {...},
  "follow_up_questions": [...]
}
```

## Design Decisions

1. **Hybrid Analysis**: Combines fast static checks with deep LLM reasoning
2. **Graceful Degradation**: Falls back to pattern matching if LLM fails
3. **Skill-Level Adaptation**: Tailors feedback complexity to user level
4. **Focus Areas**: Allows targeted analysis based on user needs
5. **Structured Output**: Enforces JSON schema for consistent responses

## Why This Matters

This agent demonstrates:
- Autonomous reasoning and critique
- Multi-stage analysis pipeline
- Production-grade error handling
- Real engineering intelligence, not just templates
