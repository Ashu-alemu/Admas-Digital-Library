// admin-auth.js - Admin Authentication Script

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminForm = document.getElementById('adminLoginForm');
    const togglePasswordBtn = document.getElementById('toggleAdminPassword');
    const adminPasswordInput = document.getElementById('adminPassword');
    const forgotPasswordLink = document.getElementById('forgotAdminPassword');
    const alertBox = document.getElementById('adminAlert');
    
    // Test Admin Credentials (In production, replace with real API call)
    const validAdmins = [
        { username: 'admin', password: 'admin123', name: 'System Administrator' },
        { username: 'librarian', password: 'lib123', name: 'Head Librarian' },
        { username: 'manager', password: 'manage123', name: 'Library Manager' }
    ];
    
    // Password visibility toggle
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = adminPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            adminPasswordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // Form submission
    if (adminForm) {
        adminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const username = document.getElementById('adminUsername').value.trim();
            const password = document.getElementById('adminPassword').value;
            const secret = document.getElementById('adminSecret').value;
            const rememberMe = document.getElementById('rememberAdmin').checked;
            
            // Validate inputs
            if (!username || !password) {
                showAlert('Please enter both username and password', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.btn-login');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            // Simulate API call delay
            setTimeout(() => {
                // Check credentials
                const admin = validAdmins.find(a => 
                    a.username === username && a.password === password
                );
                
                if (admin) {
                    // Successful login
                    showAlert(`Welcome, ${admin.name}! Redirecting to dashboard...`, 'success');
                    
                    // Store session data
                    sessionStorage.setItem('isAdminLoggedIn', 'true');
                    sessionStorage.setItem('adminUsername', admin.username);
                    sessionStorage.setItem('adminName', admin.name);
                    
                    // Store in localStorage if "Remember me" is checked
                    if (rememberMe) {
                        localStorage.setItem('adminRemembered', 'true');
                        localStorage.setItem('adminUsername', admin.username);
                    } else {
                        localStorage.removeItem('adminRemembered');
                        localStorage.removeItem('adminUsername');
                    }
                    
                    // Log the login attempt
                    logAdminLogin(username, 'success');
                    
                    // Redirect to admin dashboard after delay
                    setTimeout(() => {
                        window.location.href = 'admin-dashboard.html';
                    }, 1500);
                    
                } else {
                    // Failed login
                    showAlert('Invalid admin credentials. Please try again.', 'error');
                    
                    // Log failed attempt
                    logAdminLogin(username, 'failed');
                    
                    // Reset button state
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                    
                    // Increment failed attempts
                    incrementFailedAttempts();
                }
            }, 1500);
        });
    }
    
    // Forgot password functionality
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showAlert('Please contact the system administrator at admin@admas.edu.et to reset your credentials.', 'info');
        });
    }
    
    // Check for remembered admin
    const remembered = localStorage.getItem('adminRemembered');
    const rememberedUsername = localStorage.getItem('adminUsername');
    
    if (remembered === 'true' && rememberedUsername) {
        document.getElementById('adminUsername').value = rememberedUsername;
        document.getElementById('rememberAdmin').checked = true;
    }
    
    // Auto-focus on username field
    document.getElementById('adminUsername').focus();
    
    // Utility Functions
    function showAlert(message, type) {
        if (!alertBox) return;
        
        alertBox.textContent = message;
        alertBox.className = 'alert-message alert-' + type;
        alertBox.style.display = 'block';
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 5000);
        }
    }
    
    function logAdminLogin(username, status) {
        const logs = JSON.parse(localStorage.getItem('adminLoginLogs') || '[]');
        const logEntry = {
            username: username,
            status: status,
            timestamp: new Date().toISOString(),
            ip: '127.0.0.1', // In real app, get actual IP
            userAgent: navigator.userAgent
        };
        
        logs.push(logEntry);
        
        // Keep only last 50 logs
        if (logs.length > 50) {
            logs.shift();
        }
        
        localStorage.setItem('adminLoginLogs', JSON.stringify(logs));
        console.log(`Admin login ${status}: ${username} at ${logEntry.timestamp}`);
    }
    
    function incrementFailedAttempts() {
        let attempts = parseInt(localStorage.getItem('failedAdminAttempts') || '0');
        attempts++;
        localStorage.setItem('failedAdminAttempts', attempts.toString());
        
        // Lock after 3 failed attempts
        if (attempts >= 3) {
            const lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
            localStorage.setItem('adminLockedUntil', lockUntil.toString());
            showAlert('Too many failed attempts. Account locked for 15 minutes.', 'error');
            disableLoginForm();
        }
    }
    
    function checkIfLocked() {
        const lockUntil = localStorage.getItem('adminLockedUntil');
        if (lockUntil && Date.now() < parseInt(lockUntil)) {
            const minutesLeft = Math.ceil((parseInt(lockUntil) - Date.now()) / 60000);
            showAlert(`Account locked. Try again in ${minutesLeft} minutes.`, 'error');
            disableLoginForm();
            return true;
        }
        return false;
    }
    
    function disableLoginForm() {
        if (adminForm) {
            adminForm.querySelectorAll('input, button').forEach(el => {
                el.disabled = true;
            });
        }
    }
    
    // Check if account is locked on page load
    checkIfLocked();
    
    // Clear failed attempts after successful login
    window.addEventListener('beforeunload', function() {
        if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
            localStorage.removeItem('failedAdminAttempts');
            localStorage.removeItem('adminLockedUntil');
        }
    });
    
    // Session timeout (30 minutes)
    let sessionTimer;
    function resetSessionTimer() {
        clearTimeout(sessionTimer);
        sessionTimer = setTimeout(() => {
            if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
                sessionStorage.removeItem('isAdminLoggedIn');
                alert('Session expired. Please login again.');
                window.location.href = 'admin-login.html';
            }
        }, 30 * 60 * 1000); // 30 minutes
    }
    
    // Reset timer on user activity
    document.addEventListener('mousemove', resetSessionTimer);
    document.addEventListener('keypress', resetSessionTimer);
    resetSessionTimer();
});