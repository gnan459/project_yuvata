/**
 * Yuvata Instagram Post Analyzer - Content Script
 * Real-time misinformation detection for Instagram posts
 */

const API_BASE = "http://localhost:8000";
const ANALYSIS_CACHE = new Map();

// ============================================
// 1. Extract Instagram Post Data
// ============================================

function extractInstagramPostData() {
  try {
    const posts = [];
    const processedCaptions = new Set(); // Track processed posts to avoid duplicates

    // Strategy 1: Look for <article> tags (most reliable)
    const articles = document.querySelectorAll("article");
    console.log(`[Yuvata] Found ${articles.length} article tags`);

    articles.forEach((article, index) => {
      try {
        let caption = "";
        let username = "";

        // Get all text content from the article
        const allText = article.innerText || article.textContent;

        // Method 1: Look for text in divs with data-testid containing "post"
        const postTextDivs = article.querySelectorAll('[data-testid], div');
        for (let div of postTextDivs) {
          const text = (div.innerText || div.textContent || "").trim();
          if (text && text.length > 20 && text.length < 1000 && !text.includes("Like") && !text.includes("Comment")) {
            caption = text;
            break;
          }
        }

        // Method 2: If still no caption, try to extract from any text node
        if (!caption) {
          const walker = document.createTreeWalker(
            article,
            NodeFilter.SHOW_TEXT,
            null,
            false
          );
          let node;
          while ((node = walker.nextNode())) {
            const text = node.textContent.trim();
            if (text && text.length > 20 && text.length < 500) {
              caption = text;
              break;
            }
          }
        }

        // Get username - look for profile link
        const userLink = article.querySelector("a[href*='/' i]");
        if (userLink) {
          const href = userLink.getAttribute("href") || "";
          username = href.split("/").filter((x) => x)[0] || userLink.innerText;
        }

        // Fallback: Extract from article text if no username found
        if (!username && allText) {
          const firstLine = allText.split("\n")[0];
          if (firstLine && firstLine.length < 50) {
            username = firstLine.trim();
          }
        }

        // Only add if we have meaningful data and haven't processed this before
        const postKey = `${caption.slice(0, 50)}_${username}`;
        if ((caption || username) && !processedCaptions.has(postKey)) {
          processedCaptions.add(postKey);
          posts.push({
            caption: caption.trim() || "(No caption detected)",
            username: (username.trim() || "unknown").replace(/[^a-zA-Z0-9._-]/g, ""),
            element: article,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.warn(`[Yuvata] Error processing article ${index}:`, e);
      }
    });

    // Strategy 2: If no articles found, try alternative selectors
    if (posts.length === 0) {
      console.log("[Yuvata] No article tags found, trying alternative selectors...");

      // Look for divs with role="article"
      const roleArticles = document.querySelectorAll('[role="article"]');
      console.log(`[Yuvata] Found ${roleArticles.length} elements with role="article"`);

      roleArticles.forEach((article, index) => {
        try {
          const caption = (article.innerText || article.textContent || "").trim().slice(0, 300);
          const links = article.querySelectorAll("a");
          let username = "unknown";

          for (let link of links) {
            const href = link.getAttribute("href") || "";
            if (href.includes("/")) {
              username = href.split("/").filter((x) => x)[0];
              break;
            }
          }

          if (caption) {
            posts.push({
              caption: caption,
              username: username,
              element: article,
              timestamp: new Date().toISOString(),
            });
          }
        } catch (e) {
          console.warn(`[Yuvata] Error processing role article ${index}:`, e);
        }
      });
    }

    console.log(`[Yuvata] Successfully extracted ${posts.length} Instagram posts`);
    return posts;
  } catch (error) {
    console.error("[Yuvata] Error extracting Instagram data:", error);
    return [];
  }
}

// ============================================
// 2. Send to Backend & Get Analysis
// ============================================

async function analyzePostWithBackend(caption, username) {
  const cacheKey = `${caption.slice(0, 50)}_${username}`;
  if (ANALYSIS_CACHE.has(cacheKey)) {
    console.log("[Yuvata] Using cached result");
    return ANALYSIS_CACHE.get(cacheKey);
  }

  try {
    console.log("[Yuvata] Analyzing post...");

    const response = await fetch(`${API_BASE}/api/evaluate-instagram-post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caption: caption,
        username: username,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const analysis = await response.json();
    ANALYSIS_CACHE.set(cacheKey, analysis);

    console.log("[Yuvata] Analysis result:", analysis);
    return analysis;
  } catch (error) {
    console.error("[Yuvata] Analysis failed:", error);
    return null;
  }
}

// ============================================
// 3. Inject Analysis Badge into Post
// ============================================

function createAnalysisBadge(analysis) {
  const badge = document.createElement("div");
  badge.className = "yuvata-analysis-badge";

  const riskLevelColor = {
    Low: "#10b981",
    Medium: "#f59e0b",
    High: "#ef4444",
    Critical: "#991b1b",
  };

  const color = riskLevelColor[analysis.overall_risk_level] || "#6b7280";
  const predictionIcon = analysis.prediction === "fake" ? "🚫" : "✅";

  badge.innerHTML = `
    <div style="
      background: ${color};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin: 8px 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      line-height: 1.5;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-left: 4px solid white;
    ">
      <div style="font-weight: 600; margin-bottom: 4px;">
        🛡️ Yuvata Analysis
      </div>
      <div style="font-size: 12px; opacity: 0.9;">
        <div>📊 Risk: <strong>${analysis.overall_risk_level}</strong></div>
        <div>${predictionIcon} Prediction: <strong>${analysis.prediction.toUpperCase()}</strong></div>
        <div>🔗 Credibility: <strong>${analysis.source_credibility}</strong></div>
        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.3);">
          ${analysis.explanation}
        </div>
      </div>
    </div>
  `;

  return badge;
}

// ============================================
// 4. Show Alert for High-Risk Content
// ============================================

function showMisinformationAlert(analysis) {
  if (
    analysis.overall_risk_level === "Critical" ||
    analysis.overall_risk_level === "High"
  ) {
    const alertDiv = document.createElement("div");
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 320px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      animation: slideIn 0.3s ease-out;
    `;

    alertDiv.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 4px;">
        ⚠️ Possible Misinformation Detected
      </div>
      <div style="font-size: 13px; line-height: 1.4;">
        This post shows signs of being ${analysis.prediction === "fake" ? "fake or misleading" : "potentially misleading"}.
        Please verify with official sources before sharing.
      </div>
    `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
  }
}

// ============================================
// 5. Add CSS Animations
// ============================================

function injectStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }

    .yuvata-analysis-badge {
      animation: slideIn 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// 6. Analyze Posts on Demand
// ============================================

async function analyzePostsOnPage() {
  console.log("[Yuvata] Starting analysis...");
  
  // Wait for content to load
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const posts = extractInstagramPostData();
  console.log(`[Yuvata] Extracted ${posts.length} posts from page`);

  if (posts.length === 0) {
    console.warn("[Yuvata] No posts found - user may need to scroll or reload");
    return {
      count: 0,
      results: [],
      message: "No posts detected. Try scrolling down to load more content.",
    };
  }

  const results = [];

  for (const post of posts) {
    const cacheKey = `${post.caption.slice(0, 50)}_${post.username}`;

    // Skip if already analyzed and badge exists
    if (ANALYSIS_CACHE.has(cacheKey)) {
      const cached = ANALYSIS_CACHE.get(cacheKey);
      results.push(cached);
      console.log(`[Yuvata] Using cached result for @${post.username}`);
      continue;
    }

    console.log(
      `[Yuvata] Analyzing: @${post.username} - "${post.caption.slice(0, 40)}..."`
    );

    const analysis = await analyzePostWithBackend(post.caption, post.username);

    if (analysis) {
      results.push(analysis);

      // Inject badge into the article
      const existingBadge = post.element.querySelector(".yuvata-analysis-badge");
      if (!existingBadge) {
        const badge = createAnalysisBadge(analysis);
        post.element.appendChild(badge);
      }

      // Show alert if risky
      showMisinformationAlert(analysis);
    }
  }

  console.log(`[Yuvata] Analysis complete - ${results.length} results returned`);
  return {
    count: results.length,
    results: results,
    message: `Successfully analyzed ${results.length} post(s)`,
  };
}

// ============================================
// 7. Message Listener (from Popup)
// ============================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzePosts") {
    console.log("[Yuvata] Received analyzePosts message from popup");
    analyzePostsOnPage().then((response) => {
      console.log("[Yuvata] Sending response:", response);
      sendResponse({
        count: response.count,
        results: response.results,
        message: response.message,
        success: true,
      });
    }).catch((error) => {
      console.error("[Yuvata] Error in analyzePostsOnPage:", error);
      sendResponse({
        count: 0,
        results: [],
        message: "Error during analysis",
        success: false,
      });
    });
    return true; // Keep the message channel open for async response
  }

  if (request.action === "clearCache") {
    ANALYSIS_CACHE.clear();
    console.log("[Yuvata] Cache cleared");
    sendResponse({ success: true });
    return true;
  }
});

// ============================================
// 8. Initialize Extension
// ============================================

function initialize() {
  injectStyles();
  console.log("[Yuvata] Content script loaded - click extension icon to analyze posts!");
}

// Wait for page to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}

