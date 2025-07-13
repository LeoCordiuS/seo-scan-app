
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/api/seo-data', async (req, res) => {
    let { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');
        if (favicon && !favicon.startsWith('http')) {
            favicon = new URL(favicon, url).href;
        }

        const seoData = {
            title: $('title').text(),
            description: $('meta[name="description"]').attr('content'),
            favicon: favicon,
            ogTitle: $('meta[property="og:title"]').attr('content'),
            ogDescription: $('meta[property="og:description"]').attr('content'),
            ogImage: $('meta[property="og:image"]').attr('content'),
            twitterCard: $('meta[name="twitter:card"]').attr('content'),
            twitterTitle: $('meta[name="twitter:title"]').attr('content'),
            twitterDescription: $('meta[name="twitter:description"]').attr('content'),
            twitterImage: $('meta[name="twitter:image"]').attr('content'),
        };

        res.json(seoData);
    } catch (error) {
        console.error('Error fetching URL:', error.message);
        res.status(500).json({ error: `Failed to fetch or parse the URL. ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
