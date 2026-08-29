import re

def extract_added_lines(diff: str):
    """
    Extract only newly added code lines from a Git diff.
    Ignore metadata and removed lines.
    """

    added_lines = []

    for line in diff.splitlines():

        # Skip diff metadata
        if line.startswith("+++") or line.startswith("@@"):
            continue

        # Keep only added code
        if line.startswith("+"):
            added_lines.append(line[1:])

    return added_lines

if __name__ == "__main__":

    sample_diff = """
diff --git a/auth.py b/auth.py

@@ -10,2 +10,4 @@
-password = user_input
+import bcrypt
+hashed_password = bcrypt.hashpw(user_input.encode(), bcrypt.gensalt())
+print("Login Successful")
"""

    print(extract_added_lines(sample_diff))