import re

def detect_bugs(code: str, language: str) -> list:
    issues = []
    lines = code.split('\n')
    
    if language in ['javascript', 'typescript']:
        for i, line in enumerate(lines, 1):
            if '==' in line and '===' not in line:
                issues.append({
                    "line": i,
                    "severity": "medium",
                    "title": "Using loose equality (==)",
                    "description": "Loose equality can lead to unexpected type coercion bugs",
                    "risk": "Conditional logic may behave unexpectedly with different types",
                    "suggestion": "Use strict equality (===) instead"
                })
            
            if 'var ' in line:
                issues.append({
                    "line": i,
                    "severity": "low",
                    "title": "Using 'var' instead of 'let' or 'const'",
                    "description": "var has function scope and can lead to hoisting issues",
                    "risk": "Variable scope bugs and accidental global variables",
                    "suggestion": "Use 'const' for immutable values, 'let' for mutable"
                })
    
    elif language == 'python':
        for i, line in enumerate(lines, 1):
            if 'except:' in line:
                issues.append({
                    "line": i,
                    "severity": "high",
                    "title": "Bare except clause",
                    "description": "Catches all exceptions including KeyboardInterrupt and SystemExit",
                    "risk": "Makes debugging impossible and can hide critical errors",
                    "suggestion": "Catch specific exceptions or use 'except Exception:'"
                })
    
    return issues


def detect_anti_patterns(code: str, language: str) -> list:
    issues = []
    lines = code.split('\n')
    
    for i, line in enumerate(lines, 1):
        if 'TODO' in line or 'FIXME' in line:
            issues.append({
                "line": i,
                "severity": "info",
                "title": "TODO comment found",
                "description": "Unfinished work or technical debt",
                "risk": "Code may be incomplete or require future fixes",
                "suggestion": "Complete the work or create a proper ticket"
            })
    
    if language in ['javascript', 'typescript']:
        for i, line in enumerate(lines, 1):
            if 'console.log' in line:
                issues.append({
                    "line": i,
                    "severity": "low",
                    "title": "console.log in production code",
                    "description": "Debug statements should not be in production",
                    "risk": "Performance impact and cluttered console output",
                    "suggestion": "Use a proper logging library or remove"
                })
    
    return issues


def detect_code_smells(code: str) -> list:
    issues = []
    lines = code.split('\n')
    
    for i, line in enumerate(lines, 1):
        if len(line) > 120 and line.strip():
            issues.append({
                "line": i,
                "severity": "low",
                "title": "Line too long",
                "description": "Line exceeds 120 characters, reducing readability",
                "risk": "Harder to read and review code",
                "suggestion": "Break into multiple lines or refactor"
            })
    
    nested_level = 0
    max_nesting = 0
    for line in lines:
        nested_level += line.count('{') - line.count('}')
        max_nesting = max(max_nesting, nested_level)
    
    if max_nesting > 4:
        issues.append({
            "line": 1,
            "severity": "medium",
            "title": "Deep nesting detected",
            "description": f"Code has {max_nesting} levels of nesting, indicating high complexity",
            "risk": "Difficult to understand, test, and maintain",
            "suggestion": "Extract functions or use early returns to reduce nesting"
        })
    
    return issues


def detect_performance_issues(code: str, language: str) -> list:
    issues = []
    lines = code.split('\n')
    
    if language in ['javascript', 'typescript']:
        for i, line in enumerate(lines, 1):
            if '.forEach(' in line:
                if 'async' in line or 'await' in code:
                    issues.append({
                        "line": i,
                        "severity": "high",
                        "title": "Async operation in forEach",
                        "description": "forEach doesn't handle promises properly - it doesn't await async callbacks",
                        "risk": "Async operations won't wait correctly, leading to race conditions and unpredictable behavior",
                        "suggestion": "Use for...of loop or Promise.all with map instead"
                    })
    
    elif language == 'python':
        for i, line in enumerate(lines, 1):
            if '+=' in line and 'str' in code.lower():
                issues.append({
                    "line": i,
                    "severity": "medium",
                    "title": "String concatenation in loop",
                    "description": "Repeatedly concatenating strings is O(n²)",
                    "risk": "Performance degrades with large datasets",
                    "suggestion": "Use list and ''.join() or f-strings"
                })
    
    return issues


def detect_security_risks(code: str, language: str) -> list:
    issues = []
    lines = code.split('\n')
    
    for i, line in enumerate(lines, 1):
        if 'eval(' in line:
            issues.append({
                "line": i,
                "severity": "critical",
                "title": "Use of eval()",
                "description": "eval executes arbitrary code and is a major security risk",
                "risk": "Code injection vulnerability, arbitrary code execution",
                "suggestion": "Never use eval. Find alternative approaches"
            })
        
        if 'password' in line.lower() and ('=' in line or ':' in line):
            issues.append({
                "line": i,
                "severity": "critical",
                "title": "Hardcoded password detected",
                "description": "Credentials should never be in source code",
                "risk": "Exposed credentials in version control",
                "suggestion": "Use environment variables or secure vaults"
            })
    
    if language in ['javascript', 'typescript']:
        for i, line in enumerate(lines, 1):
            if 'innerHTML' in line and '=' in line:
                issues.append({
                    "line": i,
                    "severity": "high",
                    "title": "Potential XSS via innerHTML",
                    "description": "Setting innerHTML with user input can execute scripts",
                    "risk": "Cross-site scripting (XSS) vulnerability",
                    "suggestion": "Use textContent or proper sanitization"
                })
    
    return issues


def run_all_detectors(code: str, language: str, focus_areas: list) -> list:
    all_issues = []
    
    if 'bugs' in focus_areas:
        all_issues.extend(detect_bugs(code, language))
    
    if 'clean_code' in focus_areas:
        all_issues.extend(detect_anti_patterns(code, language))
        all_issues.extend(detect_code_smells(code))
    
    if 'performance' in focus_areas:
        all_issues.extend(detect_performance_issues(code, language))
    
    if 'security' in focus_areas:
        all_issues.extend(detect_security_risks(code, language))
    
    return all_issues
