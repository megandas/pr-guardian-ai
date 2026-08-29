from models.response_models import Issue
from services.bob_service import bob_review
from prompts.performance_prompt import PERFORMANCE_PROMPT


def performance_review(code_lines):
    code = "\n".join(code_lines)

    # Build the full prompt
    prompt = f"""
{PERFORMANCE_PROMPT}

Code:
{code}
"""

    # Send prompt to IBM Bob
    bob_review(prompt)

    # Keep existing local checks (if any)
    issues = []

    for i, line in enumerate(code_lines):
        lower = line.lower()

        if "for" in lower and "range(len(" in lower:
            issues.append(
                {
                    "line": i + 1,
                    "issue": "Possible inefficient loop.",
                    "severity": "Medium",
                }
            )

    return issues