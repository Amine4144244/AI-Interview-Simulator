# AI Code Reviewer Demo Guide

This guide walks you through a complete demo of the AI Code Reviewer system.

## Quick Demo (5 minutes)

### 1. Start All Services

```bash
# Terminal 1
cd ai-code-reviewer
./start-ai-agent.sh

# Terminal 2 (new terminal)
./start-backend.sh

# Terminal 3 (new terminal)
./start-frontend.sh
```

Wait for all services to start (about 10 seconds).

### 2. Open the Application

Navigate to: http://localhost:5173

You should see:
- Professional dark theme UI
- Code editor (Monaco)
- Language selector
- Skill level cards
- Focus area checkboxes

### 3. Run Test Code Reviews

#### Test 1: JavaScript Bug Detection

Paste this code:
```javascript
function processUser(user) {
    var name = user.name
    if (name == undefined) {
        console.log('Invalid user')
    }
    return name.toUpperCase()
}
```

**Settings:**
- Language: JavaScript
- Skill Level: Senior
- Focus: Bugs, Clean Code

**Expected Results:**
- 3-4 issues detected
- Use of `var`
- Loose equality (`==`)
- Potential null reference error
- console.log in production

#### Test 2: Python Security Vulnerabilities

Paste this code:
```python
import os

password = "admin123"

def execute_command(user_input):
    result = eval(user_input)
    return result

def connect_db():
    conn = db.connect(password=password)
    return conn
```

**Settings:**
- Language: Python
- Skill Level: Mid
- Focus: Security, Bugs

**Expected Results:**
- 2+ critical security issues
- Hardcoded password
- Use of eval() (code injection)
- Overall security score < 50

#### Test 3: Performance Anti-Pattern

Paste this code:
```javascript
async function loadAllUsers(userIds) {
    const users = []
    userIds.forEach(async (id) => {
        const user = await fetch(`/api/users/${id}`).then(r => r.json())
        users.push(user)
    })
    return users
}
```

**Settings:**
- Language: JavaScript
- Skill Level: Senior
- Focus: Performance, Bugs

**Expected Results:**
- Async/await in forEach detected
- Race condition warning
- Suggestion to use Promise.all or for...of
- Performance score impacted

### 4. Explore the Results

For each test, check all three tabs:

**Review Tab:**
- Quality scores with colored bars
- Line-by-line issues with severity
- Risk explanations
- Suggested fixes
- Follow-up questions

**Improved Code Tab:**
- Refactored version
- Explanation of changes
- Best practices applied

**Explanation Tab:**
- Senior developer insights
- Architectural considerations
- Trade-off discussions

## Demo Script for Presentations

### Introduction (1 minute)

"I built an AI Code Reviewer that acts as a senior developer mentor. Unlike simple linters, it explains WHY code is wrong, WHAT risks it introduces in production, and HOW a senior engineer would write it differently."

### Architecture Overview (2 minutes)

"The system uses a three-tier architecture:
- React frontend with Monaco editor
- FastAPI backend with rate limiting and SQLite
- AI agent with hybrid analysis (static + LLM)"

Show architecture diagram from README.

### Live Demo (5 minutes)

1. **Show the UI**
   - Clean, professional design
   - Dark mode
   - Real code editor

2. **Paste buggy code**
   - Use Test 1 from above

3. **Configure review**
   - Select skill level (Senior)
   - Choose focus areas

4. **Submit and review results**
   - Show scores
   - Explain an issue in detail
   - Show improved code

### Technical Deep Dive (3 minutes)

"The AI agent uses a hybrid approach:
1. **Static detectors** catch common patterns fast
2. **LLM analysis** provides semantic understanding
3. **Scoring engine** calculates multi-dimensional quality
4. **Graceful degradation** if LLM fails"

Show code from `ai-agent/agent.py`

### Production Considerations (2 minutes)

"This isn't a demo - it's production-ready:
- Rate limiting (10/hour per IP)
- Error handling throughout
- Database persistence
- Structured logging
- API authentication
- Input validation"

### Why This Matters (1 minute)

"This project demonstrates:
- **Real AI reasoning** - not just templates
- **Full-stack skills** - frontend, backend, AI
- **Production patterns** - security, scalability
- **Clean architecture** - testable, maintainable
- **Senior-level thinking** - trade-offs, edge cases"

## Demo Tips

### Do's
✅ Start with simple examples
✅ Explain the "why" behind issues
✅ Show all three result tabs
✅ Mention the hybrid analysis approach
✅ Highlight production features

### Don'ts
❌ Skip the architecture explanation
❌ Only show the frontend
❌ Ignore error handling
❌ Forget to mention graceful degradation
❌ Overcomplicate the demo

## Common Questions

**Q: Why three separate services?**
A: Separation of concerns, independent scaling, security isolation.

**Q: Why not just use ESLint or PyLint?**
A: Those are linters. This explains reasoning, provides mentorship, and adapts to skill level.

**Q: Does it need the Groq API?**
A: No, it works in "mock mode" with static analysis. Groq enhances it with semantic understanding.

**Q: How does it handle different languages?**
A: Language-specific detectors + LLM that understands syntax and semantics for each language.

**Q: Is this production-ready?**
A: Core features are production-grade. For enterprise, add PostgreSQL, Redis, monitoring, and auth.

## Extending the Demo

### Add Custom Rules
Show how to add a new detector in `detectors.py`

### Show the Database
Query SQLite to show stored reviews

### API Demo
Use curl or Postman to hit the API directly

### Performance Test
Run multiple reviews to show rate limiting

## Troubleshooting Demo Issues

### Services Won't Start
- Check ports are free (5173, 8000, 8001)
- Verify Python virtual envs are activated
- Check dependencies are installed

### No Issues Detected
- Verify focus areas are selected
- Check AI agent is running
- Look at backend logs

### Slow Response
- First request initializes everything (slower)
- Subsequent requests are faster
- LLM calls take 2-3 seconds

## Recording the Demo

If recording a video demo:

1. **Preparation**
   - Clean terminal windows
   - Increase font sizes
   - Use dark theme
   - Prepare code snippets in advance

2. **Structure**
   - 1 min intro
   - 2 min architecture
   - 5 min live demo
   - 2 min code walkthrough
   - 1 min conclusion

3. **Tips**
   - Zoom in on important parts
   - Pause for dramatic effect (before results)
   - Explain while waiting for analysis
   - End with call-to-action (GitHub link)

---

**Ready to impress?** 🚀 This demo showcases real engineering skills.
