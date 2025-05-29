const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = "ALOSTOURA-TV/taqwim";
const WORKFLOW = "update-login-file.yml";

app.post("/register", async (req, res) => {
  try {
    const userData = JSON.stringify(req.body);
    const triggerUrl = `https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`;

    const response = await fetch(triggerUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        ref: "main",
        inputs: { userData }
      })
    });

    if (response.ok) {
      res.status(200).send("✅ User data sent to GitHub Action.");
    } else {
      const error = await response.text();
      res.status(500).send("❌ GitHub API error:\n" + error);
    }
  } catch (err) {
    res.status(500).send("❌ Server error:\n" + err.message);
  }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
