# Quick Start Guide

Get the AI Code Reviewer running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Python 3.10+ installed
- Terminal access

## Installation

### 1. Install Frontend Dependencies

```bash
cd ai-code-reviewer/frontend
npm install
```

### 2. Install Backend Dependencies

```bash
cd ai-code-reviewer/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Install AI Agent Dependencies

```bash
cd ai-code-reviewer/ai-agent
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Running the Application

### Option 1: Use Helper Scripts (Recommended)

**Terminal 1 - AI Agent:**
```bash
cd ai-code-reviewer
./start-ai-agent.sh
```

**Terminal 2 - Backend:**
```bash
cd ai-code-reviewer
./start-backend.sh
```

**Terminal 3 - Frontend:**
```bash
cd ai-code-reviewer
./start-frontend.sh
```

### Option 2: Manual Start

**Terminal 1 - AI Agent (Port 8001):**
```bash
cd ai-code-reviewer/ai-agent
source venv/bin/activate
export AI_AGENT_API_KEY=dev-api-key
python app.py
```

**Terminal 2 - Backend (Port 8000):**
```bash
cd ai-code-reviewer/backend
source venv/bin/activate
python main.py
```

**Terminal 3 - Frontend (Port 5173):**
```bash
cd ai-code-reviewer/frontend
npm run dev
```

## Access the Application

Open your browser to: **http://localhost:5173**

## Test the Agent

Run the test suite to verify everything works:

```bash
cd ai-code-reviewer
python test_agent.py
```

You should see:
```
✅ All tests completed successfully!
💡 The AI agent is working correctly and ready for production use.
```

## Using the Application

1. **Paste your code** into the editor
2. **Select language** (JavaScript, Python, TypeScript, etc.)
3. **Choose skill level** (Junior, Mid, Senior)
4. **Pick focus areas** (Bugs, Performance, Clean Code, Security)
5. **Click "Review My Code"**
6. **View results** in three tabs:
   - Review: Issues and scores
   - Improved Code: Refactored version
   - Explanation: Senior developer insights

## Example Test Code

Try pasting this buggy JavaScript:

```javascript
function getData(id) {
    var result = fetch('/api/' + id).then(r => r.json())
    if (result == null) {
        console.log('No data')
    }
    return result
}
```

The AI will identify:
- Use of `var` instead of `const`
- Loose equality (`==`)
- Missing error handling
- No input validation
- console.log in production

## Optional: Groq API Key

For enhanced AI analysis, get a free API key from [Groq](https://groq.com):

```bash
export GROQ_API_KEY=your_key_here
```

**Note:** The agent works in "mock mode" without a Groq key, using static analysis only.

## Troubleshooting

### Port Already in Use
- Backend: Change port in `backend/main.py`
- AI Agent: Change port in `ai-agent/app.py`
- Frontend: Change port in `frontend/vite.config.ts`

### Frontend Won't Connect
- Ensure backend is running on port 8000
- Check CORS settings in `backend/main.py`

### AI Agent Timeout
- Increase timeout in `backend/app/services/ai_service.py`
- Check AI agent is running on port 8001

### Database Issues
- Delete `backend/code_reviews.db` and restart backend

## Next Steps

- Read [ARCHITECTURE.md](ARCHITECTURE.md) for design details
- See [CONTRIBUTING.md](CONTRIBUTING.md) for development guide
- Check [README.md](README.md) for full documentation

## Need Help?

Open an issue on GitHub or check the documentation.

---

**You're ready to go!** 🚀
