// Utility functions for the SEO Scan App

const { SEO_LIMITS, ERROR_MESSAGES } = require("../config/constants");

/**
 * Validates if a string is a valid URL
 * @param {string} string - The URL string to validate
 * @returns {boolean} - True if valid URL, false otherwise
 */
function isValidUrl(string) {
    try {
        // If it doesn't start with http/https, add https
        if (!/^https?:\/\//i.test(string)) {
            string = "https://" + string;
        }

        // Basic validation for domain format
        const url = new URL(string);

        // Check if it has a valid domain
        if (!url.hostname || url.hostname.length < SEO_LIMITS.HOSTNAME_MIN_LENGTH) {
            return false;
        }

        // Check if hostname has at least one dot (except localhost)
        if (url.hostname !== "localhost" && !url.hostname.includes(".")) {
            return false;
        }

        return true;
    } catch (_) {
        return false;
    }
}

/**
 * Normalizes a URL by adding protocol if missing
 * @param {string} url - The URL to normalize
 * @returns {string} - Normalized URL
 */
function normalizeUrl(url) {
    if (!/^https?:\/\//i.test(url)) {
        return "https://" + url;
    }
    return url;
}

/**
 * Truncates text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + "...";
}

/**
 * Checks if a value is empty (null, undefined, or empty string)
 * @param {*} value - Value to check
 * @returns {boolean} - True if empty, false otherwise
 */
function isEmpty(value) {
    return value === null || value === undefined || value === "";
}

/**
 * Formats error message based on error type
 * @param {Error} error - The error object
 * @returns {object} - Formatted error with message and status code
 */
function formatError(error) {
    let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
    let statusCode = 500;

    if (error.code === "ENOTFOUND") {
        errorMessage = ERROR_MESSAGES.DOMAIN_NOT_FOUND;
        statusCode = 404;
    } else if (error.code === "ECONNREFUSED") {
        errorMessage = ERROR_MESSAGES.CONNECTION_REFUSED;
        statusCode = 502;
    } else if (error.code === "ETIMEDOUT") {
        errorMessage = ERROR_MESSAGES.REQUEST_TIMEOUT;
        statusCode = 504;
    } else if (error.response) {
        statusCode = error.response.status;
        errorMessage = `Server responded with status ${statusCode}`;
    }

    return { message: errorMessage, statusCode };
}

/**
 * Safely extracts text content from Cheerio selector
 * @param {CheerioStatic} $ - Cheerio instance
 * @param {string} selector - CSS selector
 * @returns {string|null} - Extracted text or null
 */
function safeExtractText($, selector) {
    const element = $(selector);
    return element.length > 0 ? element.text().trim() : null;
}

/**
 * Safely extracts attribute content from Cheerio selector
 * @param {CheerioStatic} $ - Cheerio instance
 * @param {string} selector - CSS selector
 * @param {string} attribute - Attribute name
 * @returns {string|null} - Extracted attribute value or null
 */
function safeExtractAttr($, selector, attribute) {
    const element = $(selector);
    const value = element.attr(attribute);
    return value ? value.trim() : null;
}

module.exports = {
    isValidUrl,
    normalizeUrl,
    truncateText,
    isEmpty,
    formatError,
    safeExtractText,
    safeExtractAttr,
};
