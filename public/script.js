// Main SEO Scan App Script

// Wait for all dependencies to load
document.addEventListener("DOMContentLoaded", function () {
    // Function to check if dependencies are loaded
    function checkDependencies() {
        return (
            window.SeoScanConfig &&
            window.SeoFeedback &&
            window.SeoScanConfig.Utils &&
            window.SeoScanConfig.ERROR_MESSAGES
        );
    }

    // Wait for dependencies with retry mechanism
    function initializeApp() {
        if (checkDependencies()) {
            const { Utils, ERROR_MESSAGES, SEO_LIMITS } = window.SeoScanConfig;
            const { generateSeoFeedback } = window.SeoFeedback;

            // Initialize the app
            setupApp(Utils, ERROR_MESSAGES, SEO_LIMITS, generateSeoFeedback);
        } else {
            console.warn("Dependencies not ready, retrying...");
            setTimeout(initializeApp, 100);
        }
    }

    // Start initialization
    initializeApp();

    function setupApp(Utils, ERROR_MESSAGES, SEO_LIMITS, generateSeoFeedback) {
        // DOM elements
        const form = document.getElementById("seo-form");
        const urlInput = document.getElementById("url-input");
        const resultsContainer = document.getElementById("results-container");
        const summaryContainer = document.getElementById("summary-container");
        const loader = document.getElementById("loader");

        // Chart instance
        let seoScoreChartInstance = null;

        // Form submission handler
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const url = urlInput.value.trim();

            if (!url) {
                showError(ERROR_MESSAGES.EMPTY_URL);
                return;
            }

            // Basic URL validation
            if (!Utils.isValidUrl(url)) {
                showError(ERROR_MESSAGES.INVALID_URL);
                return;
            }

            // Reset UI
            resetUI();
            showLoader();

            try {
                const response = await fetch(`/api/seo-data?url=${encodeURIComponent(url)}`);
                const data = await response.json();

                if (response.ok) {
                    renderResults(data, url);
                } else {
                    showError(data.error || ERROR_MESSAGES.UNKNOWN_ERROR);
                }
            } catch (error) {
                showError(`${ERROR_MESSAGES.NETWORK_ERROR}: ${error.message}`);
            } finally {
                hideLoader();
            }
        });

        // UI helper functions
        function resetUI() {
            resultsContainer.innerHTML = "";
            summaryContainer.style.display = "none";
        }

        function showLoader() {
            loader.style.display = "block";
        }

        function hideLoader() {
            loader.style.display = "none";
        }

        function showError(message) {
            resultsContainer.innerHTML = `<p class="error">Error: ${message}</p>`;
            summaryContainer.style.display = "none";
        }

        function renderResults(data, url) {
            resultsContainer.innerHTML = "";
            summaryContainer.style.display = "block";

            const tabs = createTabs();
            const feedbackContent = createFeedbackContent(data);
            const googlePreviewContent = createGooglePreviewContent(data, url);
            const socialPreviewContent = createSocialPreviewContent(data);

            tabs.feedback.appendChild(feedbackContent);
            tabs.google.appendChild(googlePreviewContent);
            tabs.social.appendChild(socialPreviewContent);
            tabs.properties.appendChild(createPropertiesContent(data));

            resultsContainer.appendChild(tabs.nav);
            resultsContainer.appendChild(tabs.contentContainer);

            // Activate the first tab (Google Preview)
            const firstButton = tabs.nav.querySelector('button[data-tab="google-preview"]');
            if (firstButton) {
                activateTab(firstButton, tabs.google, tabs.nav, tabs.contentContainer);
            }

            renderSummary(data);
        }

        function renderSummary(data) {
            const feedback = generateSeoFeedback(data);
            const score = Utils.calculateSeoScore(feedback);

            renderScoreChart(score);

            const goodIssues = document.getElementById("good-issues");
            const warningIssues = document.getElementById("warning-issues");
            const badIssues = document.getElementById("bad-issues");

            goodIssues.innerHTML = "";
            warningIssues.innerHTML = "";
            badIssues.innerHTML = "";

            feedback.forEach((item) => {
                const li = Utils.createElement("li", "", item.title);

                if (item.type === "good") {
                    goodIssues.appendChild(li);
                } else if (item.type === "warning") {
                    warningIssues.appendChild(li);
                } else {
                    badIssues.appendChild(li);
                }
            });
        }

        function renderScoreChart(score) {
            const ctx = document.getElementById("seo-score-chart").getContext("2d");

            // Destroy existing chart if it exists
            if (seoScoreChartInstance) {
                seoScoreChartInstance.destroy();
            }

            const scoreColor = Utils.getScoreColor(score);

            seoScoreChartInstance = new Chart(ctx, {
                type: "doughnut",
                data: {
                    datasets: [
                        {
                            data: [score, 100 - score],
                            backgroundColor: [scoreColor, "#e0e0e0"],
                            borderWidth: 0,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "80%",
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
                plugins: [
                    {
                        id: "textCenter",
                        beforeDraw: function (chart) {
                            const width = chart.width;
                            const height = chart.height;
                            const ctx = chart.ctx;

                            ctx.restore();
                            const fontSize = (height / 114).toFixed(2);
                            ctx.font = `bold ${fontSize}em sans-serif`;
                            ctx.textBaseline = "middle";

                            const text = `${score}%`;
                            const textX = Math.round((width - ctx.measureText(text).width) / 2);
                            const textY = height / 2;

                            ctx.fillStyle = "#333";
                            ctx.fillText(text, textX, textY);
                            ctx.save();
                        },
                    },
                ],
            });
        }

        function createTabs() {
            const nav = document.createElement("div");
            nav.className = "tabs";

            const contentContainer = document.createElement("div");
            contentContainer.className = "tab-content";

            const tabs = {
                nav,
                contentContainer,
                google: createTab("Google Preview", nav, contentContainer),
                social: createTab("Social Preview", nav, contentContainer),
                feedback: createTab("Feedback", nav, contentContainer),
                properties: createTab("Properties", nav, contentContainer),
            };

            return tabs;
        }

        function createPropertiesContent(data) {
            const container = Utils.createElement("div", "properties-table");

            const properties = [
                {
                    name: "Title",
                    value: data.title,
                    description: "The title of the page, displayed in browser tabs and search results.",
                },
                {
                    name: "Description",
                    value: data.description,
                    description: "A brief summary of the page content, often shown in search results.",
                },
                {
                    name: "Favicon",
                    value: data.favicon,
                    description: "The small icon displayed in browser tabs and bookmarks.",
                },
                {
                    name: "Open Graph Title",
                    value: data.ogTitle,
                    description: "The title used when sharing the page on social media platforms like Facebook.",
                },
                {
                    name: "Open Graph Description",
                    value: data.ogDescription,
                    description: "The description used when sharing the page on social media.",
                },
                {
                    name: "Open Graph Image",
                    value: data.ogImage,
                    description: "The image displayed when sharing the page on social media.",
                },
                {
                    name: "Twitter Card",
                    value: data.twitterCard,
                    description: "The type of Twitter card to use (e.g., summary, summary_large_image).",
                },
                {
                    name: "Twitter Title",
                    value: data.twitterTitle,
                    description: "The title used when sharing the page on Twitter.",
                },
                {
                    name: "Twitter Description",
                    value: data.twitterDescription,
                    description: "The description used when sharing the page on Twitter.",
                },
                {
                    name: "Twitter Image",
                    value: data.twitterImage,
                    description: "The image displayed when sharing the page on Twitter.",
                },
                {
                    name: "H1 Tags",
                    value: data.h1,
                    description: "The number of H1 heading tags on the page. Ideally, there should be only one.",
                },
                {
                    name: "Images with Alt",
                    value: data.alt_tags?.with_alt,
                    description:
                        "The number of images with descriptive alt attributes, important for accessibility and SEO.",
                },
                {
                    name: "Images without Alt",
                    value: data.alt_tags?.without_alt,
                    description:
                        "The number of images missing alt attributes. These should be added for accessibility and SEO.",
                },
                {
                    name: "Canonical URL",
                    value: data.canonical,
                    description:
                        "Specifies the preferred version of a web page to search engines, preventing duplicate content issues.",
                },
                {
                    name: "Viewport Meta Tag",
                    value: data.viewport,
                    description: "Ensures the page is responsive and renders correctly across different devices.",
                },
            ];

            properties.forEach((prop) => {
                const row = Utils.createElement("div", "property-row");

                const nameSpan = Utils.createElement("span", "property-name", prop.name);
                row.appendChild(nameSpan);

                const valueSpan = Utils.createElement("span", "property-value");

                // Handle different value types
                if (Utils.isEmpty(prop.value)) {
                    valueSpan.textContent = "";
                    valueSpan.classList.add("empty-value");
                } else if (typeof prop.value === "number") {
                    valueSpan.textContent = prop.value.toString();
                } else if (typeof prop.value === "string") {
                    // Show full value without truncation
                    valueSpan.textContent = prop.value;
                    // Add title for long values for better accessibility
                    if (prop.value.length > 100) {
                        valueSpan.title = prop.value;
                    }
                } else {
                    valueSpan.textContent = prop.value.toString();
                }

                row.appendChild(valueSpan);

                const tooltipSpan = Utils.createElement("span", "property-tooltip", prop.description);
                row.appendChild(tooltipSpan);

                container.appendChild(row);
            });

            return container;
        }

        function createTab(name, nav, contentContainer) {
            const button = document.createElement("button");
            button.textContent = name;
            button.setAttribute("data-tab", name.toLowerCase().replace(" ", "-"));
            button.setAttribute("role", "tab");
            button.setAttribute("aria-selected", "false");
            nav.appendChild(button);

            const content = document.createElement("div");
            content.id = name.toLowerCase().replace(" ", "-");
            content.setAttribute("role", "tabpanel");
            content.setAttribute("aria-labelledby", button.id);
            contentContainer.appendChild(content);

            button.addEventListener("click", () => {
                activateTab(button, content, nav, contentContainer);
            });

            button.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    activateTab(button, content, nav, contentContainer);
                }
            });

            return content;
        }

        function activateTab(button, content, nav, contentContainer) {
            // Remove active state from all tabs
            nav.querySelectorAll("button").forEach((btn) => {
                btn.classList.remove("active");
                btn.setAttribute("aria-selected", "false");
            });
            contentContainer.querySelectorAll("div").forEach((c) => {
                c.classList.remove("active");
            });

            // Activate selected tab
            button.classList.add("active");
            button.setAttribute("aria-selected", "true");
            content.classList.add("active");
        }

        function createFeedbackContent(data) {
            const container = Utils.createElement("div", "feedback-container");
            const feedback = SeoFeedback.generateSeoFeedback(data);

            feedback.forEach((item) => {
                const card = Utils.createElement("div", `feedback-card ${item.type}`);

                const title = Utils.createElement("h4", "", item.title);
                card.appendChild(title);

                const description = Utils.createElement("p", "", item.description);
                card.appendChild(description);

                if (item.recommendation) {
                    const recommendation = Utils.createElement(
                        "p",
                        "recommendation",
                        `Recommendation: ${item.recommendation}`
                    );
                    card.appendChild(recommendation);
                }

                container.appendChild(card);
            });

            return container;
        }

        function createGooglePreviewContent(data, url) {
            const container = document.createElement("div");
            container.className = "preview google-preview";

            if (data.favicon) {
                const favicon = document.createElement("img");
                favicon.src = data.favicon;
                favicon.className = "favicon";
                favicon.alt = "Favicon";
                favicon.onerror = function () {
                    this.style.display = "none";
                };
                container.appendChild(favicon);
            }

            const title = document.createElement("p");
            title.className = "title";
            title.textContent = data.title || "No Title";
            container.appendChild(title);

            const link = document.createElement("p");
            link.className = "link";
            link.textContent = url;
            container.appendChild(link);

            const description = document.createElement("p");
            description.className = "description";
            description.textContent = data.description || "No Description";
            container.appendChild(description);

            return container;
        }

        function createSocialPreviewContent(data) {
            const container = document.createElement("div");
            container.className = "preview social-preview";

            const image = document.createElement("div");
            image.className = "image";

            if (data.ogImage) {
                image.style.backgroundImage = `url(${data.ogImage})`;
                image.style.backgroundSize = "cover";
                image.style.backgroundPosition = "center";
                image.style.backgroundRepeat = "no-repeat";
            } else {
                image.style.backgroundColor = "#f0f0f0";
                image.style.display = "flex";
                image.style.alignItems = "center";
                image.style.justifyContent = "center";
                image.style.color = "#666";
                image.textContent = "No image";
            }

            container.appendChild(image);

            const content = document.createElement("div");
            content.className = "content";

            const title = document.createElement("p");
            title.className = "title";
            title.textContent = data.ogTitle || data.title || "No Title";
            content.appendChild(title);

            const description = document.createElement("p");
            description.className = "description";
            description.textContent = data.ogDescription || data.description || "No Description";
            content.appendChild(description);

            container.appendChild(content);
            return container;
        }

        function renderError(message) {
            showError(message);
        }
    } // End of setupApp
}); // End of DOMContentLoaded
