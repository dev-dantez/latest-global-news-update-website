const apiKey = '5f64badaa16642c6883329ffe11c8ff7'; // Replace with your actual API key
const baseUrl = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=' + apiKey;
let currentPage = 1;
let totalPages = 1;

window.onload = function () {
    fetchNews();
};

// Function to fetch and display news
async function fetchNews() {
    const category = document.getElementById('category-select').value || ''; // Default to empty if not selected
    const query = document.getElementById('search-input').value;

    const url = buildUrl(category, query);

    try {
        showLoadingSpinner();
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'ok') {
            const validArticles = filterValidArticles(data.articles);
            totalPages = Math.ceil(data.totalResults / 10); // Assuming 10 articles per page
            displayNews(validArticles);
        } else {
            alert('Failed to load news articles');
        }
    } catch (error) {
        console.error('Error fetching the news:', error);
    } finally {
        hideLoadingSpinner();
    }
}

// Build the URL with category and search query
function buildUrl(category, query) {
    let url = `${baseUrl}&page=${currentPage}&pageSize=10`;
    if (category) {
        url += `&category=${category}`;
    }
    if (query) {
        url += `&q=${query}`;
    }
    return url;
}

// Filter out invalid or "removed" articles
function filterValidArticles(articles) {
    return articles.filter(article => 
        article.title && 
        article.url && 
        article.description && 
        article.urlToImage // Ensure all key data exists
    );
}

// Display news articles in the DOM
function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ''; // Clear previous news

    if (articles.length === 0) {
        newsContainer.innerHTML = `<p class="error">No articles found for the selected filters.</p>`;
        return;
    }

    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.classList.add('article');

        articleElement.innerHTML = `
            <img src="${article.urlToImage}" alt="Article Image">
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;

        newsContainer.appendChild(articleElement);
    });

    createPagination();
}

// Create pagination buttons
function createPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous';
    prevButton.disabled = currentPage <= 1; // Disable if on the first page
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            fetchNews();
        }
    };
    paginationContainer.appendChild(prevButton);

    // Next button
    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.disabled = currentPage >= totalPages; // Disable if on the last page
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchNews();
        }
    };
    paginationContainer.appendChild(nextButton);
}

// Show loading spinner
function showLoadingSpinner() {
    document.getElementById('loading-spinner').style.display = 'block';
}

// Hide loading spinner
function hideLoadingSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}

// Search functionality
function searchNews() {
    currentPage = 1;
    fetchNews();
}

// Clear search input
function clearSearch() {
    document.getElementById('search-input').value = '';
    fetchNews();
}
