import json

from models.response_models import Issue
from services.bob_service import bob_review
from prompts.security_prompt import security_prompt


def security_review(code_lines):
    # Convert added lines into one code string
    code = "\n".join(code_lines)

    # Build the IBM Bob prompt
    prompt = security_prompt(code)

    # Send prompt to IBM Bob
    bob_output = bob_review(prompt)

    # Remove prompt text if IBM Bob echoes it
    markers = [
        "Security Issues:",
        "Performance Issues:",
        "Testing Suggestions:",
        "Suggested Fixes:",
    ]

    for marker in markers:
        if marker in bob_output:
            bob_output = bob_output[bob_output.index(marker):]
            break

    # Pretty-print JSON if Bob returns JSON
    try:
        parsed = json.loads(bob_output)
        bob_output = json.dumps(parsed, indent=2)
    except Exception:
        pass

    print("===== IBM SECURITY REVIEW =====")
    print(bob_output)
    print("===============================")

    issues = []

    for index, line in enumerate(code_lines):
        lower_line = line.lower()

        # Detect plaintext password
        if ("password=" in lower_line or "password =" in lower_line) and "hash" not in lower_line:
            issues.append(
                Issue(
                    file="auth.py",
                    line=index + 1,
                    severity="High",
                    category="Security",
                    issue="Password may be stored in plain text.",
                    fix="Hash passwords using bcrypt before storing.",
                )
            )

        # Detect hardcoded API key
        if "api_key=" in lower_line or "api_key =" in lower_line:
            issues.append(
                Issue(
                    file="config.py",
                    line=index + 1,
                    severity="High",
                    category="Security",
                    issue="Hardcoded API key detected.",
                    fix="Move API keys into environment variables.",
                )
            )

    return issues, bob_output