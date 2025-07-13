// SEO feedback generation module

/**
 * Generates SEO feedback based on analyzed data
 * @param {Object} data - SEO data object
 * @returns {Array} - Array of feedback items
 */
function generateSeoFeedback(data) {
    const feedback = [];

    // Get SEO_LIMITS from the config, with fallback values
    const SEO_LIMITS = window.SeoScanConfig?.SEO_LIMITS || {
        TITLE_MAX_LENGTH: 60,
        DESCRIPTION_MAX_LENGTH: 160,
        DESCRIPTION_MIN_LENGTH: 50,
    };

    // Title validation
    if (!data.title) {
        feedback.push({
            type: "bad",
            title: "Title Missing",
            description: "The title tag is essential for SEO and should be present on every page.",
            recommendation: "Add a unique and descriptive title tag to your page.",
        });
    } else if (data.title.length > SEO_LIMITS.TITLE_MAX_LENGTH) {
        feedback.push({
            type: "warning",
            title: "Title Too Long",
            description: `Your title is over ${SEO_LIMITS.TITLE_MAX_LENGTH} characters. It may be truncated in search results.`,
            recommendation: `Keep your title tag under ${SEO_LIMITS.TITLE_MAX_LENGTH} characters.`,
        });
    } else {
        feedback.push({
            type: "good",
            title: "Title Length",
            description: "Your title tag is a good length.",
        });
    }

    // Description validation
    if (!data.description) {
        feedback.push({
            type: "bad",
            title: "Meta Description Missing",
            description: "The meta description provides a summary of your page in search results.",
            recommendation: `Add a unique meta description, ideally between ${SEO_LIMITS.DESCRIPTION_MIN_LENGTH}-${SEO_LIMITS.DESCRIPTION_MAX_LENGTH} characters.`,
        });
    } else if (data.description.length > SEO_LIMITS.DESCRIPTION_MAX_LENGTH) {
        feedback.push({
            type: "warning",
            title: "Meta Description Too Long",
            description: `Your meta description is over ${SEO_LIMITS.DESCRIPTION_MAX_LENGTH} characters and may be cut off.`,
            recommendation: `Keep your meta description under ${SEO_LIMITS.DESCRIPTION_MAX_LENGTH} characters.`,
        });
    } else {
        feedback.push({
            type: "good",
            title: "Meta Description Length",
            description: "Your meta description is a good length.",
        });
    }

    // Favicon validation
    if (data.favicon) {
        feedback.push({
            type: "good",
            title: "Favicon Present",
            description: "A favicon helps with brand recognition in browser tabs and bookmarks.",
        });
    } else {
        feedback.push({
            type: "warning",
            title: "Favicon Missing",
            description: "A favicon is missing. It helps with brand recognition.",
            recommendation: "Add a favicon to your site.",
        });
    }

    // H1 tags validation
    if (data.h1 === 1) {
        feedback.push({
            type: "good",
            title: "Single H1 Tag",
            description: "You have one H1 tag, which is great for defining the main topic of your page.",
        });
    } else {
        feedback.push({
            type: "bad",
            title: "H1 Tag Issue",
            description: `You have ${data.h1} H1 tags. Each page should have exactly one H1 tag.`,
            recommendation: "Ensure there is one and only one H1 tag on the page.",
        });
    }

    // Alt tags validation
    if (data.alt_tags && data.alt_tags.without_alt > 0) {
        feedback.push({
            type: "warning",
            title: "Missing Alt Tags",
            description: `You have ${data.alt_tags.without_alt} images missing alt tags. Alt tags are important for accessibility and image SEO.`,
            recommendation: "Add descriptive alt tags to all your images.",
        });
    } else {
        feedback.push({
            type: "good",
            title: "Alt Tags",
            description: "All your images have alt tags.",
        });
    }

    // Canonical URL validation
    if (data.canonical) {
        feedback.push({
            type: "good",
            title: "Canonical URL",
            description: "You have a canonical URL, which helps prevent duplicate content issues.",
        });
    } else {
        feedback.push({
            type: "warning",
            title: "Canonical URL Missing",
            description: "A canonical URL is recommended to specify the preferred version of a page.",
            recommendation: 'Add a rel="canonical" link tag to your page.',
        });
    }

    // Viewport validation
    if (data.viewport) {
        feedback.push({
            type: "good",
            title: "Mobile Viewport",
            description: "You have a viewport meta tag, which is essential for mobile-friendliness.",
        });
    } else {
        feedback.push({
            type: "bad",
            title: "Mobile Viewport Missing",
            description: "The viewport meta tag is missing. Your site may not render correctly on mobile devices.",
            recommendation: "Add a viewport meta tag to your page.",
        });
    }

    return feedback;
}

// Export for use in main script
window.SeoFeedback = {
    generateSeoFeedback,
};
