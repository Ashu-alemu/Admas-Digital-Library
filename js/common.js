// js/common.js - Shared JavaScript functions

// Initialize app on any page
function initApp() {
    console.log('Initializing app...');
    
    // Setup common buttons
    setupCommonButtons();
    
    // Setup navigation
    setupNavigation();
    
    // Update login status display
    updateLoginStatus();
}

function setupCommonButtons() {
    // Make sure all buttons have click handlers
    document.querySelectorAll('.btn:not([data-bound])').forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent default if it's a button without href
            if (this.tagName === 'BUTTON' && !this.hasAttribute('href')) {
                e.preventDefault();
            }
            
            // Get button action
            const action = this.getAttribute('data-action') || 
                          this.textContent.trim().toLowerCase();
            
            console.log(`Button clicked: ${action}`);
            
            // Handle common actions
            switch(action) {
                case 'login':
                case 'sign in':
                    window.location.href = 'login.html';
                    break;
                case 'register':
                case 'sign up':
                    window.location.href = 'register.html';
                    break;
                case 'logout':
                case 'sign out':
                    logout();
                    break;
                case 'home':
                    window.location.href = 'index.html';
                    break;
                case 'search':
                    // Already handled in script.js
                    break;
                default:
                    // Do nothing for other buttons
                    break;
            }
        });
        
        button.setAttribute('data-bound', 'true');
    });
}

function setupNavigation() {
    // Make all navigation links work
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip external links and anchor links
            if (!href || href.startsWith('http') || href.startsWith('#')) {
                return;
            }
            
            // Check if it's a page in our site
            if (href.endsWith('.html') || href.endsWith('.htm')) {
                // Allow normal navigation
                return;
            }
        });
    });
}

function updateLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Update UI elements based on login status
    document.querySelectorAll('.logged-in').forEach(el => {
        el.style.display = isLoggedIn ? 'block' : 'none';
    });
    
    document.querySelectorAll('.logged-out').forEach(el => {
        el.style.display = isLoggedIn ? 'none' : 'block';
    });
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    
    showMessage('Logged out successfully!', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function showMessage(message, type = 'info') {
    // Implementation same as before
    // ... copy from previous message function
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initApp);