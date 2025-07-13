// Frontend configuration and utilities

// Constants mirrored from server-side config
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

const COLORS = {
    PRIMARY: "#1a73e8",
    SUCCESS: "#28a745",
    WARNING: "#ffc107",
    ERROR: "#dc3545",
    NEUTRAL: "#e0e0e0",
};

const ERROR_MESSAGES = {
    INVALID_URL: "Please enter a valid URL (e.g., example.com or https://example.com)",
    NETWORK_ERROR: "Network error",
    UNKNOWN_ERROR: "An unknown error occurred",
    EMPTY_URL: "Please enter a valid URL",
};

// Utility functions
const Utils = {
    /**
     * Validates if a string is a valid URL
     */
    isValidUrl(string) {
        try {
            if (!/^https?:\/\//i.test(string)) {
                string = "https://" + string;
            }

            const url = new URL(string);

            if (!url.hostname || url.hostname.length < SEO_LIMITS.HOSTNAME_MIN_LENGTH) {
                return false;
            }

            if (url.hostname !== "localhost" && !url.hostname.includes(".")) {
                return false;
            }

            return true;
        } catch (_) {
            return false;
        }
    },

    /**
     * Truncates text to specified length
     */
    truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + "...";
    },

    /**
     * Checks if a value is empty
     */
    isEmpty(value) {
        return value === null || value === undefined || value === "";
    },

    /**
     * Creates a DOM element with specified attributes
     */
    createElement(tag, className, textContent) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    },

    /**
     * Safely sets element attributes
     */
    setAttributes(element, attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    },

    /**
     * Calculates SEO score based on feedback
     */
    calculateSeoScore(feedback) {
        const total = feedback.length;
        const good = feedback.filter((item) => item.type === "good").length;
        const warning = feedback.filter((item) => item.type === "warning").length;

        return Math.round(((good + warning * SCORE_THRESHOLDS.WARNING_WEIGHT) / total) * 100);
    },

    /**
     * Gets color based on score
     */
    getScoreColor(score) {
        if (score >= SCORE_THRESHOLDS.GOOD) return COLORS.SUCCESS;
        if (score >= SCORE_THRESHOLDS.WARNING) return COLORS.WARNING;
        return COLORS.ERROR;
    },

    /**
     * Debounces a function call
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
};

// Export for use in other modules
window.SeoScanConfig = {
    SEO_LIMITS,
    SCORE_THRESHOLDS,
    COLORS,
    ERROR_MESSAGES,
    Utils,
};
