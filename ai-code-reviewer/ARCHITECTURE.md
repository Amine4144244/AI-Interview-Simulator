# Architecture Documentation

## System Overview

AI Code Reviewer & Mentor is a three-tier application demonstrating production-grade full-stack development with AI integration.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│                     React SPA (Port 5173)                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/REST
┌───────────────────────────▼─────────────────────────────────────┐
│                       FastAPI Backend                           │
│                        (Port 8000)                              │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │   Routes    │─▶│   Services   │─▶│   SQLite Database   │   │
│  └─────────────┘  └──────────────┘  └─────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP + API Key
┌───────────────────────────▼─────────────────────────────────────┐
│                       AI Agent Service                          │
│                        (Port 8001)                              │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │  Detectors  │  │   Scoring    │  │    Groq LLM API     │   │
│  └─────────────┘  └──────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (React + TypeScript)

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Monaco Editor for code input
- Axios for HTTP requests
- Context API for state management

**Key Components:**

1. **ReviewPage** - Main orchestrator
   - Manages review workflow
   - Coordinates all UI components
   - Handles API communication

2. **CodeEditor** - Monaco Editor wrapper
   - Syntax highlighting
   - Language selection
   - Read-only mode for improved code

3. **ReviewOutput** - Results display
   - Line-by-line issue breakdown
   - Score visualization
   - Severity indicators
   - Follow-up questions

4. **SkillSelector** - Expertise level picker
   - Junior: Focus on basics
   - Mid: Design patterns and practices
   - Senior: Architecture and production

5. **FocusSelector** - Review focus areas
   - Bugs & Logic
   - Performance
   - Clean Code
   - Security

6. **ThemeContext** - Dark/light mode
   - Persistent theme storage
   - System-wide theme application

**State Management:**
- Local component state for UI
- Context for theme
- No Redux (intentionally simple)

**API Integration:**
- Service layer in `services/api.ts`
- TypeScript interfaces for type safety
- Error handling and loading states

### Backend (FastAPI + Python)

**Technology Stack:**
- FastAPI for REST API
- SQLAlchemy for ORM
- SQLite for database
- Pydantic for validation
- httpx for async HTTP

**Key Components:**

1. **Routes** (`app/routes/reviews.py`)
   - POST /api/reviews - Submit code
   - GET /api/reviews - List reviews
   - GET /api/reviews/{id} - Get specific review

2. **Models** (`app/models/review.py`)
   - Review entity with all fields
   - SQLAlchemy mapping
   - JSON serialization

3. **Services** (`app/services/ai_service.py`)
   - Calls AI agent
   - Handles timeouts
   - Error recovery

4. **Utils**
   - Rate limiter (10/hour per IP)
   - Validators (Pydantic models)
   - Configuration management

**Security:**
- Rate limiting per IP
- Input validation
- API key authentication to AI agent
- CORS configuration

**Database Schema:**
```sql
CREATE TABLE reviews (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    language TEXT NOT NULL,
    skill_level TEXT NOT NULL,
    focus_areas JSON NOT NULL,
    issues JSON NOT NULL,
    improved_code TEXT NOT NULL,
    explanation TEXT NOT NULL,
    scores JSON NOT NULL,
    follow_up_questions JSON NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_ip TEXT
);
```

### AI Agent (Python + Groq)

**Technology Stack:**
- FastAPI for API server
- Groq SDK for LLM
- Python pattern matching
- Custom scoring engine

**Architecture Pattern: Hybrid Analysis Pipeline**

```
Input Code
    │
    ▼
┌───────────────────────┐
│  Static Detectors     │  Fast, always available
│  - Bug patterns       │
│  - Security risks     │
│  - Performance issues │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│  LLM Analysis (Groq)  │  Deep, semantic understanding
│  - Context-aware      │
│  - Explains reasoning │
│  - Suggests fixes     │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│  Scoring Engine       │  Multi-dimensional quality
│  - Correctness        │
│  - Readability        │
│  - Maintainability    │
│  - Performance        │
│  - Security           │
└───────────┬───────────┘
            │
            ▼
    Structured Response
```

**Components:**

1. **agent.py** - Main orchestrator
   - Coordinates detectors and LLM
   - Graceful degradation if LLM fails
   - Response generation

2. **detectors.py** - Pattern matching
   - Language-specific bug patterns
   - Security vulnerability detection
   - Performance anti-patterns
   - Code smell detection

3. **scoring.py** - Quality metrics
   - Multi-dimensional scoring (0-100)
   - Severity-weighted calculations
   - Category-specific scoring

4. **prompts.py** - LLM prompt engineering
   - System prompts for persona
   - Skill-level adaptation
   - Few-shot examples
   - Structured output formatting

**Why Hybrid Approach?**
- **Reliability**: Static checks always work
- **Speed**: Fast pattern matching
- **Depth**: LLM provides reasoning
- **Cost**: Reduces unnecessary LLM calls

## Data Flow

### Code Review Request Flow

1. **User submits code** in frontend
2. **Frontend validates** input locally
3. **POST request** to backend `/api/reviews`
4. **Backend validates** with Pydantic
5. **Rate limiter checks** IP quota
6. **Backend calls** AI agent `/analyze`
7. **AI agent** runs detectors + LLM
8. **Agent returns** structured JSON
9. **Backend saves** to database
10. **Backend returns** to frontend
11. **Frontend displays** results in tabs

### Error Handling Flow

```
Frontend Request
    │
    ▼
Backend Validation ────▶ Invalid? ──▶ Return 400 with details
    │
    ▼
Rate Limit Check ──────▶ Exceeded? ─▶ Return 429
    │
    ▼
AI Agent Call ─────────▶ Failed? ───▶ Return 500 with message
    │
    ▼
Database Save ─────────▶ Failed? ───▶ Return 500 with message
    │
    ▼
Success Response
```

## Design Decisions

### Why Three Separate Services?

1. **Separation of Concerns**
   - UI logic separate from business logic
   - AI logic isolated and testable
   - Each service has single responsibility

2. **Scalability**
   - Can scale AI agent independently
   - Backend can handle multiple AI agents
   - Frontend served via CDN

3. **Security**
   - AI agent not exposed to internet
   - Backend acts as authenticated gateway
   - API keys never reach frontend

4. **Development**
   - Teams can work independently
   - Easy to swap implementations
   - Clear API contracts

### Why SQLite?

- Zero configuration for MVP
- File-based portability
- Easy to migrate to PostgreSQL
- Sufficient for demo/portfolio
- No additional infrastructure

### Why Groq?

- Fast inference (~500ms)
- Good reasoning with Mixtral-8x7B
- Free tier for development
- Simple API
- Easy to swap for OpenAI/Anthropic

### Why Monaco Editor?

- Industry-standard (VSCode)
- Excellent syntax highlighting
- Familiar to developers
- Built-in language support
- Professional appearance

## Performance Considerations

### Frontend
- Code splitting with Vite
- Monaco loaded lazily
- Optimistic UI updates
- Debounced validation

### Backend
- Async/await throughout
- Connection pooling
- Rate limiting prevents abuse
- Indexed database queries

### AI Agent
- Static checks run first (fast)
- LLM calls are async
- Timeout handling (120s)
- Fallback to mock mode

## Security Considerations

### Frontend
- No sensitive data storage
- Input sanitization
- XSS prevention via React
- CORS restrictions

### Backend
- Rate limiting per IP
- Input validation (Pydantic)
- API key auth to AI agent
- SQL injection prevention (ORM)

### AI Agent
- API key authentication
- No code execution
- Sandboxed analysis
- Timeout limits

## Monitoring & Logging

### Backend
- Structured logging
- Request/response logging
- Error tracking
- Performance metrics

### AI Agent
- Analysis timing
- LLM success/failure rates
- Detector performance
- Error logging

## Deployment

### Development
```bash
# Terminal 1
cd ai-agent && ./start-ai-agent.sh

# Terminal 2
cd backend && ./start-backend.sh

# Terminal 3
cd frontend && ./start-frontend.sh
```

### Production Considerations
- Use PostgreSQL instead of SQLite
- Deploy AI agent on GPU instance
- Use proper secrets management
- Add monitoring (Datadog, New Relic)
- CDN for frontend assets
- Load balancing for API
- Database backups

## Future Enhancements

### Technical Improvements
- WebSocket for real-time streaming
- Code diff visualization
- Caching layer (Redis)
- Horizontal scaling
- GraphQL API option

### Feature Additions
- GitHub PR integration
- Team collaboration
- Custom rule configuration
- Historical trend analysis
- AI explanation of fixes
- Multi-language support expansion

### AI Enhancements
- Fine-tuned models
- Domain-specific rules
- Learning from user feedback
- Confidence scores
- Alternative fix suggestions

## Testing Strategy

### Frontend
- Unit tests (Jest + React Testing Library)
- Component tests
- E2E tests (Playwright)

### Backend
- Unit tests (pytest)
- Integration tests
- API contract tests

### AI Agent
- Pattern detector tests
- Scoring engine tests
- LLM integration tests
- End-to-end review tests

## Conclusion

This architecture demonstrates:
- Modern full-stack development
- Clean separation of concerns
- Production-grade patterns
- AI integration best practices
- Scalable design
- Security considerations
- Real engineering intelligence

The system is designed to be maintainable, testable, and extensible while showcasing senior-level software engineering skills.
