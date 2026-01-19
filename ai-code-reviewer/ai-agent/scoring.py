def calculate_scores(issues: list, code: str, improved_code: str) -> dict:
    severity_weights = {
        "critical": 30,
        "high": 20,
        "medium": 10,
        "low": 5,
        "info": 2
    }
    
    total_deductions = sum(severity_weights.get(issue["severity"], 0) for issue in issues)
    
    base_score = max(0, 100 - total_deductions)
    
    critical_count = sum(1 for i in issues if i["severity"] == "critical")
    high_count = sum(1 for i in issues if i["severity"] == "high")
    
    correctness = max(0, 100 - (critical_count * 40) - (high_count * 15))
    
    readability = base_score
    naming_issues = sum(1 for i in issues if "naming" in i.get("title", "").lower() or "variable" in i.get("title", "").lower())
    readability = max(0, readability - (naming_issues * 10))
    
    maintainability = base_score
    complexity_issues = sum(1 for i in issues if "complex" in i.get("description", "").lower() or "maintainability" in i.get("description", "").lower())
    maintainability = max(0, maintainability - (complexity_issues * 15))
    
    performance = base_score
    perf_issues = sum(1 for i in issues if "performance" in i.get("description", "").lower() or "slow" in i.get("description", "").lower())
    performance = max(0, performance - (perf_issues * 20))
    
    security = 100
    security_issues = sum(1 for i in issues if "security" in i.get("description", "").lower() or "vulnerability" in i.get("description", "").lower())
    security = max(0, security - (security_issues * 25))
    
    overall = int((correctness + readability + maintainability + performance + security) / 5)
    
    return {
        "correctness": int(correctness),
        "readability": int(readability),
        "maintainability": int(maintainability),
        "performance": int(performance),
        "security": int(security),
        "overall": overall
    }


def score_correctness(issues: list) -> int:
    critical = sum(1 for i in issues if i["severity"] == "critical")
    high = sum(1 for i in issues if i["severity"] == "high")
    return max(0, 100 - (critical * 40) - (high * 15))


def score_readability(issues: list) -> int:
    readability_keywords = ["naming", "variable", "function name", "unclear", "confusing"]
    relevant_issues = [i for i in issues if any(kw in i.get("description", "").lower() for kw in readability_keywords)]
    return max(0, 100 - (len(relevant_issues) * 15))


def score_maintainability(issues: list) -> int:
    maintainability_keywords = ["complex", "duplicate", "coupling", "responsibility", "maintainability"]
    relevant_issues = [i for i in issues if any(kw in i.get("description", "").lower() for kw in maintainability_keywords)]
    return max(0, 100 - (len(relevant_issues) * 20))


def score_performance(issues: list) -> int:
    performance_keywords = ["performance", "slow", "inefficient", "optimization", "complexity"]
    relevant_issues = [i for i in issues if any(kw in i.get("description", "").lower() for kw in performance_keywords)]
    return max(0, 100 - (len(relevant_issues) * 25))


def score_security(issues: list) -> int:
    security_keywords = ["security", "vulnerability", "injection", "exposure", "authentication", "authorization"]
    relevant_issues = [i for i in issues if any(kw in i.get("description", "").lower() for kw in security_keywords)]
    critical_security = sum(1 for i in relevant_issues if i["severity"] in ["critical", "high"])
    return max(0, 100 - (critical_security * 40) - (len(relevant_issues) * 10))
