# Contributing to AI Code Reviewer & Mentor

## Development Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- Git

### Local Development

1. **Clone and Setup**
```bash
git clone <repository>
cd ai-code-reviewer
```

2. **Frontend Development**
```bash
cd frontend
npm install
npm run dev
```

3. **Backend Development**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

4. **AI Agent Development**
```bash
cd ai-agent
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export GROQ_API_KEY=your_key
python app.py
```

## Project Structure

```
ai-code-reviewer/
├── frontend/          # React + TypeScript UI
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API client
│   │   ├── context/     # React contexts
│   │   └── styles/      # Tailwind CSS
├── backend/           # FastAPI server
│   ├── app/
│   │   ├── routes/      # API endpoints
│   │   ├── models/      # Database models
│   │   ├── services/    # Business logic
│   │   └── utils/       # Helpers
└── ai-agent/          # AI analysis service
    ├── agent.py         # Main orchestrator
    ├── prompts.py       # LLM prompts
    ├── scoring.py       # Quality scoring
    └── detectors.py     # Pattern detection
```

## Adding New Features

### Adding a New Language

1. Update language selector in `frontend/src/pages/ReviewPage.tsx`
2. Add language-specific patterns in `ai-agent/detectors.py`
3. Update prompts in `ai-agent/prompts.py`
4. Test with sample code

### Adding New Detectors

1. Create new detector function in `detectors.py`:
```python
def detect_new_pattern(code: str, language: str) -> list:
    issues = []
    # Your detection logic
    return issues
```

2. Register in `run_all_detectors()`
3. Add tests
4. Update documentation

### Adding New Focus Areas

1. Update `FocusSelector.tsx` with new area
2. Add context in `prompts.py`
3. Create detector if needed
4. Update API validators

## Code Standards

### Frontend
- Use TypeScript strict mode
- Follow React hooks best practices
- Use Tailwind CSS utilities
- Keep components under 200 lines
- Add proper TypeScript types

### Backend
- Follow PEP 8 for Python
- Use type hints
- Add docstrings to functions
- Keep routes thin, logic in services
- Validate all inputs with Pydantic

### AI Agent
- Document all detector patterns
- Keep prompts version controlled
- Test with various code samples
- Handle LLM failures gracefully

## Testing

### Frontend
```bash
npm run test
```

### Backend
```bash
pytest
```

### AI Agent
```bash
python test_agent.py
```

## Pull Request Process

1. Create feature branch from `main`
2. Make your changes
3. Add tests
4. Update documentation
5. Run all tests
6. Submit PR with clear description

## Questions?

Open an issue or reach out to maintainers.
