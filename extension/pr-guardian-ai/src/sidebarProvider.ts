
import * as vscode from "vscode";

export class SidebarProvider implements vscode.WebviewViewProvider {
  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: sans-serif;
      padding: 16px;
    }

    button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 8px;
      background: #0f62fe;
      color: white;
      font-weight: bold;
      cursor: pointer;
      margin-bottom: 16px;
    }

    #result {
      color: #555;
      line-height: 1.5;
      margin-top: 12px;
    }

    h3 {
      margin-bottom: 8px;
    }
  </style>
</head>

<body>
  <h2>🛡️ PR Guardian AI</h2>

  <button id="reviewBtn">
    Review Current PR
  </button>

  <div id="result">
    Waiting for review...
  </div>

  <script>
    const button = document.getElementById("reviewBtn");
    const result = document.getElementById("result");

    button.addEventListener("click", async () => {
      result.innerHTML = "⏳ Reviewing...";

      try {
        const response = await fetch("http://127.0.0.1:8000/review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            pr_title: "VS Code PR",
            pr_description: "Triggered from Extension",
            changed_files: ["auth.py"],
            diff: "diff --git a/auth.py b/auth.py\\n+password=user_input\\n+api_key='SECRET'"
          })
        });

        if (!response.ok) {
          throw new Error("Backend returned " + response.status);
        }

        const data = await response.json();
        console.log("Backend Response:", data);

        result.innerHTML = \`
          <h3>📊 Score: \${data.review_score}</h3>
          <p><b>Merge Ready:</b> \${data.merge_ready}</p>
          <p><b>Recommendation:</b> \${data.recommendation}</p>
        \`;
      } catch (err) {
        console.error(err);
        result.innerHTML = \`
          <p style="color:red;">❌ Cannot connect to FastAPI backend.</p>
        \`;
      }
    });
  </script>
</body>
</html>
`;
  }
}