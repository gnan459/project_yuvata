/**
 * Popup Script for Yuvata Analyzer
 * Handles user clicks and communication with content script
 */

const API_BASE = "http://localhost:8000";
let analysisResults = [];

// ============================================
// DOM Elements
// ============================================

const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const statusEl = document.getElementById("status");
const statsEl = document.getElementById("stats");
const statsTitle = document.getElementById("statsTitle");
const statsContent = document.getElementById("statsContent");

// ============================================
// Button Event Listeners
// ============================================

analyzeBtn.addEventListener("click", async () => {
  setStatus("🔍 Analyzing posts on this page...", "info");
  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = '<span class="spinner"></span> Analyzing...';
  statsEl.classList.remove("show");

  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.url.includes("instagram.com")) {
      setStatus(
        "❌ This extension only works on Instagram.com",
        "error"
      );
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = "🔍 Analyze Posts";
      return;
    }

    // Send message to content script
    chrome.tabs.sendMessage(
      tab.id,
      { action: "analyzePosts" },
      (response) => {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = "🔍 Analyze Posts";

        if (chrome.runtime.lastError) {
          console.error("[Yuvata] Error:", chrome.runtime.lastError);
          setStatus(
            "⚠️ Error: Content script not loaded. Reload the Instagram page and try again.",
            "error"
          );
        } else if (response && response.success) {
          if (response.count === 0) {
            setStatus(
              "📭 No posts found. Try:\n1. Scrolling down to load more posts\n2. Refreshing the page\n3. Checking if you're on Instagram.com/feed",
              "warning"
            );
            statsEl.classList.remove("show");
          } else {
            analysisResults = response.results;
            showResults(response);
          }
        } else {
          setStatus(
            "❌ Failed to analyze posts. Refresh the page and try again.",
            "error"
          );
        }
      }
    );
  } catch (error) {
    setStatus(`❌ Error: ${error.message}`, "error");
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = "🔍 Analyze Posts";
  }
});

clearBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "clearCache" },
      (response) => {
        if (response && response.success) {
          setStatus("✅ Cache cleared successfully", "success");
          statsEl.classList.remove("show");
          setTimeout(() => {
            statusEl.classList.remove("show");
          }, 2000);
        }
      }
    );
  });
});

// ============================================
// Helper Functions
// ============================================

function setStatus(message, type = "info") {
  statusEl.textContent = message;
  statusEl.className = `status show ${type}`;
}

function showResults(response) {
  const { count, results } = response;

  if (count === 0) {
    setStatus(
      "📭 No posts found on this page. Try scrolling down to load more or refresh the page.",
      "warning"
    );
    return;
  }

  // Show stats
  statsEl.classList.add("show");
  statsTitle.textContent = `✅ Analyzed ${count} post${count !== 1 ? "s" : ""}`;

  // Build stats content
  let html = `<div style="margin-top: 8px;">`;

  const riskCounts = {};
  const predictions = { fake: 0, real: 0 };

  results.forEach((r) => {
    const level = r.overall_risk_level || "Unknown";
    riskCounts[level] = (riskCounts[level] || 0) + 1;
    if (r.prediction === "fake") {
      predictions.fake++;
    } else {
      predictions.real++;
    }
  });

  html += `<div style="margin-bottom: 8px;"><strong>📊 Risk Levels:</strong></div>`;
  Object.entries(riskCounts).forEach(([level, count]) => {
    const colors = {
      Low: "🟢",
      Medium: "🟡",
      High: "🔴",
      Critical: "🔴",
    };
    const emoji = colors[level] || "❓";
    html += `<div style="margin-left: 12px; margin-bottom: 4px;">${emoji} ${level}: <strong>${count}</strong></div>`;
  });

  html += `<div style="margin-top: 8px; border-top: 1px solid #ddd; padding-top: 8px;"><strong>🎯 Predictions:</strong></div>`;
  html += `<div style="margin-left: 12px; margin-top: 4px;">✅ Real: <strong>${predictions.real}</strong></div>`;
  html += `<div style="margin-left: 12px;">🚫 Fake: <strong>${predictions.fake}</strong></div>`;

  html += `</div>`;

  statsContent.innerHTML = html;

  // Show success message
  setStatus(
    `✅ Successfully analyzed ${count} post${count !== 1 ? "s" : ""}! Check the analysis badges on the posts.`,
    "success"
  );
}

// ============================================
// Load Status on Popup Open
// ============================================

window.addEventListener("load", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url || "";

    if (url.includes("instagram.com")) {
      setStatus("🔍 Ready to analyze. Click 'Analyze Posts' to start.", "info");
    } else {
      setStatus(
        "⚠️ Navigate to Instagram.com to use this extension.",
        "error"
      );
      analyzeBtn.disabled = true;
      analyzeBtn.style.opacity = "0.5";
    }
  });
});
