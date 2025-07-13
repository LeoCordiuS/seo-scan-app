# SEO Scan App

An interactive web application to analyze the SEO (meta) tags of any website. It provides feedback on SEO best practices and shows previews of how the site will appear in Google search results and on social media.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)

## Installation

1.  Clone the repository or download the source code.
2.  Open a terminal in the project directory.
3.  Install the dependencies:
    ```bash
    npm install
    ```

## Running the App

1.  Start the server:
    ```bash
    npm start
    ```
2.  The application will be running at [http://localhost:3000](http://localhost:3000).
3.  Open your web browser and navigate to the address above.
4.  Enter a website URL and click "Scan" to see the SEO analysis.

## How It Works

-   **Backend:** A Node.js/Express server that takes a URL, fetches the website's HTML using `axios`, and parses it with `cheerio` to extract SEO-related meta tags.
-   **Frontend:** A simple HTML, CSS, and JavaScript single-page application that allows users to input a URL, sends it to the backend, and then displays the returned SEO data, feedback, and previews.
