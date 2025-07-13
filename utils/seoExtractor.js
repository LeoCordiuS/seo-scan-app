// SEO data extraction utilities

const { SELECTORS } = require("../config/constants");
const { safeExtractText, safeExtractAttr } = require("../utils/helpers");

/**
 * Extracts favicon URL from HTML
 * @param {CheerioStatic} $ - Cheerio instance
 * @param {string} baseUrl - Base URL for resolving relative paths
 * @returns {string|null} - Favicon URL or null
 */
function extractFavicon($, baseUrl) {
    let favicon = null;

    // Try different favicon selectors
    for (const selector of SELECTORS.FAVICON) {
        favicon = safeExtractAttr($, selector, "href");
        if (favicon) break;
    }

    // Resolve relative URLs
    if (favicon && !favicon.startsWith("http")) {
        try {
            favicon = new URL(favicon, baseUrl).href;
        } catch {
            favicon = null;
        }
    }

    return favicon;
}

/**
 * Extracts basic SEO metadata
 * @param {CheerioStatic} $ - Cheerio instance
 * @returns {object} - Basic SEO data
 */
function extractBasicSeoData($) {
    return {
        title: safeExtractText($, "title"),
        description: safeExtractAttr($, SELECTORS.META_DESCRIPTION, "content"),
        canonical: safeExtractAttr($, SELECTORS.CANONICAL, "href"),
        viewport: safeExtractAttr($, SELECTORS.META_VIEWPORT, "content"),
    };
}

/**
 * Extracts Open Graph metadata
 * @param {CheerioStatic} $ - Cheerio instance
 * @returns {object} - Open Graph data
 */
function extractOpenGraphData($) {
    return {
        ogTitle: safeExtractAttr($, SELECTORS.OG_TITLE, "content"),
        ogDescription: safeExtractAttr($, SELECTORS.OG_DESCRIPTION, "content"),
        ogImage: safeExtractAttr($, SELECTORS.OG_IMAGE, "content"),
    };
}

/**
 * Extracts Twitter Card metadata
 * @param {CheerioStatic} $ - Cheerio instance
 * @returns {object} - Twitter Card data
 */
function extractTwitterData($) {
    return {
        twitterCard: safeExtractAttr($, SELECTORS.TWITTER_CARD, "content"),
        twitterTitle: safeExtractAttr($, SELECTORS.TWITTER_TITLE, "content"),
        twitterDescription: safeExtractAttr($, SELECTORS.TWITTER_DESCRIPTION, "content"),
        twitterImage: safeExtractAttr($, SELECTORS.TWITTER_IMAGE, "content"),
    };
}

/**
 * Extracts heading and image statistics
 * @param {CheerioStatic} $ - Cheerio instance
 * @returns {object} - Content statistics
 */
function extractContentStats($) {
    return {
        h1: $("h1").length,
        h2: $("h2").length,
        alt_tags: {
            with_alt: $(SELECTORS.IMAGES_WITH_ALT).length,
            without_alt: $(SELECTORS.IMAGES_WITHOUT_ALT).length,
        },
    };
}

/**
 * Extracts all SEO data from HTML
 * @param {CheerioStatic} $ - Cheerio instance
 * @param {string} baseUrl - Base URL for resolving relative paths
 * @returns {object} - Complete SEO data
 */
function extractSeoData($, baseUrl) {
    const basicData = extractBasicSeoData($);
    const ogData = extractOpenGraphData($);
    const twitterData = extractTwitterData($);
    const contentStats = extractContentStats($);
    const favicon = extractFavicon($, baseUrl);

    return {
        ...basicData,
        ...ogData,
        ...twitterData,
        ...contentStats,
        favicon,
    };
}

module.exports = {
    extractFavicon,
    extractBasicSeoData,
    extractOpenGraphData,
    extractTwitterData,
    extractContentStats,
    extractSeoData,
};
