/**
 * Configuration for Yuvata Instagram Analyzer Extension
 * Customize API endpoint and analysis behavior here
 */

const CONFIG = {
  // ========================================
  // API Configuration
  // ========================================
  API: {
    BASE_URL: "http://localhost:8000",
    ENDPOINT: "/api/evaluate-instagram-post",
    TIMEOUT_MS: 10000, // 10 seconds
    RETRY_COUNT: 1,
    RETRY_DELAY_MS: 1000,
  },

  // ========================================
  // Analysis Behavior
  // ========================================
  ANALYSIS: {
    // Show badge for all posts (true) or only risky ones (false)
    SHOW_ALL_BADGES: true,
    
    // Auto-analyze posts on scroll
    AUTO_ANALYZE: true,
    
    // Minimum caption length to analyze (in characters)
    MIN_CAPTION_LENGTH: 10,
    
    // Cache results for this duration (in milliseconds)
    CACHE_DURATION_MS: 3600000, // 1 hour
  },

  // ========================================
  // Alert Configuration
  // ========================================
  ALERTS: {
    // Show alert for Critical risk
    ALERT_ON_CRITICAL: true,
    
    // Show alert for High risk
    ALERT_ON_HIGH: true,
    
    // Alert display duration (in milliseconds)
    ALERT_DURATION_MS: 5000, // 5 seconds
    
    // Sound notification (would require audio file)
    ENABLE_SOUND: false,
  },

  // ========================================
  // UI Configuration
  // ========================================
  UI: {
    // Badge position: "top-right" or "inline"
    BADGE_POSITION: "inline",
    
    // Badge styling
    COLORS: {
      LOW: "#10b981",      // Green
      MEDIUM: "#f59e0b",   // Amber
      HIGH: "#ef4444",     // Red
      CRITICAL: "#991b1b", // Dark Red
      BACKGROUND: "#ffffff",
      TEXT: "#000000",
    },
  },

  // ========================================
  // Logging
  // ========================================
  LOGGING: {
    // Enable console logs
    ENABLED: true,
    
    // Log level: "debug", "info", "warn", "error"
    LEVEL: "info",
  },

  // ========================================
  // Helper Functions
  // ========================================
  
  /**
   * Log a message with proper formatting
   */
  log: function(message, level = "info") {
    if (!this.LOGGING.ENABLED) return;
    
    const levels = ["debug", "info", "warn", "error"];
    const currentLevel = levels.indexOf(this.LOGGING.LEVEL);
    const messageLevel = levels.indexOf(level);
    
    if (messageLevel >= currentLevel) {
      const timestamp = new Date().toLocaleTimeString();
      const prefix = `[${timestamp}] [Yuvata] [${level.toUpperCase()}]`;
      console.log(`${prefix} ${message}`);
    }
  },

  /**
   * Get risk color based on level
   */
  getRiskColor: function(riskLevel) {
    const colors = {
      Low: this.UI.COLORS.LOW,
      Medium: this.UI.COLORS.MEDIUM,
      High: this.UI.COLORS.HIGH,
      Critical: this.UI.COLORS.CRITICAL,
    };
    return colors[riskLevel] || "#6b7280";
  },

  /**
   * Check if alert should be shown
   */
  shouldShowAlert: function(riskLevel) {
    if (riskLevel === "Critical" && this.ALERTS.ALERT_ON_CRITICAL) return true;
    if (riskLevel === "High" && this.ALERTS.ALERT_ON_HIGH) return true;
    return false;
  },
};

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG;
}
