const form = document.getElementById('seo-form');
const urlInput = document.getElementById('url-input');
const resultsContainer = document.getElementById('results-container');
const loader = document.getElementById('loader');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = urlInput.value;

    if (!url) {
        return;
    }

    resultsContainer.innerHTML = '';
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

    const list = document.createElement('ul');
    feedback.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
    });

    container.appendChild(list);
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

function renderError(message) {
    resultsContainer.innerHTML = `<p class="error">Error: ${message}</p>`;
}