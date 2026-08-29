"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarProvider = void 0;
class SidebarProvider {
    extensionUri;
    constructor(extensionUri) {
        this.extensionUri = extensionUri;
    }
    resolveWebviewView(webviewView) {
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
      color: var(--vscode-foreground);
      background: var(--vscode-sideBar-background);
    }

    h2 {
      color: #0F62FE;
      margin-bottom: 20px;
    }

    button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 8px;
      background: #0F62FE;
      color: white;
      font-weight: bold;
      cursor: pointer;
      margin-bottom: 16px;
    }

    button:hover {
      background: #0353e9;
    }

    #result {
      margin-top: 12px;
      line-height: 1.6;
    }

    .score {
      font-size: 18px;
      font-weight: bold;
      color: #0F62FE;
    }

    .good {
      color: #24A148;
      font-weight: bold;
    }

    .bad {
      color: #DA1E28;
      font-weight: bold;
    }

    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      background: #1E1E1E;
      color: #98FB98;
      padding: 12px;
      border-radius: 8px;
      font-size: 12px;
      overflow-x: auto;
      margin-top: 8px;
    }

    hr {
      margin: 16px 0;
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

      result.innerHTML = "⏳ Reviewing Pull Request with IBM Bob...";

      try {

        const response = await fetch("http://127.0.0.1:8000/review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            pr_title: "VS Code PR",
            pr_description: "Triggered from VS Code Extension",
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
          <div>

            <div class="score">📊 Score: \${data.review_score}/100</div>

            <p><b>Merge Ready:</b>
              <span class="\${data.merge_ready ? "good" : "bad"}">
                \${data.merge_ready ? "✅ Yes" : "❌ No"}
              </span>
            </p>

            <p><b>Recommendation:</b><br>
              \${data.recommendation}
            </p>

            <hr>

            <h3>🤖 IBM Bob Security Review</h3>

            <pre>\${data.ai_review}</pre>

          </div>
        \`;

      } catch (err) {

        console.error(err);

        result.innerHTML = \`
          <p style="color:red;">
            ❌ Cannot connect to FastAPI backend.
          </p>
          <p>
            Make sure <b>uvicorn app:app --reload</b> is running in the backend terminal.
          </p>
        \`;

      }

    });

  </script>

</body>
</html>
`;
    }
}
exports.SidebarProvider = SidebarProvider;
//# sourceMappingURL=sidebarProvider.js.map