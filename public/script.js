const form = document.getElementById('seo-form');
const urlInput = document.getElementById('url-input');
const resultsContainer = document.getElementById('results-container');
const summaryContainer = document.getElementById('summary-container');
const loader = document.getElementById('loader');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = urlInput.value;

    if (!url) {
        return;
    }

    resultsContainer.innerHTML = '';
    summaryContainer.style.display = 'none';
    loader.style.display = 'block';

    try {
        const response = await fetch(`/api/seo-data?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (response.ok) {
            renderResults(data, url);
        } else {
            renderError(data.error);
        }
    } catch (error) {
        renderError('Failed to fetch data');
    } finally {
        loader.style.display = 'none';
    }
});

function renderResults(data, url) {
    resultsContainer.innerHTML = '';
    summaryContainer.style.display = 'block';

    const tabs = createTabs();
    const feedbackContent = createFeedbackContent(data);
    const googlePreviewContent = createGooglePreviewContent(data, url);
    const socialPreviewContent = createSocialPreviewContent(data);

    tabs.feedback.appendChild(feedbackContent);
    tabs.google.appendChild(googlePreviewContent);
    tabs.social.appendChild(socialPreviewContent);

    resultsContainer.appendChild(tabs.nav);
    resultsContainer.appendChild(tabs.contentContainer);

    // Activate the first tab
    tabs.nav.querySelector('button').classList.add('active');
    tabs.google.classList.add('active');

    renderSummary(data);
}

function renderSummary(data) {
    const feedback = getSeoFeedback(data);
    const score = calculateSeoScore(feedback);

    renderScoreChart(score);

    const goodIssues = document.getElementById('good-issues');
    const warningIssues = document.getElementById('warning-issues');
    const badIssues = document.getElementById('bad-issues');

    goodIssues.innerHTML = '';
    warningIssues.innerHTML = '';
    badIssues.innerHTML = '';

    feedback.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.title;
        if (item.type === 'good') {
            goodIssues.appendChild(li);
        } else if (item.type === 'warning') {
            warningIssues.appendChild(li);
        } else {
            badIssues.appendChild(li);
        }
    });
}

function renderScoreChart(score) {
    const ctx = document.getElementById('seo-score-chart').getContext('2d');
    const scoreColor = score >= 70 ? '#28a745' : (score >= 40 ? '#ffc107' : '#dc3545');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [score, 100 - score],
                backgroundColor: [scoreColor, '#e0e0e0'],
                borderWidth: 0,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%',
            plugins: {
                tooltip: {
                    enabled: false,
                },
                legend: {
                    display: false,
                },
            },
            elements: {
                arc: {
                    borderWidth: 0,
                },
            },
            animation: {
                animateRotate: true,
                animateScale: true,
            },
        },
        plugins: [{
            id: 'textCenter',
            beforeDraw: function(chart) {
                const width = chart.width,
                      height = chart.height,
                      ctx = chart.ctx;

                ctx.restore();
                const fontSize = (height / 114).toFixed(2);
                ctx.font = `bold ${fontSize}em sans-serif`;
                ctx.textBaseline = 'middle';

                const text = `${score}%`;
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2;

                ctx.fillStyle = '#333';
                ctx.fillText(text, textX, textY);
                ctx.save();
            }
        }]
    });
}

function calculateSeoScore(feedback) {
    const total = feedback.length;
    const good = feedback.filter(item => item.type === 'good').length;
    const warning = feedback.filter(item => item.type === 'warning').length;
    const bad = feedback.filter(item => item.type === 'bad').length;

    const score = Math.round(((good + warning * 0.5) / total) * 100);
    return score;
}

function createTabs() {
    const nav = document.createElement('div');
    nav.className = 'tabs';

    const contentContainer = document.createElement('div');
    contentContainer.className = 'tab-content';

    const tabs = {
        nav,
        contentContainer,
        google: createTab('Google Preview', nav, contentContainer),
        social: createTab('Social Preview', nav, contentContainer),
        feedback: createTab('Feedback', nav, contentContainer),
    };

    return tabs;
}

function createTab(name, nav, contentContainer) {
    const button = document.createElement('button');
    button.textContent = name;
    nav.appendChild(button);

    const content = document.createElement('div');
    content.id = name.toLowerCase().replace(' ', '-');
    contentContainer.appendChild(content);

    button.addEventListener('click', () => {
        nav.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        contentContainer.querySelectorAll('div').forEach(c => c.classList.remove('active'));
        button.classList.add('active');
        content.classList.add('active');
    });

    return content;
}

function createFeedbackContent(data) {
    const container = document.createElement('div');
    const feedback = getSeoFeedback(data);

    feedback.forEach(item => {
        const card = document.createElement('div');
        card.className = `feedback-card ${item.type}`;

        const title = document.createElement('h4');
        title.textContent = item.title;
        card.appendChild(title);

        const description = document.createElement('p');
        description.textContent = item.description;
        card.appendChild(description);

        if (item.recommendation) {
            const recommendation = document.createElement('p');
            recommendation.className = 'recommendation';
            recommendation.textContent = `Recommendation: ${item.recommendation}`;
            card.appendChild(recommendation);
        }

        container.appendChild(card);
    });

    return container;
}

function createGooglePreviewContent(data, url) {
    const container = document.createElement('div');
    container.className = 'preview google-preview';

    if (data.favicon) {
        const favicon = document.createElement('img');
        favicon.src = data.favicon;
        favicon.className = 'favicon';
        favicon.alt = 'Favicon';
        container.appendChild(favicon);
    }

    const title = document.createElement('p');
    title.className = 'title';
    title.textContent = data.title || 'No Title';
    container.appendChild(title);

    const link = document.createElement('p');
    link.className = 'link';
    link.textContent = url;
    container.appendChild(link);

    const description = document.createElement('p');
    description.className = 'description';
    description.textContent = data.description || 'No Description';
    container.appendChild(description);

    return container;
}

function createSocialPreviewContent(data) {
    const container = document.createElement('div');
    container.className = 'preview social-preview';

    const image = document.createElement('div');
    image.className = 'image';
    image.style.backgroundImage = `url(${data.ogImage || ''})`;
    container.appendChild(image);

    const content = document.createElement('div');
    content.className = 'content';

    const title = document.createElement('p');
    title.className = 'title';
    title.textContent = data.ogTitle || data.title || 'No Title';
    content.appendChild(title);

    const description = document.createElement('p');
    description.className = 'description';
    description.textContent = data.ogDescription || data.description || 'No Description';
    content.appendChild(description);

    container.appendChild(content);
    return container;
}

function getSeoFeedback(data) {
    const feedback = [];

    // Title
    if (!data.title) {
        feedback.push({ type: 'bad', title: 'Title Missing', description: 'The title tag is essential for SEO and should be present on every page.', recommendation: 'Add a unique and descriptive title tag to your page.' });
    } else if (data.title.length > 60) {
        feedback.push({ type: 'warning', title: 'Title Too Long', description: 'Your title is over 60 characters. It may be truncated in search results.', recommendation: 'Keep your title tag under 60 characters.' });
    } else {
        feedback.push({ type: 'good', title: 'Title Length', description: 'Your title tag is a good length.' });
    }

    // Description
    if (!data.description) {
        feedback.push({ type: 'bad', title: 'Meta Description Missing', description: 'The meta description provides a summary of your page in search results.', recommendation: 'Add a unique meta description, ideally between 50-160 characters.' });
    } else if (data.description.length > 160) {
        feedback.push({ type: 'warning', title: 'Meta Description Too Long', description: 'Your meta description is over 160 characters and may be cut off.', recommendation: 'Keep your meta description under 160 characters.' });
    } else {
        feedback.push({ type: 'good', title: 'Meta Description Length', description: 'Your meta description is a good length.' });
    }

    // Favicon
    if (data.favicon) {
        feedback.push({ type: 'good', title: 'Favicon Present', description: 'A favicon helps with brand recognition in browser tabs and bookmarks.' });
    } else {
        feedback.push({ type: 'warning', title: 'Favicon Missing', description: 'A favicon is missing. It helps with brand recognition.', recommendation: 'Add a favicon to your site.' });
    }

    // Headings
    if (data.h1 === 1) {
        feedback.push({ type: 'good', title: 'Single H1 Tag', description: 'You have one H1 tag, which is great for defining the main topic of your page.' });
    } else {
        feedback.push({ type: 'bad', title: 'H1 Tag Issue', description: `You have ${data.h1} H1 tags. Each page should have exactly one H1 tag.`, recommendation: 'Ensure there is one and only one H1 tag on the page.' });
    }

    // Alt Tags
    if (data.alt_tags.without_alt > 0) {
        feedback.push({ type: 'warning', title: 'Missing Alt Tags', description: `You have ${data.alt_tags.without_alt} images missing alt tags. Alt tags are important for accessibility and image SEO.`, recommendation: 'Add descriptive alt tags to all your images.' });
    } else {
        feedback.push({ type: 'good', title: 'Alt Tags', description: 'All your images have alt tags.' });
    }

    // Canonical URL
    if (data.canonical) {
        feedback.push({ type: 'good', title: 'Canonical URL', description: 'You have a canonical URL, which helps prevent duplicate content issues.' });
    } else {
        feedback.push({ type: 'warning', title: 'Canonical URL Missing', description: 'A canonical URL is recommended to specify the preferred version of a page.', recommendation: 'Add a rel="canonical" link tag to your page.' });
    }

    // Viewport
    if (data.viewport) {
        feedback.push({ type: 'good', title: 'Mobile Viewport', description: 'You have a viewport meta tag, which is essential for mobile-friendliness.' });
    } else {
        feedback.push({ type: 'bad', title: 'Mobile Viewport Missing', description: 'The viewport meta tag is missing. Your site may not render correctly on mobile devices.', recommendation: 'Add a viewport meta tag to your page.' });
    }

    return feedback;
}

function renderChart(data) {
    const feedback = getSeoFeedback(data);
    const chartData = {
        good: feedback.filter(item => item.type === 'good').length,
        warning: feedback.filter(item => item.type === 'warning').length,
        bad: feedback.filter(item => item.type === 'bad').length,
    };

    const summaryText = document.getElementById('summary-text');
    summaryText.innerHTML = `
        <h3>Summary</h3>
        <p><span class="good-dot"></span><strong>Good:</strong> ${chartData.good} checks passed.</p>
        <p><span class="warning-dot"></span><strong>Warning:</strong> ${chartData.warning} items to review.</p>
        <p><span class="bad-dot"></span><strong>Bad:</strong> ${chartData.bad} critical issues found.</p>
    `;

    const ctx = document.getElementById('seo-chart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Good', 'Warning', 'Bad'],
            datasets: [{
                data: [chartData.good, chartData.warning, chartData.bad],
                backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'bottom',
            },
        },
    });
}

function renderError(message) {
    resultsContainer.innerHTML = `<p class="error">Error: ${message}</p>`;
}
