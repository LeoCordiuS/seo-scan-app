const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const { REQUEST_CONFIG, ERROR_MESSAGES } = require("./config/constants");
const { normalizeUrl, formatError } = require("./utils/helpers");
const { extractSeoData } = require("./utils/seoExtractor");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.use(express.json());

// SEO Analysis endpoint
app.get("/api/seo-data", async (req, res) => {
    let { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: ERROR_MESSAGES.URL_REQUIRED });
    }

    // Normalize URL
    url = normalizeUrl(url);

    try {
        const response = await axios.get(url, {
            timeout: REQUEST_CONFIG.TIMEOUT,
            headers: {
                "User-Agent": REQUEST_CONFIG.USER_AGENT,
            },
        });

        const $ = cheerio.load(response.data);
        const seoData = extractSeoData($, url);

        res.json(seoData);
    } catch (error) {
        console.error("Error fetching URL:", error.message);

        const { message, statusCode } = formatError(error);
        res.status(statusCode).json({ error: message });
    }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 SEO Scan App is running on http://localhost:${PORT}`);
});

module.exports = app;
