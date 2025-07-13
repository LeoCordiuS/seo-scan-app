// Configuration constants for the SEO Scan App

const SEO_LIMITS = {
    TITLE_MAX_LENGTH: 60,
    DESCRIPTION_MAX_LENGTH: 160,
    DESCRIPTION_MIN_LENGTH: 50,
    URL_TRUNCATE_LENGTH: 100,
    HOSTNAME_MIN_LENGTH: 3,
};

const SCORE_THRESHOLDS = {
    GOOD: 70,
    WARNING: 40,
    WARNING_WEIGHT: 0.5,
};

const REQUEST_CONFIG = {
    TIMEOUT: 10000,
    USER_AGENT:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
};

const UI_CONFIG = {
    ANIMATION_DURATION: 300,
    TOOLTIP_DELAY: 300,
    LOADER_SIZE: 40,
    CHART_CUTOUT: "80%",
};

const SELECTORS = {
    FAVICON: ['link[rel="icon"]', 'link[rel="shortcut icon"]', 'link[rel="apple-touch-icon"]'],
    META_DESCRIPTION: 'meta[name="description"]',
    META_VIEWPORT: 'meta[name="viewport"]',
    CANONICAL: 'link[rel="canonical"]',
    OG_TITLE: 'meta[property="og:title"]',
    OG_DESCRIPTION: 'meta[property="og:description"]',
    OG_IMAGE: 'meta[property="og:image"]',
    TWITTER_CARD: 'meta[name="twitter:card"]',
    TWITTER_TITLE: 'meta[name="twitter:title"]',
    TWITTER_DESCRIPTION: 'meta[name="twitter:description"]',
    TWITTER_IMAGE: 'meta[name="twitter:image"]',
    IMAGES_WITH_ALT: 'img[alt][alt!=""]',
    IMAGES_WITHOUT_ALT: 'img:not([alt]), img[alt=""]',
};

const COLORS = {
    PRIMARY: "#1a73e8",
    PRIMARY_HOVER: "#1558b3",
    SUCCESS: "#28a745",
    WARNING: "#ffc107",
    ERROR: "#dc3545",
    NEUTRAL: "#e0e0e0",
    TEXT_PRIMARY: "#333",
    TEXT_SECONDARY: "#5f6368",
    TEXT_MUTED: "#a0aec0",
    BACKGROUND: "#f0f2f5",
    WHITE: "#fff",
    TOOLTIP_BG: "#2d3748",
};

const ERROR_MESSAGES = {
    URL_REQUIRED: "URL is required",
    DOMAIN_NOT_FOUND: "Domain not found. Please check the URL.",
    CONNECTION_REFUSED: "Connection refused. The server might be down.",
    REQUEST_TIMEOUT: "Request timed out. The server took too long to respond.",
    INVALID_URL: "Please enter a valid URL (e.g., example.com or https://example.com)",
    NETWORK_ERROR: "Network error",
    UNKNOWN_ERROR: "An unknown error occurred",
};

module.exports = {
    SEO_LIMITS,
    SCORE_THRESHOLDS,
    REQUEST_CONFIG,
    UI_CONFIG,
    SELECTORS,
    COLORS,
    ERROR_MESSAGES,
};
