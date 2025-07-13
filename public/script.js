const form = document.getElementById('seo-form');
const urlInput = document.getElementById('url-input');
const resultsContainer = document.getElementById('results-container');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = urlInput.value;

    if (!url) {
        return;
    }

    resultsContainer.innerHTML = 'Loading...';

    try {
        const response = await fetch(`/api/seo-data?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (response.ok) {
            renderResults(data, url);
        } else {
            resultsContainer.innerHTML = `<p>Error: ${data.error}</p>`;
        }
    } catch (error) {
        resultsContainer.innerHTML = '<p>Error: Failed to fetch data</p>';
    }
});

function renderResults(data, url) {
    resultsContainer.innerHTML = '';

    // SEO Feedback
    const feedback = getSeoFeedback(data);
    const feedbackHtml = `
        <div class="feedback">
            <h3>SEO Feedback</h3>
            <ul>
                ${feedback.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `;
    resultsContainer.innerHTML += feedbackHtml;

    // Google Preview
    const googlePreviewHtml = `
        <div class="preview google-preview">
            <h3>Google Preview</h3>
            <img src="${data.favicon}" class="favicon" alt="Favicon">
            <p class="title">${data.title || 'No Title'}</p>
            <p class="link">${url}</p>
            <p class="description">${data.description || 'No Description'}</p>
        </div>
    `;
    resultsContainer.innerHTML += googlePreviewHtml;

    // Social Media Preview
    const socialPreviewHtml = `
        <div class="preview social-preview">
            <h3>Social Media Preview</h3>
            <div class="image" style="background-image: url(${data.ogImage || ''})"></div>
            <div class="content">
                <p class="title">${data.ogTitle || data.title || 'No Title'}</p>
                <p class="description">${data.ogDescription || data.description || 'No Description'}</p>
            </div>
        </div>
    `;
    resultsContainer.innerHTML += socialPreviewHtml;
}

function getSeoFeedback(data) {
    const feedback = [];

    if (!data.title) {
        feedback.push('Title tag is missing.');
    } else if (data.title.length > 60) {
        feedback.push('Title is too long (ideally under 60 characters).');
    }

    if (!data.description) {
        feedback.push('Meta description is missing.');
    } else if (data.description.length > 160) {
        feedback.push('Meta description is too long (ideally under 160 characters).');
    }

    if (!data.favicon) {
        feedback.push('Favicon is missing.');
    }

    if (!data.ogTitle) {
        feedback.push('Open Graph title (og:title) is missing.');
    }

    if (!data.ogDescription) {
        feedback.push('Open Graph description (og:description) is missing.');
    }

    if (!data.ogImage) {
        feedback.push('Open Graph image (og:image) is missing.');
    }

    if (!data.twitterCard) {
        feedback.push('Twitter card (twitter:card) is missing.');
    }

    if (feedback.length === 0) {
        feedback.push('All good!');
    }

    return feedback;
}
