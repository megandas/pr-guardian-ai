from models.response_models import Issue
from services.bob_service import bob_review
from prompts.testing_prompt import TESTING_PROMPT

def testing_review(code_lines):
    """
    Suggest missing test cases based on code changes.
    """
    code = "\n".join(code_lines)

    prompt = f"""
    {TESTING_PROMPT}

    Code:
    {code}
    """

    bob_review(prompt)
    issues = []

    for index, line in enumerate(code_lines):

        stripped = line.strip().lower()

        # New function added
        if stripped.startswith("def "):
            function_name = stripped.split("(")[0].replace("def ", "")

            issues.append(
                Issue(
                    file="tests.py",
                    line=index + 1,
                    severity="Low",
                    category="Testing",
                    issue=f"No unit tests found for '{function_name}'.",
                    fix=f"Generate pytest tests for {function_name}."
                )
            )

        # Authentication code
        if "login" in stripped or "authenticate" in stripped:
            issues.append(
                Issue(
                    file="tests_auth.py",
                    line=index + 1,
                    severity="Medium",
                    category="Testing",
                    issue="Login flow should include authentication tests.",
                    fix="Add valid login, invalid login, and expired token tests."
                )
            )

        # Discount / payment logic
        if "discount" in stripped or "payment" in stripped:
            issues.append(
                Issue(
                    file="tests_payment.py",
                    line=index + 1,
                    severity="Medium",
                    category="Testing",
                    issue="Business logic should include edge case tests.",
                    fix="Add tests for zero value, negative value, and premium users."
                )
            )

    return issues