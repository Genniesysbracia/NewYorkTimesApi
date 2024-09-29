const apiKey = '0fjovpveP6eGwWq0MsomPphDB6vQENK1'; 
const topArtsUrl = `https://api.nytimes.com/svc/topstories/v2/arts.json?api-key=${apiKey}`;
const reviewApiUrl = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${apiKey}`;

const topArtsContainer = document.querySelector('.article-card'); 
const reviewArticle = document.getElementById('review-article'); 

// fetch and display top arts stories
async function fetchTopArts() {
    const loadingMessage = document.createElement('div');
    loadingMessage.textContent = 'Loading top arts stories...';
    topArtsContainer.appendChild(loadingMessage); // Append loading message

    try {
        const response = await fetch(topArtsUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        
        const data = await response.json();

        topArtsContainer.removeChild(loadingMessage);

        if (!data.results || data.results.length === 0) {
            const noResultsMessage = document.createElement('div');
            noResultsMessage.textContent = 'No articles found.';
            topArtsContainer.appendChild(noResultsMessage);
            return;
        }

        data.results.forEach(article => {
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('card'); 

            if (article.multimedia && article.multimedia.length > 0) {
                const img = document.createElement('img');
                img.src = article.multimedia[0].url; 
                img.alt = article.title; 
                img.classList.add('article-image'); 
                articleDiv.appendChild(img); 
            }

            const title = document.createElement('h3'); 
            title.textContent = article.title;

            const abstract = document.createElement('p'); 
            abstract.textContent = article.abstract;

            const link = document.createElement('a'); 
            link.href = article.url;
            link.textContent = 'Read more';
            link.target = '_blank'; 

            articleDiv.appendChild(title);
            articleDiv.appendChild(abstract);
            articleDiv.appendChild(link);

            topArtsContainer.appendChild(articleDiv);
        });

    } catch (error) {
  
        if (topArtsContainer.contains(loadingMessage)) {
            topArtsContainer.removeChild(loadingMessage);
        }

        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Error loading articles: ' + error.message;
        topArtsContainer.appendChild(errorMessage);
    }
}

async function fetchBestsellerBooks() {
    const loadingMessage = document.createElement('div');
    loadingMessage.textContent = 'Loading bestseller books...';
    reviewArticle.appendChild(loadingMessage); // Append loading message

    try {
        const response = await fetch(reviewApiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();

        reviewArticle.removeChild(loadingMessage);

        const books = data.results.books; 

        if (!books || books.length === 0) {
            reviewArticle.innerHTML = '<p>No books found.</p>';
            return;
        }

        reviewArticle.innerHTML = '';

        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.classList.add('card'); 

            // Book cover image
            const bookImage = document.createElement('img');
            bookImage.src = book.book_image || 'placeholder_image_url.jpg'; 
            bookImage.alt = `${book.title} cover image`; 
            bookCard.appendChild(bookImage);

            // Book title
            const bookTitle = document.createElement('div');
            bookTitle.classList.add('bookTitle');
            bookTitle.innerHTML = `<h3>${book.title || 'Title not available'}</h3>`; 
            bookCard.appendChild(bookTitle);

            // Book author
            const bookAuthor = document.createElement('div');
            bookAuthor.classList.add('bookAuthor');
            bookAuthor.innerHTML = `<p>by ${book.author || 'Author not available'}</p>`; 
            bookCard.appendChild(bookAuthor);

            // Book description
            const bookDescription = document.createElement('div');
            bookDescription.classList.add('bookDescription');
            bookDescription.innerHTML = `<p>${book.description || 'Description not available.'}</p>`; 
            bookCard.appendChild(bookDescription);

            reviewArticle.appendChild(bookCard);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        reviewArticle.innerHTML = `<p>Error loading books: ${error.message}</p>`; 
    }
}

fetchTopArts();
fetchBestsellerBooks();
