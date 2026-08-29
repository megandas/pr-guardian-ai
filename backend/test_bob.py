from services.bob_service import bob_review

system_prompt = "Review this pull request for security vulnerabilities."

diff = """
diff --git a/auth.py b/auth.py
+password=user_input
+api_key="SECRET"
"""

result = bob_review(system_prompt, diff)

print(result)