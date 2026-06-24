// admin-dashboard.js - Admin Dashboard Script (Enhanced)

document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in
    if (!sessionStorage.getItem('isAdminLoggedIn') || sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Display admin name
    const adminName = sessionStorage.getItem('adminName') || 'Administrator';
    document.getElementById('adminNameDisplay').textContent = adminName;
    document.title = `${adminName} - Admin Dashboard`;
    
    // Initialize all functionality
    initializeSidebar();
    initializeActionButtons();
    initializeStatsCards();
    setupLogout();
    setupRealTimeUpdates();
    showWelcomeNotification();
});

// ================= SIDEBAR NAVIGATION =================
function initializeSidebar() {
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const menuText = this.textContent.trim();
            
            // Remove active class from all items
            menuItems.forEach(i => i.parentElement.classList.remove('active'));
            // Add active class to clicked item
            this.parentElement.classList.add('active');
            
            // Handle navigation based on menu item
            handleNavigation(menuText);
        });
    });
}

function handleNavigation(menuItem) {
    console.log(`Navigating to: ${menuItem}`);
    
    switch(menuItem) {
        case 'Dashboard':
            // Already on dashboard
            showNotification('Refreshing dashboard...', 'info');
            updateDashboardStats();
            break;
            
        case 'Manage Books':
            // Redirect to manage books page or show modal
            showNotification('Loading Book Management...', 'info');
            // If you have manage-books.html:
            // window.location.href = 'manage-books.html';
            // Or show a modal
            setTimeout(() => {
                window.location.href = 'manage-books.html';
            }, 800);
            break;
            
        case 'Manage Users':
            showNotification('Loading User Management...', 'info');
            setTimeout(() => {
                window.location.href = 'manage-users.html';
            }, 800);
            break;
            
        case 'Reports':
            generateQuickReport();
            break;
            
        case 'Settings':
            showNotification('Opening System Settings...', 'info');
            setTimeout(() => {
                window.location.href = 'admin-settings.html';
            }, 800);
            break;
            
        case 'Activity Log':
            showActivityLogModal();
            break;
            
        default:
            showNotification(`Opening ${menuItem}...`, 'info');
    }
}

// ================= ACTION BUTTONS =================
function initializeActionButtons() {
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            handleAction(action);
        });
    });
}

function handleAction(action) {
    console.log(`Action: ${action}`);
    
    switch(action) {
        case 'Add New Book':
            showAddBookModal();
            break;
            
        case 'Add User':
            showAddUserModal();
            break;
            
        case 'Generate Report':
            generateReport();
            break;
            
        case 'System Settings':
            window.location.href = 'admin-settings.html';
            break;
            
        case 'Add New Admin':
            window.location.href = 'add-admin.html';
            break;
            
        default:
            showNotification(`Processing: ${action}`, 'info');
    }
}

// ================= MODAL FUNCTIONS =================
function showAddBookModal() {
    // Create modal HTML
    const modalHTML = `
        <div class="modal" id="addBookModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-book"></i> Add New Book</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="addBookForm">
                        <div class="form-group">
                            <label for="bookTitle">Book Title</label>
                            <input type="text" id="bookTitle" placeholder="Enter book title" required>
                        </div>
                        <div class="form-group">
                            <label for="bookAuthor">Author</label>
                            <input type="text" id="bookAuthor" placeholder="Enter author name" required>
                        </div>
                        <div class="form-group">
                            <label for="bookISBN">ISBN</label>
                            <input type="text" id="bookISBN" placeholder="Enter ISBN number">
                        </div>
                        <div class="form-group">
                            <label for="bookCategory">Category</label>
                            <select id="bookCategory">
                                <option value="fiction">Fiction</option>
                                <option value="non-fiction">Non-Fiction</option>
                                <option value="academic">Academic</option>
                                <option value="reference">Reference</option>
                                <option value="children">Children</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="bookCopies">Number of Copies</label>
                            <input type="number" id="bookCopies" min="1" value="1" required>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-cancel" onclick="closeModal('addBookModal')">Cancel</button>
                            <button type="submit" class="btn-submit">Add Book</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Handle form submission
    document.getElementById('addBookForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const bookData = {
            title: document.getElementById('bookTitle').value,
            author: document.getElementById('bookAuthor').value,
            isbn: document.getElementById('bookISBN').value,
            category: document.getElementById('bookCategory').value,
            copies: document.getElementById('bookCopies').value
        };
        
        // In real app, send to backend
        console.log('Adding book:', bookData);
        showNotification(`Book "${bookData.title}" added successfully!`, 'success');
        closeModal('addBookModal');
        
        // Update stats
        updateBookCount(1);
    });
    
    // Setup close button
    document.querySelector('#addBookModal .modal-close').addEventListener('click', function() {
        closeModal('addBookModal');
    });
}

function showAddUserModal() {
    const modalHTML = `
        <div class="modal" id="addUserModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-user-plus"></i> Add New User</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="addUserForm">
                        <div class="form-group">
                            <label for="userFullName">Full Name</label>
                            <input type="text" id="userFullName" placeholder="Enter full name" required>
                        </div>
                        <div class="form-group">
                            <label for="userEmail">Email Address</label>
                            <input type="email" id="userEmail" placeholder="user@admas.edu.et" required>
                        </div>
                        <div class="form-group">
                            <label for="userRole">User Role</label>
                            <select id="userRole">
                                <option value="student">Student</option>
                                <option value="faculty">Faculty</option>
                                <option value="staff">Staff</option>
                                <option value="researcher">Researcher</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="userID">Student/Staff ID</label>
                            <input type="text" id="userID" placeholder="Enter ID number" required>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-cancel" onclick="closeModal('addUserModal')">Cancel</button>
                            <button type="submit" class="btn-submit">Add User</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('addUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const userData = {
            name: document.getElementById('userFullName').value,
            email: document.getElementById('userEmail').value,
            role: document.getElementById('userRole').value,
            id: document.getElementById('userID').value
        };
        
        console.log('Adding user:', userData);
        showNotification(`User "${userData.name}" added successfully!`, 'success');
        closeModal('addUserModal');
        
        // Update stats
        updateUserCount(1);
    });
    
    document.querySelector('#addUserModal .modal-close').addEventListener('click', function() {
        closeModal('addUserModal');
    });
}

function showActivityLogModal() {
    const modalHTML = `
        <div class="modal" id="activityLogModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-history"></i> Recent Activity Log</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="activity-list">
                        <div class="activity-item">
                            <i class="fas fa-sign-in-alt text-success"></i>
                            <div class="activity-details">
                                <strong>Admin Login</strong>
                                <p>You logged in to the system</p>
                                <small>${new Date().toLocaleTimeString()}</small>
                            </div>
                        </div>
                        <div class="activity-item">
                            <i class="fas fa-book text-info"></i>
                            <div class="activity-details">
                                <strong>Book Added</strong>
                                <p>"Introduction to Programming" was added to library</p>
                                <small>Today, 09:30 AM</small>
                            </div>
                        </div>
                        <div class="activity-item">
                            <i class="fas fa-user-check text-warning"></i>
                            <div class="activity-details">
                                <strong>User Verified</strong>
                                <p>John Doe's account was verified</p>
                                <small>Yesterday, 03:45 PM</small>
                            </div>
                        </div>
                        <div class="activity-item">
                            <i class="fas fa-file-export text-primary"></i>
                            <div class="activity-details">
                                <strong>Report Generated</strong>
                                <p>Monthly usage report was downloaded</p>
                                <small>Yesterday, 11:20 AM</small>
                            </div>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-action" onclick="exportActivityLog()">
                            <i class="fas fa-download"></i> Export Log
                        </button>
                        <button class="btn-action" onclick="clearActivityLog()">
                            <i class="fas fa-trash"></i> Clear Log
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.querySelector('#activityLogModal .modal-close').addEventListener('click', function() {
        closeModal('activityLogModal');
    });
}

// ================= REPORT FUNCTIONS =================
function generateQuickReport() {
    showNotification('Generating quick report...', 'info');
    
    setTimeout(() => {
        const reportWindow = window.open('', '_blank');
        const reportDate = new Date().toLocaleDateString();
        const reportTime = new Date().toLocaleTimeString();
        
        reportWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Library Report - ${reportDate}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    h1 { color: #2c3e50; }
                    .report-header { margin-bottom: 30px; }
                    .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0; }
                    .stat-box { padding: 20px; background: #f8f9fa; border-radius: 8px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background: #2c3e50; color: white; }
                    .print-btn { padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; }
                </style>
            </head>
            <body>
                <div class="report-header">
                    <h1>Admas University Library - Quick Report</h1>
                    <p>Generated: ${reportDate} at ${reportTime}</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-box">
                        <h3>Total Books</h3>
                        <p style="font-size: 24px; font-weight: bold;">1,245</p>
                    </div>
                    <div class="stat-box">
                        <h3>Registered Users</h3>
                        <p style="font-size: 24px; font-weight: bold;">8,523</p>
                    </div>
                </div>
                
                <h3>Recent Activities</h3>
                <table>
                    <tr><th>Time</th><th>Activity</th><th>User</th></tr>
                    <tr><td>Today, 10:30 AM</td><td>Book Checkout</td><td>John Smith</td></tr>
                    <tr><td>Today, 09:45 AM</td><td>New User Registration</td><td>Mary Johnson</td></tr>
                    <tr><td>Yesterday, 03:20 PM</td><td>Book Return</td><td>Robert Brown</td></tr>
                </table>
                
                <button class="print-btn" onclick="window.print()">Print Report</button>
            </body>
            </html>
        `);
    }, 1000);
}

function generateReport() {
    showNotification('Preparing comprehensive report...', 'info');
    
    // Simulate report generation
    setTimeout(() => {
        const reportData = {
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            books: {
                total: 1245,
                available: 983,
                borrowed: 262
            },
            users: {
                total: 8523,
                active: 7231,
                newThisMonth: 156
            },
            activities: {
                checkouts: 342,
                returns: 298,
                reservations: 89
            }
        };
        
        // Create download link
        const reportContent = `
ADMAS UNIVERSITY LIBRARY - COMPREHENSIVE REPORT
Generated: ${reportData.date} ${reportData.time}

=== LIBRARY STATISTICS ===
Total Books: ${reportData.books.total}
Available: ${reportData.books.available}
Currently Borrowed: ${reportData.books.borrowed}

=== USER STATISTICS ===
Total Users: ${reportData.users.total}
Active Users: ${reportData.users.active}
New Users This Month: ${reportData.users.newThisMonth}

=== ACTIVITY SUMMARY ===
Book Checkouts: ${reportData.activities.checkouts}
Book Returns: ${reportData.activities.returns}
Reservations: ${reportData.activities.reservations}

=== SYSTEM STATUS ===
Uptime: 99.7%
Last Backup: Yesterday, 02:00 AM
Next Maintenance: Next Saturday, 01:00 AM
        `;
        
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `library_report_${reportData.date.replace(/\//g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Report downloaded successfully!', 'success');
    }, 1500);
}

// ================= STATS FUNCTIONS =================
function initializeStatsCards() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const statType = this.querySelector('p').textContent;
            showNotification(`Viewing details for: ${statType}`, 'info');
            
            // For Total Books card
            if (statType.includes('Total Books')) {
                window.location.href = 'manage-books.html';
            }
            // For Registered Users card
            else if (statType.includes('Registered Users')) {
                window.location.href = 'manage-users.html';
            }
            // For Pending Requests card
            else if (statType.includes('Pending Requests')) {
                showPendingRequestsModal();
            }
            // For System Uptime card
            else if (statType.includes('System Uptime')) {
                showSystemHealthModal();
            }
        });
    });
}

function updateDashboardStats() {
    // Simulate updating stats
    const booksElement = document.querySelector('.stat-card:nth-child(1) h3');
    const usersElement = document.querySelector('.stat-card:nth-child(2) h3');
    const requestsElement = document.querySelector('.stat-card:nth-child(3) h3');
    
    if (booksElement) booksElement.textContent = '1,247';
    if (usersElement) usersElement.textContent = '8,525';
    if (requestsElement) requestsElement.textContent = '125';
    
    showNotification('Dashboard stats updated!', 'success');
}

function updateBookCount(increment = 0) {
    const booksElement = document.querySelector('.stat-card:nth-child(1) h3');
    if (booksElement) {
        let current = parseInt(booksElement.textContent.replace(/,/g, ''));
        booksElement.textContent = (current + increment).toLocaleString();
    }
}

function updateUserCount(increment = 0) {
    const usersElement = document.querySelector('.stat-card:nth-child(2) h3');
    if (usersElement) {
        let current = parseInt(usersElement.textContent.replace(/,/g, ''));
        usersElement.textContent = (current + increment).toLocaleString();
    }
}

// ================= UTILITY FUNCTIONS =================
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.admin-notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideIn 0.3s ease;
        min-width: 300px;
        max-width: 400px;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Close button event
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function showWelcomeNotification() {
    const adminName = sessionStorage.getItem('adminName') || 'Administrator';
    const welcomeMessages = [
        `Welcome back, ${adminName}!`,
        `Good to see you, ${adminName}!`,
        `Hello ${adminName}, ready to manage the library?`,
        `${adminName}, your dashboard is updated!`
    ];
    
    const message = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    showNotification(message, 'info');
}

function setupLogout() {
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutAdmin);
    }
}

function setupRealTimeUpdates() {
    // Update pending requests every minute
    setInterval(() => {
        const requestsElement = document.querySelector('.stat-card:nth-child(3) h3');
        if (requestsElement) {
            let current = parseInt(requestsElement.textContent);
            // Simulate random change
            const change = Math.floor(Math.random() * 5) - 2;
            const newValue = Math.max(0, current + change);
            requestsElement.textContent = newValue;
        }
    }, 60000); // Every minute
}

// ================= GLOBAL FUNCTIONS =================
window.logoutAdmin = function() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        
        // Clear session
        sessionStorage.removeItem('isAdminLoggedIn');
        sessionStorage.removeItem('adminUsername');
        sessionStorage.removeItem('adminName');
        sessionStorage.removeItem('lastActivity');
        
        setTimeout(() => {
            window.location.href = 'admin-login.html';
        }, 1000);
    }
};

window.exportActivityLog = function() {
    showNotification('Exporting activity log...', 'info');
    // Implementation for exporting log
};

window.clearActivityLog = function() {
    if (confirm('Clear all activity logs? This cannot be undone.')) {
        showNotification('Activity log cleared!', 'success');
        closeModal('activityLogModal');
    }
};

// Add animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .activity-item {
        display: flex;
        gap: 15px;
        padding: 15px;
        border-bottom: 1px solid #eee;
        align-items: flex-start;
    }
    .activity-details {
        flex: 1;
    }
    .activity-details small {
        color: #95a5a6;
    }
    .text-success { color: #27ae60; }
    .text-info { color: #3498db; }
    .text-warning { color: #f39c12; }
    .text-primary { color: #2c3e50; }
    .modal-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
        justify-content: flex-end;
    }
    .btn-action {
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
    }
`;
document.head.appendChild(animationStyles);

// Session timeout (keep your existing implementation)
let timeoutWarning;
function checkSession() {
    const lastActivity = parseInt(sessionStorage.getItem('lastActivity') || Date.now());
    const timeElapsed = Date.now() - lastActivity;
    
    if (timeElapsed > 25 * 60 * 1000) {
        timeoutWarning = setTimeout(() => {
            if (confirm('Your session will expire in 5 minutes. Continue?')) {
                sessionStorage.setItem('lastActivity', Date.now());
            } else {
                logoutAdmin();
            }
        }, 1000);
    }
}

function updateLastActivity() {
    sessionStorage.setItem('lastActivity', Date.now());
}

// Event listeners for session management
document.addEventListener('mousemove', updateLastActivity);
document.addEventListener('keypress', updateLastActivity);
document.addEventListener('click', updateLastActivity);

// Initialize session
sessionStorage.setItem('lastActivity', Date.now());
setInterval(checkSession, 60000);