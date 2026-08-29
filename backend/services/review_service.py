from utils.parser import extract_added_lines
from agents.security import security_review
from agents.performance import performance_review
from agents.testing import testing_review


def run_review(diff: str):

    new_code = extract_added_lines(diff)

    # Security agent now returns rule-based issues + IBM Bob review text
    security_issues, bob_review_text = security_review(new_code)

    performance_issues = performance_review(new_code)
    testing_issues = testing_review(new_code)

    issues = []
    issues.extend(security_issues)
    issues.extend(performance_issues)
    issues.extend(testing_issues)

    summary = {
        "Security": 0,
        "Performance": 0,
        "Testing": 0
    }

    high_count = 0

    for issue in issues:
        summary[issue.category] += 1
        if issue.severity == "High":
            high_count += 1

    score = max(100 - len(issues) * 12 - high_count * 8, 0)

    merge_ready = high_count == 0 and score >= 75

    if high_count >= 3:
        recommendation = "🚨 Block merge until all critical security issues are fixed."
    elif high_count > 0:
        recommendation = "⚠️ Fix high-severity issues before merging."
    elif score >= 90:
        recommendation = "✅ Safe to merge."
    else:
        recommendation = "🟡 Review medium and low severity issues before merging."

    # Return IBM Bob review too
    return (
        score,
        merge_ready,
        issues,
        summary,
        recommendation,
        bob_review_text,
    )