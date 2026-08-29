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
<meta charset="UTF-8">

<style>

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #0d1117;
  color: #e6edf3;
}

/* HEADER */

.header {
  margin-bottom: 14px;
}

.title {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
}

.shield {
  font-size: 23px;
}

.subtitle {
  color: #8b949e;
  font-size: 12px;
}

/* BUTTON */

.review-btn {
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 12px;
  margin: 10px 0;
  background: linear-gradient(135deg, #1769ff, #4f46e5);
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.review-btn:hover {
  filter: brightness(1.15);
}

.review-btn:disabled {
  opacity: 0.65;
  cursor: wait;
}

/* LAST REVIEW */

.last-reviewed {
  font-size: 11px;
  color: #3fb950;
  margin: 8px 2px 14px;
}

/* CARDS */

.card {
  background: #151b23;
  border: 1px solid #30363d;
  border-radius: 10px;
  padding: 13px;
  margin-bottom: 12px;
}

.card-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #58a6ff;
}

.card-title.purple {
  color: #bc8cff;
}

.card-title.red {
  color: #ff6b6b;
}

.card-title.green {
  color: #39d353;
}

.card-title.cyan {
  color: #22d3ee;
}

/* HEALTH SCORE */

.score-layout {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* GAUGE */

.gauge {
  width: 145px;
  height: 78px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.gauge-ring {
  position: absolute;
  width: 145px;
  height: 145px;
  left: 0;
  top: 0;

  border-radius: 50%;

  background:
    conic-gradient(
      from 270deg,
      #ef4444 0deg 45deg,
      #f97316 45deg 85deg,
      #facc15 85deg 125deg,
      #a3e635 125deg 160deg,
      #22c55e 160deg 180deg,
      transparent 180deg 360deg
    );
}

.gauge-ring::after {
  content: "";
  position: absolute;
  width: 103px;
  height: 103px;
  left: 21px;
  top: 21px;
  background: #151b23;
  border-radius: 50%;
}

/* SCORE NEEDLE */

.needle {
  position: absolute;
  width: 2px;
  height: 57px;
  background: #e6edf3;
  bottom: 4px;
  left: 50%;
  transform-origin: bottom center;
  transform: rotate(35deg);
  z-index: 5;
  box-shadow: 0 0 5px rgba(255,255,255,0.4);
}

.needle-dot {
  position: absolute;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #e6edf3;
  bottom: 1px;
  left: calc(50% - 4px);
  z-index: 6;
}

/* SCORE CENTER */

.score-center {
  position: absolute;
  width: 70px;
  text-align: center;
  left: 37px;
  top: 43px;
  z-index: 7;
}

.score-number {
  font-size: 24px;
  font-weight: 800;
}

.score-max {
  font-size: 10px;
  color: #8b949e;
}

/* SCORE INFO */

.score-info {
  flex: 1;
}

.score-status {
  font-size: 16px;
  font-weight: 800;
  color: #facc15;
  margin-bottom: 7px;
}

.score-description {
  font-size: 11px;
  color: #8b949e;
  line-height: 1.4;
}

/* SCALE */

.scale {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: #8b949e;
  margin-top: -2px;
}

/* ISSUE SUMMARY */

.issue-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
}

.issue-count {
  padding: 10px;
  border-radius: 7px;
  border: 1px solid #30363d;
}

.issue-number {
  font-size: 20px;
  font-weight: 800;
}

.issue-label {
  font-size: 10px;
  color: #8b949e;
  margin-top: 2px;
}

.critical {
  border-color: #f85149;
  background: rgba(248,81,73,0.08);
}

.critical .issue-number {
  color: #ff6b6b;
}

.high {
  border-color: #f0883e;
  background: rgba(240,136,62,0.08);
}

.high .issue-number {
  color: #ff922b;
}

.medium {
  border-color: #d29922;
  background: rgba(210,153,34,0.08);
}

.medium .issue-number {
  color: #facc15;
}

.low {
  border-color: #388bfd;
  background: rgba(56,139,253,0.08);
}

.low .issue-number {
  color: #58a6ff;
}

.passed {
  border-color: #238636;
  background: rgba(35,134,54,0.08);
}

.passed .issue-number {
  color: #39d353;
}

/* MERGE STATUS */

.merge-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(248,81,73,0.08);
  border: 1px solid #f85149;
}

.merge-icon {
  font-size: 30px;
}

.merge-title {
  color: #ff6b6b;
  font-size: 15px;
  font-weight: 800;
}

.merge-text {
  color: #8b949e;
  font-size: 11px;
  margin-top: 4px;
}

/* AI */

.ai-box {
  border: 1px solid #0e7490;
  background: rgba(34,211,238,0.05);
  border-radius: 8px;
  padding: 12px;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #22d3ee;
  font-weight: 700;
  margin-bottom: 8px;
}

.ai-text {
  color: #c9d1d9;
  font-size: 11px;
  line-height: 1.5;
}

.bob {
  display: inline-block;
  margin-top: 10px;
  padding: 6px 9px;
  border-radius: 6px;
  background: rgba(34,211,238,0.1);
  border: 1px solid #0e7490;
  color: #22d3ee;
  font-size: 10px;
  font-weight: 700;
}

/* SECURITY ISSUES */

.security-item {
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 11px;
  margin-bottom: 8px;
  background: #10161e;
}

.security-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.severity {
  font-size: 9px;
  font-weight: 800;
  padding: 4px 7px;
  border-radius: 5px;
}

.severity-critical {
  color: #ff6b6b;
  background: rgba(248,81,73,0.15);
  border: 1px solid #f85149;
}

.severity-high {
  color: #ff922b;
  background: rgba(240,136,62,0.15);
  border: 1px solid #f0883e;
}

.severity-medium {
  color: #facc15;
  background: rgba(210,153,34,0.15);
  border: 1px solid #d29922;
}

.security-name {
  font-size: 12px;
  font-weight: 700;
}

.security-location {
  color: #8b949e;
  font-size: 10px;
  margin-top: 6px;
}

.security-description {
  font-size: 10px;
  color: #c9d1d9;
  margin-top: 5px;
  line-height: 1.4;
}

.security-fix {
  color: #58a6ff;
  font-size: 10px;
  margin-top: 6px;
}

/* DIFF */

.diff {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 7px;
  overflow: hidden;
  font-family: Consolas, monospace;
  font-size: 10px;
}

.diff-line {
  padding: 6px 8px;
}

.removed {
  background: rgba(248,81,73,0.15);
  color: #ff7b72;
}

.added {
  background: rgba(46,160,67,0.15);
  color: #7ee787;
}

.normal {
  color: #c9d1d9;
}

/* FOOTER */

.completed {
  text-align: center;
  padding: 9px;
  border-radius: 7px;
  background: rgba(35,134,54,0.08);
  border: 1px solid #238636;
  color: #39d353;
  font-size: 10px;
}

.hidden {
  display: none;
}

</style>
</head>

<body>
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

<div class="header">

  <div class="title">
    <span class="shield">🛡️</span>
    PR Guardian AI
  </div>

<<<<<<< HEAD
  <div class="subtitle">
    AI-powered Pull Request Security Review
  </div>

</div>

<button id="reviewBtn" class="review-btn">
  🔍 Review Current PR
</button>
=======
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
>>>>>>> fa06333 (Person A complete: IBM Bob integration and VS Code extension)

<div id="lastReviewed" class="last-reviewed hidden">
  ● Last reviewed: just now
</div>

<<<<<<< HEAD
<div id="result">

  <div class="card">

    <div class="card-title">
      PR Review Dashboard
    </div>

    <div style="
      color:#8b949e;
      font-size:11px;
      line-height:1.5;
    ">
      Click <b style="color:#58a6ff;">Review Current PR</b>
      to analyze the pull request and generate a security report.
    </div>

  </div>

</div>

<script>

const button = document.getElementById("reviewBtn");
const result = document.getElementById("result");
const lastReviewed = document.getElementById("lastReviewed");


/*
 * ---------------------------------------------------------
 * REVIEW BUTTON
 * ---------------------------------------------------------
 */

button.addEventListener("click", async () => {

  button.disabled = true;
  button.innerHTML = "⏳ Reviewing PR...";

  result.innerHTML = \`
    <div class="card">
      <div style="
        text-align:center;
        color:#8b949e;
        padding:20px;
      ">
        🔎 Analyzing pull request...
      </div>
    </div>
  \`;

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/review",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          pr_title: "VS Code PR",

          pr_description:
            "Triggered from PR Guardian AI",

          changed_files: [
            "auth.py"
          ],

          diff:
            "diff --git a/auth.py b/auth.py\\n" +
            "+password=user_input\\n" +
            "+api_key='SECRET'"
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        "Backend returned " + response.status
      );
    }

    const data = await response.json();

    console.log(
      "PR Guardian Response:",
      data
    );

    // Your existing dashboard code continues here...


    /*
     * -----------------------------------------------------
     * CALCULATE ISSUE COUNTS
     * -----------------------------------------------------
     */

    const issues = data.issues || [];

    const critical =
      issues.filter(
        x => x.severity.toLowerCase() === "critical"
      ).length;

    const high =
      issues.filter(
        x => x.severity.toLowerCase() === "high"
      ).length;

    const medium =
      issues.filter(
        x => x.severity.toLowerCase() === "medium"
      ).length;

    const low =
      issues.filter(
        x => x.severity.toLowerCase() === "low"
      ).length;


    const totalIssues = issues.length;

    const totalChecks = 31;

    const passed =
      Math.max(
        0,
        totalChecks - totalIssues
      );


    /*
     * -----------------------------------------------------
     * SCORE
     * -----------------------------------------------------
     */

    const score =
      Number(data.review_score ?? 0);


    /*
     * SCORE STATUS
     */

    let scoreStatus = "Needs Attention";

    if (score >= 80) {

      scoreStatus = "Healthy";

    } else if (score >= 60) {

      scoreStatus = "Needs Attention";

    } else {

      scoreStatus = "High Risk";

    }


    /*
     * -----------------------------------------------------
     * SECURITY ISSUE HTML
     * -----------------------------------------------------
     */

    let securityHTML = "";

    if (issues.length === 0) {

      securityHTML = \`
        <div class="security-item">
          <div style="
            color:#39d353;
            font-weight:700;
            font-size:12px;
          ">
            ✅ No security issues found
          </div>
        </div>
      \`;

    } else {

      securityHTML = issues.map(issue => {

        const severity =
          issue.severity || "Medium";

        const severityClass =
          severity.toLowerCase() === "critical"
            ? "severity-critical"
            : severity.toLowerCase() === "high"
              ? "severity-high"
              : "severity-medium";

        return \`
          <div class="security-item">

            <div class="security-top">

              <span class="severity \${severityClass}">
                \${severity.toUpperCase()}
              </span>

              <span class="security-name">
                \${issue.issue}
              </span>

            </div>

            <div class="security-location">
              📄 \${issue.file || "Unknown file"}
              :\${issue.line || "-"}
            </div>

            <div class="security-description">
              \${issue.issue}
            </div>

            <div class="security-fix">
              💡 Fix: \${issue.fix || "Review this issue."}
            </div>

          </div>
        \`;

      }).join("");

    }


    /*
     * -----------------------------------------------------
     * MERGE STATUS
     * -----------------------------------------------------
     */

    const mergeReady =
      data.merge_ready === true;

    const mergeHTML = mergeReady

      ? \`
        <div class="merge-box"
             style="
               background:rgba(35,134,54,0.08);
               border-color:#238636;
             ">

          <div class="merge-icon">
            ✅
          </div>

          <div>

            <div class="merge-title"
                 style="color:#39d353;">
              READY TO MERGE
            </div>

            <div class="merge-text">
              No blocking security issues detected.
            </div>

          </div>

        </div>
      \`

      : \`
        <div class="merge-box">

          <div class="merge-icon">
            ⚠️
          </div>

          <div>

            <div class="merge-title">
              NOT READY TO MERGE
            </div>

            <div class="merge-text">
              \${totalIssues} blocking issue(s)
              should be resolved before merging.
            </div>

          </div>

        </div>
      \`;


    /*
     * -----------------------------------------------------
     * COMPLETE DASHBOARD
     * -----------------------------------------------------
     */

    result.innerHTML = \`

      <!-- 1. HEALTH SCORE -->

      <div class="card">

        <div class="card-title">
          1. PR Health Score
        </div>

        <div class="score-layout">

          <div>

            <div class="gauge">

              <div class="gauge-ring"></div>

              <div
                class="needle"
                id="needle">
              </div>

              <div class="needle-dot"></div>

              <div class="score-center">

                <div class="score-number">
                  \${score}
                </div>

                <div class="score-max">
                  /100
                </div>

              </div>

            </div>

            <div class="scale">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>

          </div>

          <div class="score-info">

            <div class="score-status">
              \${scoreStatus}
            </div>

            <div class="score-description">
              \${data.summary ||
                "Security review completed."}
            </div>

          </div>

        </div>

      </div>


      <!-- 2. ISSUE SUMMARY -->

      <div class="card">

        <div class="card-title purple">
          2. Issue Summary
        </div>

        <div class="issue-grid">

          <div class="issue-count critical">
            <div class="issue-number">
              \${critical}
            </div>
            <div class="issue-label">
              🔴 Critical
            </div>
          </div>

          <div class="issue-count high">
            <div class="issue-number">
              \${high}
            </div>
            <div class="issue-label">
              🟠 High
            </div>
          </div>

          <div class="issue-count medium">
            <div class="issue-number">
              \${medium}
            </div>
            <div class="issue-label">
              🟡 Medium
            </div>
          </div>

          <div class="issue-count low">
            <div class="issue-number">
              \${low}
            </div>
            <div class="issue-label">
              🔵 Low
            </div>
          </div>

          <div class="issue-count passed">
            <div class="issue-number">
              \${passed}
            </div>
            <div class="issue-label">
              🟢 Passed
            </div>
          </div>

          <div class="issue-count">
            <div class="issue-number">
              \${totalChecks}
            </div>
            <div class="issue-label">
              📋 Total Checks
            </div>
          </div>

        </div>

      </div>


      <!-- 3. MERGE STATUS -->

      <div class="card">

        <div class="card-title red">
          3. Merge Status
        </div>

        \${mergeHTML}

      </div>


      <!-- 4. AI RECOMMENDATION -->

      <div class="card">

        <div class="card-title cyan">
          4. AI Recommendation
        </div>

        <div class="ai-box">

          <div class="ai-header">
            🤖 IBM Bob Analysis
          </div>

          <div class="ai-text">
            \${data.recommendation ||
              "Review completed successfully."}
          </div>

          <div class="bob">
            🤖 Analyzed by IBM Bob
          </div>

        </div>

      </div>


      <!-- 5. CHANGED CODE -->

      <div class="card">

        <div class="card-title">
          5. Changed Code (Diff)
        </div>

        <div class="diff">

          <div class="diff-line normal">
            <b>auth.py</b>
          </div>

          <div class="diff-line added">
            + password = user_input
          </div>

          <div class="diff-line added">
            + api_key = 'SECRET'
          </div>

          <div class="diff-line normal">
            context = authenticate(user)
          </div>

          <div class="diff-line removed">
            - secret = '12345'
          </div>

          <div class="diff-line added">
            + secret = os.getenv('SECRET_KEY')
          </div>

        </div>

      </div>


      <!-- 6. SECURITY ISSUES -->

      <div class="card">

        <div class="card-title purple">

          6. Security Issues

          <span style="
            float:right;
            color:#8b949e;
            font-size:10px;
            font-weight:400;
          ">
            \${totalIssues} found
          </span>

        </div>

        \${securityHTML}

      </div>


      <!-- COMPLETED -->

      <div class="completed">

        🛡️ Security Review Completed

        <div style="
          margin-top:3px;
          color:#8b949e;
        ">
          Just now • PR Guardian AI
        </div>

      </div>

    \`;


    /*
     * -----------------------------------------------------
     * MOVE GAUGE NEEDLE
     * -----------------------------------------------------
     */

    const needle =
      document.getElementById("needle");

    if (needle) {

      /*
       * 0 = -90 degrees
       * 100 = +90 degrees
       */

      const angle =
        -90 + (score * 1.8);

      needle.style.transform =
        \`rotate(\${angle}deg)\`;

    }


    lastReviewed.classList.remove("hidden");


  } catch (error) {

    console.error(
      "PR Guardian error:",
      error
    );

    result.innerHTML = \`

      <div class="card">

        <div style="
          color:#ff6b6b;
          font-weight:700;
          margin-bottom:6px;
        ">
          ❌ Review Failed
        </div>

        <div style="
          color:#8b949e;
          font-size:11px;
          line-height:1.5;
        ">
          Cannot connect to the FastAPI backend.
          Make sure the backend is running on
          <b>127.0.0.1:8000</b>.
        </div>

      </div>

    \`;

  } finally {

    button.disabled = false;

    button.innerHTML =
      "🔍 Review Current PR";

  }

});

</script>
=======
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
>>>>>>> fa06333 (Person A complete: IBM Bob integration and VS Code extension)

</body>
</html>
`;
  }
}
