# 🤖 AI Code Reviewer & Mentor

A production-ready full-stack application that provides professional code reviews using AI. Acts as a strict senior developer mentor, explaining **WHY** code is wrong, **WHAT** risks it introduces, and **HOW** a senior engineer would write it.

## 🎯 Why This Project Matters

This isn't just another AI wrapper - it demonstrates:

1. **Real Engineering Intelligence**: The AI agent doesn't just flag issues, it reasons about them, explains trade-offs, and provides architectural insights
2. **Three-Tier Architecture**: Clean separation between frontend, backend, and AI agent
3. **Hybrid AI Approach**: Combines static analysis with LLM reasoning for reliability
4. **Production Patterns**: Rate limiting, error handling, database persistence, structured logging
5. **Senior-Level Code Review**: Adapts feedback based on skill level (Junior/Mid/Senior)

## 🏗️ Architecture

```
┌─────────────────┐
│   React Frontend│  ← TypeScript, Tailwind, Monaco Editor
│   (Port 5173)   │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  FastAPI Backend│  ← Python, SQLAlchemy, Rate Limiting
│   (Port 8000)   │
└────────┬────────┘
         │ HTTP + API Key
         ▼
┌─────────────────┐
│   AI Agent      │  ← Groq LLM, Static Analysis, Scoring
│   (Port 8001)   │
└─────────────────┘
```

### Frontend (React + TypeScript)
- **Monaco Editor** for syntax-highlighted code input
- **Dark/Light Mode** with persistent theme
- **Three-Tab Interface**: Review, Improved Code, Explanation
- **Skill Level Selector**: Junior, Mid, Senior
- **Focus Area Checkboxes**: Bugs, Performance, Clean Code, Security
- **Real-time Feedback**: Line-by-line issues with severity levels

### Backend (FastAPI + SQLite)
- **REST API** for code review submission and retrieval
- **Rate Limiting**: 10 reviews per hour per IP
- **SQLite Database**: Persistent review history
- **Token-Based Auth**: Simple but extensible authentication
- **Structured Validation**: Pydantic models for type safety

### AI Agent (Python + Groq)
- **Static Detectors**: Pattern matching for common issues
- **LLM Analysis**: Deep semantic understanding via Groq
- **Scoring Engine**: Multi-dimensional quality assessment
- **Graceful Fallback**: Works without LLM in degraded mode
- **Skill-Level Adaptation**: Tailors complexity of feedback

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Groq API Key (optional, falls back to mock mode)

### Installation

#### 1. Frontend
```bash
cd ai-code-reviewer/frontend
npm install
npm run dev
```
Runs on http://localhost:5173

#### 2. Backend
```bash
cd ai-code-reviewer/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your settings

python main.py
```
Runs on http://localhost:8000

#### 3. AI Agent
```bash
cd ai-code-reviewer/ai-agent
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Set environment variables
export GROQ_API_KEY=your_groq_api_key_here
export AI_AGENT_API_KEY=your_internal_api_key

python app.py
```
Runs on http://localhost:8001

## 📝 Usage

1. **Paste your code** into the Monaco editor
2. **Select language** (JavaScript, TypeScript, Python, Java, Go, Rust)
3. **Choose skill level** (Junior, Mid, Senior) - affects review depth
4. **Pick focus areas** (Bugs, Performance, Clean Code, Security)
5. **Click "Review My Code"**
6. **View results** across three tabs:
   - **Review**: Issues with line numbers, severity, explanations
   - **Improved Code**: Refactored version with best practices
   - **Explanation**: Senior developer insights and reasoning

## 🧠 How the AI Agent Works

The agent uses a **hybrid analysis pipeline**:

### 1. Static Detection
Runs pattern matchers for:
- Common bugs (type coercion, null handling)
- Anti-patterns (console.log, TODOs, var usage)
- Security risks (eval, hardcoded credentials, XSS)
- Performance issues (nested loops, string concatenation)

### 2. LLM Analysis (Groq)
Sends code to Mixtral-8x7B with:
- System prompt defining "senior developer" persona
- Skill-level context (junior vs senior expectations)
- Focus area instructions
- Few-shot examples
- Structured JSON output schema

### 3. Scoring Engine
Calculates 0-100 scores for:
- **Correctness**: Logic errors, critical bugs
- **Readability**: Naming, structure, clarity
- **Maintainability**: Complexity, coupling, SOLID principles
- **Performance**: Algorithmic efficiency
- **Security**: Vulnerabilities and risks

### 4. Response Generation
Combines static + LLM results into:
- Line-by-line issues with severity
- Refactored code
- Detailed explanations
- Follow-up questions for deeper thinking

## 🎨 Design Decisions

### Why Three Services?
- **Separation of concerns**: Frontend, business logic, AI analysis
- **Scalability**: Can independently scale AI agent for high load
- **Security**: AI agent runs behind authenticated backend
- **Flexibility**: Easy to swap LLM providers or add new detectors

### Why Hybrid Analysis?
- **Reliability**: Static checks always work, even if LLM fails
- **Speed**: Fast pattern matching for common issues
- **Depth**: LLM provides semantic understanding
- **Cost**: Reduces LLM calls by catching simple issues statically

### Why SQLite?
- **Simplicity**: Zero configuration for MVP
- **Portable**: Database is just a file
- **Upgradeable**: Easy to migrate to PostgreSQL later

### Why Groq?
- **Fast inference**: Near-instant responses
- **Good reasoning**: Mixtral-8x7B balances quality and speed
- **Cost-effective**: Free tier for development

## 🔒 Security Features

- Rate limiting to prevent abuse
- API key authentication between services
- Input validation with Pydantic
- No code execution (analysis only)
- Sensitive data detection in reviews

## 📊 Example Output

For this buggy code:
```javascript
function getData(id) {
  return fetch('/api/' + id).then(r => r.json())
}
```

The agent identifies:
- **Critical**: No error handling
- **High**: Unsafe URL construction (injection risk)
- **Medium**: No input validation
- **Low**: Should use async/await

And provides improved version:
```javascript
async function getData(id) {
  if (!id) throw new Error('ID required');
  try {
    const response = await fetch(`/api/${encodeURIComponent(id)}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}
```

## 🚀 Future Enhancements

- [ ] Support for more languages (C++, Ruby, PHP)
- [ ] Diff view for improved code
- [ ] Custom rule configuration
- [ ] Team collaboration features
- [ ] GitHub integration for PR reviews
- [ ] Historical trend analysis
- [ ] AI explanation of suggested fixes

## 🤝 Contributing

This is a portfolio project demonstrating senior-level engineering. Feel free to fork and adapt for your own use cases.

## 📄 License

MIT License - feel free to use this as inspiration for your own projects.

## 🙏 Acknowledgments

- Built with Groq's fast LLM inference
- Inspired by production code review tools like SonarQube and CodeClimate
- Designed to showcase real AI agent capabilities beyond simple chatbots

---

**Built to demonstrate**: AI agent design, full-stack architecture, production patterns, and senior-level code review intelligence.
