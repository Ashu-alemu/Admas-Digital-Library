// Manage Books Functionality
let allBooks = [];
let currentBooks = [];
let currentPage = 1;
const booksPerPage = 10;
let searchTerm = '';
let currentCategory = '';
let currentStatus = '';
let currentYear = '';
let currentSort = 'title';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check admin login
    if (!sessionStorage.getItem('isAdminLoggedIn')) {
        window.location.href = 'admin-login.html';
        return;
    }

    // Load books and initialize
    loadBooks();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Enter key for search
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBooks();
        }
    });

    // Real-time search
    document.getElementById('searchInput').addEventListener('input', function() {
        if (this.value.trim() === '') {
            searchTerm = '';
            filterAndDisplayBooks();
        }
    });
}

// Load books from localStorage
function loadBooks() {
    try {
        allBooks = JSON.parse(localStorage.getItem('libraryBooks') || '[]');
        
        // Calculate statistics
        updateBooksStats();
        
        // Filter and display books
        filterAndDisplayBooks();
        
        // Update UI
        updatePagination();
        
        console.log(`Loaded ${allBooks.length} books`);
    } catch (error) {
        console.error('Error loading books:', error);
        showNoDataMessage();
    }
}

// Calculate and display statistics
function updateBooksStats() {
    const totalBooks = allBooks.length;
    const availableBooks = allBooks.filter(book => book.status === 'available').length;
    const borrowedBooks = allBooks.filter(book => book.status === 'unavailable').length;
    const totalCopies = allBooks.reduce((sum, book) => sum + (book.copies || 1), 0);

    const statsHTML = `
        <div class="stat-card">
            <i class="fas fa-book"></i>
            <h3>${totalBooks}</h3>
            <p>Total Books</p>
        </div>
        <div class="stat-card">
            <i class="fas fa-check-circle"></i>
            <h3>${availableBooks}</h3>
            <p>Available</p>
        </div>
        <div class="stat-card">
            <i class="fas fa-book-reader"></i>
            <h3>${borrowedBooks}</h3>
            <p>Borrowed</p>
        </div>
        <div class="stat-card">
            <i class="fas fa-copy"></i>
            <h3>${totalCopies}</h3>
            <p>Total Copies</p>
        </div>
    `;

    document.getElementById('booksStats').innerHTML = statsHTML;
}

// Filter books based on search and filters
function filterAndDisplayBooks() {
    let filteredBooks = [...allBooks];

    // Apply search
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredBooks = filteredBooks.filter(book => 
            book.title.toLowerCase().includes(term) ||
            book.author.toLowerCase().includes(term) ||
            (book.isbn && book.isbn.toLowerCase().includes(term)) ||
            (book.description && book.description.toLowerCase().includes(term))
        );
    }

    // Apply category filter
    if (currentCategory) {
        filteredBooks = filteredBooks.filter(book => book.category === currentCategory);
    }

    // Apply status filter
    if (currentStatus) {
        filteredBooks = filteredBooks.filter(book => book.status === currentStatus);
    }

    // Apply year filter
    if (currentYear) {
        filteredBooks = filteredBooks.filter(book => book.year.toString() === currentYear);
    }

    // Apply sorting
    filteredBooks = sortBookList(filteredBooks);

    // Update current books
    currentBooks = filteredBooks;

    // Display books
    displayBooks(currentPage);

    // Update pagination
    updatePagination();

    // Show/hide no data message
    if (filteredBooks.length === 0) {
        showNoDataMessage();
    } else {
        hideNoDataMessage();
    }
}

// Sort books
function sortBookList(books) {
    switch(currentSort) {
        case 'title':
            return books.sort((a, b) => a.title.localeCompare(b.title));
        case 'title-desc':
            return books.sort((a, b) => b.title.localeCompare(a.title));
        case 'author':
            return books.sort((a, b) => a.author.localeCompare(b.author));
        case 'year':
            return books.sort((a, b) => b.year - a.year);
        case 'year-desc':
            return books.sort((a, b) => a.year - b.year);
        case 'added':
            return books.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
        default:
            return books;
    }
}

// Display books for current page
function displayBooks(page) {
    const tableBody = document.getElementById('booksTableBody');
    tableBody.innerHTML = '';

    // Calculate start and end indices
    const startIndex = (page - 1) * booksPerPage;
    const endIndex = Math.min(startIndex + booksPerPage, currentBooks.length);
    const pageBooks = currentBooks.slice(startIndex, endIndex);

    if (pageBooks.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    No books to display
                </td>
            </tr>
        `;
        return;
    }

    // Create table rows
    pageBooks.forEach((book, index) => {
        const row = createBookRow(book, startIndex + index);
        tableBody.appendChild(row);
    });
}

// Create a book table row
function createBookRow(book, index) {
    const row = document.createElement('tr');
    
    // Status badge
    let statusBadge;
    switch(book.status) {
        case 'available':
            statusBadge = `<span class="status-badge status-available">
                <i class="fas fa-circle"></i> Available
            </span>`;
            break;
        case 'unavailable':
            statusBadge = `<span class="status-badge status-unavailable">
                <i class="fas fa-circle"></i> Unavailable
            </span>`;
            break;
        case 'reserved':
            statusBadge = `<span class="status-badge status-reserved">
                <i class="fas fa-circle"></i> Reserved
            </span>`;
            break;
        default:
            statusBadge = `<span class="status-badge status-available">
                <i class="fas fa-circle"></i> Available
            </span>`;
    }

    // Category badge
    const categoryMap = {
        'computer-science': 'Computer Science',
        'engineering': 'Engineering',
        'mathematics': 'Mathematics',
        'business': 'Business',
        'science': 'Science',
        'literature': 'Literature',
        'history': 'History',
        'art': 'Art & Design'
    };

    const categoryName = categoryMap[book.category] || book.categoryDisplay || book.category;

    // Cover image or placeholder
    const coverHTML = book.coverImage ? 
        `<img src="${book.coverImage}" alt="${book.title}">` :
        `<i class="fas fa-book"></i>`;

    row.innerHTML = `
        <td>
            <div class="book-info-cell">
                <div class="book-cover-small">
                    ${coverHTML}
                </div>
                <div>
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">${book.author}</div>
                </div>
            </div>
        </td>
        <td>
            <span class="category-badge">${categoryName}</span>
        </td>
        <td>${book.isbn || 'N/A'}</td>
        <td>${book.year || 'N/A'}</td>
        <td>
            <div>Total: ${book.copies || 1}</div>
            <div style="font-size: 0.8rem; color: #7f8c8d;">
                Available: ${book.availableCopies || book.copies || 1}
            </div>
        </td>
        <td>${statusBadge}</td>
        <td>
            <div class="action-buttons">
                <button class="action-btn-small btn-view" onclick="viewBook('${book.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn-small btn-edit" onclick="editBook('${book.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn-small btn-delete" onclick="deleteBook('${book.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;

    return row;
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(currentBooks.length / booksPerPage);
    const paginationDiv = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} 
                onclick="goToPage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    // Show page numbers
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
        startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }

    paginationHTML += `
        <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} 
                onclick="goToPage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
        <span style="color: #7f8c8d; font-size: 0.9rem;">
            ${currentBooks.length} books, Page ${currentPage} of ${totalPages}
        </span>
    `;

    paginationDiv.innerHTML = paginationHTML;
}

// Go to specific page
function goToPage(page) {
    if (page < 1 || page > Math.ceil(currentBooks.length / booksPerPage)) return;
    
    currentPage = page;
    displayBooks(page);
    updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Search books
function searchBooks() {
    searchTerm = document.getElementById('searchInput').value.trim();
    currentPage = 1;
    filterAndDisplayBooks();
}

// Filter books
function filterBooks() {
    currentCategory = document.getElementById('categoryFilter').value;
    currentStatus = document.getElementById('statusFilter').value;
    currentYear = document.getElementById('yearFilter').value;
    currentPage = 1;
    filterAndDisplayBooks();
}

// Sort books
function sortBooks() {
    currentSort = document.getElementById('sortFilter').value;
    filterAndDisplayBooks();
}

// View book details
function viewBook(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (!book) {
        alert('Book not found!');
        return;
    }

    const categoryMap = {
        'computer-science': 'Computer Science',
        'engineering': 'Engineering',
        'mathematics': 'Mathematics',
        'business': 'Business',
        'science': 'Science',
        'literature': 'Literature',
        'history': 'History',
        'art': 'Art & Design'
    };

    const categoryName = categoryMap[book.category] || book.categoryDisplay || book.category;

    const detailsHTML = `
        <div class="book-details-modal">
            <div class="book-details-header" style="display: flex; gap: 30px; margin-bottom: 30px;">
                <div class="book-cover-large" style="width: 200px; height: 280px; border-radius: 10px; overflow: hidden; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center;">
                    ${book.coverImage ? 
                        `<img src="${book.coverImage}" alt="${book.title}" style="width: 100%; height: 100%; object-fit: cover;">` :
                        `<i class="fas fa-book" style="font-size: 4rem; color: white;"></i>`
                    }
                </div>
                <div style="flex: 1;">
                    <h2 style="color: #2c3e50; margin-bottom: 10px;">${book.title}</h2>
                    <p style="color: #3498db; font-size: 1.2rem; margin-bottom: 15px;">by ${book.author}</p>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                        <div>
                            <strong>Publication Year:</strong><br>
                            ${book.year || 'N/A'}
                        </div>
                        <div>
                            <strong>Publisher:</strong><br>
                            ${book.publisher || 'N/A'}
                        </div>
                        <div>
                            <strong>Category:</strong><br>
                            ${categoryName}
                        </div>
                        <div>
                            <strong>Language:</strong><br>
                            ${book.language ? book.language.charAt(0).toUpperCase() + book.language.slice(1) : 'English'}
                        </div>
                        <div>
                            <strong>ISBN:</strong><br>
                            ${book.isbn || 'N/A'}
                        </div>
                        <div>
                            <strong>Edition:</strong><br>
                            ${book.edition || 'First Edition'}
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between;">
                            <div>
                                <strong>Copies:</strong> ${book.copies || 1}
                            </div>
                            <div>
                                <strong>Available:</strong> ${book.availableCopies || book.copies || 1}
                            </div>
                            <div>
                                <strong>Status:</strong> 
                                ${book.status === 'available' ? 
                                    '<span style="color: #27ae60;">Available</span>' : 
                                    '<span style="color: #e74c3c;">Unavailable</span>'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #2c3e50; margin-bottom: 10px;">Description</h3>
                <p style="line-height: 1.6; color: #555;">${book.description || 'No description available.'}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #2c3e50; margin-bottom: 10px;">Additional Information</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div>
                        <strong>Pages:</strong> ${book.pages || 'N/A'}
                    </div>
                    <div>
                        <strong>Shelf Location:</strong> ${book.location || 'N/A'}
                    </div>
                    <div>
                        <strong>Date Added:</strong> ${book.addedDate || 'N/A'}
                    </div>
                    <div>
                        <strong>Keywords:</strong> ${book.keywords ? book.keywords.join(', ') : 'N/A'}
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button onclick="editBook('${book.id}')" style="padding: 10px 25px; background: #3498db; color: white; border: none; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
                    <i class="fas fa-edit"></i> Edit Book
                </button>
            </div>
        </div>
    `;

    document.getElementById('viewBookContent').innerHTML = detailsHTML;
    openModal('viewBookModal');
}

// Edit book
function editBook(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (!book) {
        alert('Book not found!');
        return;
    }

    const categoryMap = {
        'computer-science': 'Computer Science',
        'engineering': 'Engineering',
        'mathematics': 'Mathematics',
        'business': 'Business',
        'science': 'Science',
        'literature': 'Literature',
        'history': 'History',
        'art': 'Art & Design'
    };

    const categoriesHTML = Object.entries(categoryMap).map(([value, label]) => `
        <option value="${value}" ${book.category === value ? 'selected' : ''}>${label}</option>
    `).join('');

    const editFormHTML = `
        <form id="editBookFormContent" onsubmit="saveBookChanges(event, '${book.id}')">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div class="form-group">
                    <label for="editTitle">Book Title *</label>
                    <input type="text" id="editTitle" class="form-control" value="${book.title}" required>
                </div>
                <div class="form-group">
                    <label for="editAuthor">Author *</label>
                    <input type="text" id="editAuthor" class="form-control" value="${book.author}" required>
                </div>
                <div class="form-group">
                    <label for="editISBN">ISBN</label>
                    <input type="text" id="editISBN" class="form-control" value="${book.isbn || ''}">
                </div>
                <div class="form-group">
                    <label for="editYear">Publication Year *</label>
                    <input type="number" id="editYear" class="form-control" value="${book.year}" min="1500" max="2024" required>
                </div>
                <div class="form-group">
                    <label for="editCategory">Category *</label>
                    <select id="editCategory" class="form-control" required>
                        <option value="">Select Category</option>
                        ${categoriesHTML}
                    </select>
                </div>
                <div class="form-group">
                    <label for="editCopies">Number of Copies *</label>
                    <input type="number" id="editCopies" class="form-control" value="${book.copies || 1}" min="1" required>
                </div>
                <div class="form-group">
                    <label for="editAvailableCopies">Available Copies *</label>
                    <input type="number" id="editAvailableCopies" class="form-control" 
                           value="${book.availableCopies || book.copies || 1}" min="0" max="${book.copies || 1}" required>
                </div>
                <div class="form-group">
                    <label for="editStatus">Status *</label>
                    <select id="editStatus" class="form-control" required>
                        <option value="available" ${book.status === 'available' ? 'selected' : ''}>Available</option>
                        <option value="unavailable" ${book.status === 'unavailable' ? 'selected' : ''}>Unavailable</option>
                        <option value="reserved" ${book.status === 'reserved' ? 'selected' : ''}>Reserved</option>
                    </select>
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label for="editDescription">Description *</label>
                    <textarea id="editDescription" class="form-control" rows="4" required>${book.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="editPublisher">Publisher</label>
                    <input type="text" id="editPublisher" class="form-control" value="${book.publisher || ''}">
                </div>
                <div class="form-group">
                    <label for="editPages">Pages</label>
                    <input type="number" id="editPages" class="form-control" value="${book.pages || ''}">
                </div>
                <div class="form-group">
                    <label for="editLocation">Shelf Location</label>
                    <input type="text" id="editLocation" class="form-control" value="${book.location || ''}">
                </div>
                <div class="form-group">
                    <label for="editEdition">Edition</label>
                    <input type="text" id="editEdition" class="form-control" value="${book.edition || ''}">
                </div>
            </div>
            
            <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <button type="button" class="btn-cancel" onclick="closeModal('editBookModal')">
                    Cancel
                </button>
                <button type="submit" class="btn-submit">
                    Save Changes
                </button>
            </div>
        </form>
    `;

    document.getElementById('editBookForm').innerHTML = editFormHTML;
    openModal('editBookModal');
}

// Save book changes
function saveBookChanges(event, bookId) {
    event.preventDefault();
    
    const bookIndex = allBooks.findIndex(b => b.id === bookId);
    if (bookIndex === -1) {
        alert('Book not found!');
        return;
    }

    // Get form values
    const updatedBook = {
        ...allBooks[bookIndex],
        title: document.getElementById('editTitle').value.trim(),
        author: document.getElementById('editAuthor').value.trim(),
        isbn: document.getElementById('editISBN').value.trim(),
        year: parseInt(document.getElementById('editYear').value),
        category: document.getElementById('editCategory').value,
        copies: parseInt(document.getElementById('editCopies').value),
        availableCopies: parseInt(document.getElementById('editAvailableCopies').value),
        status: document.getElementById('editStatus').value,
        description: document.getElementById('editDescription').value.trim(),
        publisher: document.getElementById('editPublisher').value.trim(),
        pages: document.getElementById('editPages').value ? parseInt(document.getElementById('editPages').value) : null,
        location: document.getElementById('editLocation').value.trim(),
        edition: document.getElementById('editEdition').value.trim(),
        lastUpdated: new Date().toISOString().split('T')[0]
    };

    // Validate
    if (updatedBook.availableCopies > updatedBook.copies) {
        alert('Available copies cannot be greater than total copies!');
        return;
    }

    // Update book
    allBooks[bookIndex] = updatedBook;

    // Save to localStorage
    localStorage.setItem('libraryBooks', JSON.stringify(allBooks));

    // Close modal and refresh
    closeModal('editBookModal');
    loadBooks();
    
    alert('Book updated successfully!');
}

// Delete book
function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
        return;
    }

    const bookIndex = allBooks.findIndex(b => b.id === bookId);
    if (bookIndex === -1) {
        alert('Book not found!');
        return;
    }

    const bookTitle = allBooks[bookIndex].title;

    // Remove from allBooks
    allBooks.splice(bookIndex, 1);

    // Save to localStorage
    localStorage.setItem('libraryBooks', JSON.stringify(allBooks));

    // Also remove from homepage books
    let homepageBooks = JSON.parse(localStorage.getItem('homepageBooks') || '[]');
    homepageBooks = homepageBooks.filter(b => b.id !== bookId);
    localStorage.setItem('homepageBooks', JSON.stringify(homepageBooks));

    // Refresh
    loadBooks();
    
    alert(`Book "${bookTitle}" deleted successfully!`);
}

// Export books to CSV
function exportBooks() {
    if (allBooks.length === 0) {
        alert('No books to export!');
        return;
    }

    // Create CSV content
    const headers = ['Title', 'Author', 'ISBN', 'Year', 'Category', 'Copies', 'Available', 'Status', 'Publisher', 'Pages'];
    const csvRows = [headers.join(',')];

    allBooks.forEach(book => {
        const row = [
            `"${book.title}"`,
            `"${book.author}"`,
            `"${book.isbn || ''}"`,
            book.year,
            `"${book.categoryDisplay || book.category}"`,
            book.copies || 1,
            book.availableCopies || book.copies || 1,
            book.status,
            `"${book.publisher || ''}"`,
            book.pages || ''
        ];
        csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const date = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `admas_library_books_${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`Exported ${allBooks.length} books to CSV file!`);
}

// Show no data message
function showNoDataMessage() {
    document.getElementById('booksTable').style.display = 'none';
    document.getElementById('pagination').style.display = 'none';
    document.getElementById('noDataMessage').style.display = 'block';
}

// Hide no data message
function hideNoDataMessage() {
    document.getElementById('booksTable').style.display = 'table';
    document.getElementById('pagination').style.display = 'flex';
    document.getElementById('noDataMessage').style.display = 'none';
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Export functions to global scope
window.searchBooks = searchBooks;
window.filterBooks = filterBooks;
window.sortBooks = sortBooks;
window.goToPage = goToPage;
window.viewBook = viewBook;
window.editBook = editBook;
window.deleteBook = deleteBook;
window.saveBookChanges = saveBookChanges;
window.exportBooks = exportBooks;
window.closeModal = closeModal;