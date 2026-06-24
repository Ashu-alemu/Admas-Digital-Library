// script.js - UPDATED VERSION

document.addEventListener('DOMContentLoaded', function() {
    console.log('Library Management System loaded!');
    
    // Initialize everything
    initApp();
});

function initApp() {
    // Load featured books
    loadFeaturedBooks();
    
    // Setup all buttons
    setupButtons();
    
    // Setup navigation
    setupNavigation();
    
    // Check login status
    updateLoginStatus();
}

function setupButtons() {
    // Search button
    const searchBtn = document.querySelector('.search-box button');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', searchBooks);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchBooks();
        });
    }
    
    // Login button (if on login page)
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn && !loginBtn.hasAttribute('data-bound')) {
        loginBtn.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') {
                handleLogin();
            }
        });
        loginBtn.setAttribute('data-bound', 'true');
    }
    
    // Register button
    const registerBtn = document.querySelector('.btn-register');
    if (registerBtn && !registerBtn.hasAttribute('data-bound')) {
        registerBtn.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') {
                handleRegistration();
            }
        });
        registerBtn.setAttribute('data-bound', 'true');
    }
    
    // Logout button
    const logoutBtns = document.querySelectorAll('[onclick*="logout"], .logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', logout);
    });
    
    // Book borrow buttons
    document.querySelectorAll('.borrow-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const bookId = this.getAttribute('data-book-id');
            borrowBook(bookId);
        });
    });
    
    // Menu buttons
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleMenuAction(action);
        });
    });
}

function setupNavigation() {
    // Make all nav links work
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============== BUTTON HANDLERS ==============

function searchBooks() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput ? searchInput.value.trim() : '';
    
    if (!query) {
        showMessage('Please enter a search term', 'warning');
        searchInput.focus();
        return;
    }
    
    showMessage(`Searching for: "${query}"`, 'info');
    
    // Simulate search results
    const books = [
        { title: 'Software Engineering', author: 'Ian Sommerville', match: true },
        { title: 'Database Systems', author: 'Abraham Silberschatz', match: true },
        { title: 'Advanced Programming', author: 'John Doe', match: query.toLowerCase().includes('program') }
    ];
    
    const results = books.filter(book => book.match);
    
    if (results.length > 0) {
        showMessage(`Found ${results.length} book(s) matching "${query}"`, 'success');
        
        // Update book display
        const booksGrid = document.querySelector('.books-grid');
        if (booksGrid) {
            booksGrid.innerHTML = results.map(book => `
                <div class="book-card">
                    <div class="book-cover">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="book-info">
                        <h3>${book.title}</h3>
                        <p class="book-author">By ${book.author}</p>
                        <span class="book-category">Computer Science</span>
                        <br>
                        <button class="btn borrow-btn" data-book-id="1">
                            <i class="fas fa-bookmark"></i> Borrow This Book
                        </button>
                    </div>
                </div>
            `).join('');
        }
    } else {
        showMessage('No books found matching your search', 'warning');
    }
    
    // Scroll to results
    const searchSection = document.getElementById('search');
    if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function handleLogin() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (!emailInput || !passwordInput) return;
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Basic validation
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate API call
    showMessage('Logging in...', 'info');
    
    setTimeout(() => {
        // For demo: Accept any email/password
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', email.split('@')[0]);
        
        showMessage('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }, 500);
}

function handleRegistration() {
    const firstName = document.getElementById('firstName')?.value.trim();
    const lastName = document.getElementById('lastName')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    
    // Validation
    if (!firstName || !lastName || !email || !password) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Create user object
    const userData = {
        firstName,
        lastName,
        email,
        joinDate: new Date().toLocaleDateString()
    };
    
    // Save to localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    showMessage('Registration successful! Welcome to the library.', 'success');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

function borrowBook(bookId) {
    if (!checkLogin()) {
        showMessage('Please login first to borrow books', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return;
    }
    
    const books = {
        '1': 'Software Engineering',
        '2': 'Database Systems',
        '3': 'Digital Libraries'
    };
    
    const bookTitle = books[bookId] || 'Unknown Book';
    
    // Get current borrowed books
    let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks') || '[]');
    
    // Check if already borrowed
    if (borrowedBooks.includes(bookId)) {
        showMessage(`You already have "${bookTitle}" borrowed`, 'warning');
        return;
    }
    
    // Add to borrowed books
    borrowedBooks.push(bookId);
    localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
    
    showMessage(`Successfully borrowed "${bookTitle}"!`, 'success');
    
    // Update UI
    const borrowBtn = document.querySelector(`.borrow-btn[data-book-id="${bookId}"]`);
    if (borrowBtn) {
        borrowBtn.innerHTML = '<i class="fas fa-check"></i> Borrowed';
        borrowBtn.disabled = true;
        borrowBtn.style.background = '#27ae60';
    }
}

function handleMenuAction(action) {
    switch(action) {
        case 'profile':
            showMessage('Opening profile...', 'info');
            break;
        case 'books':
            showMessage('Loading your books...', 'info');
            break;
        case 'history':
            showMessage('Showing history...', 'info');
            break;
        case 'settings':
            showMessage('Opening settings...', 'info');
            break;
        default:
            showMessage('Action not implemented yet', 'info');
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    showMessage('Logged out successfully', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// ============== HELPER FUNCTIONS ==============

function checkLogin() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function updateLoginStatus() {
    const isLoggedIn = checkLogin();
    const loginLinks = document.querySelectorAll('.login-link');
    const logoutLinks = document.querySelectorAll('.logout-link');
    
    if (isLoggedIn) {
        loginLinks.forEach(link => link.style.display = 'none');
        logoutLinks.forEach(link => link.style.display = 'inline-block');
        
        // Update user info
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => {
            if (userData.firstName) {
                el.textContent = `${userData.firstName} ${userData.lastName}`;
            }
        });
    } else {
        loginLinks.forEach(link => link.style.display = 'inline-block');
        logoutLinks.forEach(link => link.style.display = 'none');
    }
}

function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMsg = document.querySelector('.system-message');
    if (existingMsg) existingMsg.remove();
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `system-message message-${type}`;
    messageDiv.innerHTML = `
        <span>${message}</span>
        <button class="close-message">&times;</button>
    `;
    
    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${getMessageColor(type)};
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Close button
    const closeBtn = messageDiv.querySelector('.close-message');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin: 0;
    `;
    
    closeBtn.addEventListener('click', () => messageDiv.remove());
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 5000);
    
    // Add CSS animations
    if (!document.querySelector('#message-styles')) {
        const style = document.createElement('style');
        style.id = 'message-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function getMessageColor(type) {
    const colors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'warning': '#f39c12',
        'info': '#3498db'
    };
    return colors[type] || '#3498db';
}

// Load books function (keep your existing one, but add borrow buttons)
function loadFeaturedBooks() {
    const booksGrid = document.querySelector('.books-grid');
    if (!booksGrid) return;
    
    const books = [
        { id: 1, title: 'Software Engineering', author: 'Ian Sommerville', category: 'Computer Science' },
        { id: 2, title: 'Database Systems', author: 'Abraham Silberschatz', category: 'Computer Science' },
        { id: 3, title: 'Digital Libraries', author: 'Michael Lesk', category: 'Library Science' },
        { id: 4, title: 'Java Programming', author: 'Herbert Schildt', category: 'Programming' },
        { id: 5, title: 'Web Development', author: 'Jon Duckett', category: 'Web Design' },
        { id: 6, title: 'Data Structures', author: 'Mark Allen Weiss', category: 'Computer Science' }
    ];
    
    booksGrid.innerHTML = books.map(book => `
        <div class="book-card">
            <div class="book-cover">
                <i class="fas fa-book"></i>
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="book-author">By ${book.author}</p>
                <span class="book-category">${book.category}</span>
                <br>
                <button class="btn borrow-btn" data-book-id="${book.id}" style="margin-top: 10px;">
                    <i class="fas fa-bookmark"></i> Borrow This Book
                </button>
            </div>
        </div>
    `).join('');
}