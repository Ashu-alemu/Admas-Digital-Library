// add-admin.js - Add Admin Script

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in as admin
    checkAdminAccess();
    
    // DOM Elements
    const addAdminForm = document.getElementById('addAdminForm');
    const passwordInput = document.getElementById('adminPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const alertBox = document.getElementById('addAdminAlert');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthValue = document.querySelector('.strength-value');
    
    // Password visibility toggle
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            togglePasswordVisibility(passwordInput, this);
        });
    }
    
    if (toggleConfirmPasswordBtn) {
        toggleConfirmPasswordBtn.addEventListener('click', function() {
            togglePasswordVisibility(confirmPasswordInput, this);
        });
    }
    
    // Password strength checker
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }
    
    // Form submission
    if (addAdminForm) {
        addAdminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                return;
            }
            
            // Get form data
            const adminData = getFormData();
            
            // Show loading
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Admin...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Save admin to localStorage/database
                const success = saveAdmin(adminData);
                
                if (success) {
                    showAlert('Admin account created successfully!', 'success');
                    
                    // Log the action
                    logAdminCreation(adminData);
                    
                    // Clear form
                    this.reset();
                    strengthFill.style.width = '0%';
                    strengthValue.textContent = 'Very Weak';
                    
                    // Redirect after delay
                    setTimeout(() => {
                        window.location.href = 'admin-dashboard.html';
                    }, 2000);
                } else {
                    showAlert('Failed to create admin account. Username might already exist.', 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }, 1500);
        });
    }
    
    // Auto-generate username from email
    const emailInput = document.getElementById('adminEmail');
    const usernameInput = document.getElementById('adminUsername');
    
    if (emailInput && usernameInput) {
        emailInput.addEventListener('blur', function() {
            if (!usernameInput.value && this.value) {
                const email = this.value;
                const suggestedUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
                usernameInput.value = suggestedUsername;
            }
        });
    }
    
    // Functions
    function togglePasswordVisibility(input, button) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        button.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    }
    
    function checkPasswordStrength(password) {
        let strength = 0;
        let text = 'Very Weak';
        let color = '#e74c3c';
        let width = '0%';
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Complexity checks
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        // Determine strength level
        if (strength >= 4) {
            text = 'Strong';
            color = '#27ae60';
            width = '100%';
        } else if (strength >= 3) {
            text = 'Good';
            color = '#f39c12';
            width = '75%';
        } else if (strength >= 2) {
            text = 'Fair';
            color = '#f1c40f';
            width = '50%';
        } else if (strength >= 1) {
            text = 'Weak';
            color = '#e67e22';
            width = '25%';
        }
        
        // Update UI
        if (strengthFill) {
            strengthFill.style.width = width;
            strengthFill.style.background = color;
        }
        
        if (strengthValue) {
            strengthValue.textContent = text;
            strengthValue.style.color = color;
        }
    }
    
    function validateForm() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const username = document.getElementById('adminUsername').value;
        const email = document.getElementById('adminEmail').value;
        
        // Check if passwords match
        if (password !== confirmPassword) {
            showAlert('Passwords do not match!', 'error');
            return false;
        }
        
        // Check password strength
        if (password.length < 8) {
            showAlert('Password must be at least 8 characters long', 'error');
            return false;
        }
        
        // Check if username is available
        if (isUsernameTaken(username)) {
            showAlert('Username already exists. Please choose another.', 'error');
            return false;
        }
        
        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Please enter a valid email address', 'error');
            return false;
        }
        
        // Check if at least one permission is selected
        const permissions = document.querySelectorAll('input[name="permissions"]:checked');
        if (permissions.length === 0) {
            showAlert('Please select at least one permission', 'error');
            return false;
        }
        
        // Check terms agreement
        const agreeTerms = document.getElementById('agreeTerms').checked;
        if (!agreeTerms) {
            showAlert('You must agree to the terms and conditions', 'error');
            return false;
        }
        
        return true;
    }
    
    function getFormData() {
        const permissions = [];
        document.querySelectorAll('input[name="permissions"]:checked').forEach(checkbox => {
            permissions.push(checkbox.value);
        });
        
        return {
            id: generateAdminId(),
            fullName: document.getElementById('adminFullName').value,
            email: document.getElementById('adminEmail').value,
            username: document.getElementById('adminUsername').value,
            employeeId: document.getElementById('adminEmployeeId').value,
            password: document.getElementById('adminPassword').value,
            secretQuestion: document.getElementById('adminSecretQuestion').value,
            secretAnswer: document.getElementById('adminSecretAnswer').value,
            role: document.getElementById('adminRole').value,
            permissions: permissions,
            createdBy: sessionStorage.getItem('adminUsername') || 'system',
            createdAt: new Date().toISOString(),
            status: 'active',
            lastLogin: null,
            loginCount: 0
        };
    }
    
    function saveAdmin(adminData) {
        try {
            // Get existing admins from localStorage
            const admins = JSON.parse(localStorage.getItem('libraryAdmins') || '[]');
            
            // Check if username already exists
            if (admins.some(admin => admin.username === adminData.username)) {
                return false;
            }
            
            // Hash password (in production, use proper hashing)
            const hashedData = {
                ...adminData,
                password: btoa(adminData.password) // Simple base64 encoding for demo
            };
            
            // Add new admin
            admins.push(hashedData);
            
            // Save back to localStorage
            localStorage.setItem('libraryAdmins', JSON.stringify(admins));
            
            // Also add to quick access list
            const quickAccess = JSON.parse(localStorage.getItem('adminQuickAccess') || '[]');
            quickAccess.push({
                id: adminData.id,
                username: adminData.username,
                role: adminData.role,
                name: adminData.fullName
            });
            localStorage.setItem('adminQuickAccess', JSON.stringify(quickAccess));
            
            return true;
        } catch (error) {
            console.error('Error saving admin:', error);
            return false;
        }
    }
    
    function isUsernameTaken(username) {
        const admins = JSON.parse(localStorage.getItem('libraryAdmins') || '[]');
        return admins.some(admin => admin.username === username);
    }
    
    function generateAdminId() {
        return 'ADM-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    
    function showAlert(message, type) {
        if (!alertBox) return;
        
        alertBox.textContent = message;
        alertBox.className = 'alert-message alert-' + type;
        alertBox.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 5000);
    }
    
    function logAdminCreation(adminData) {
        const logs = JSON.parse(localStorage.getItem('adminActivityLogs') || '[]');
        
        logs.push({
            action: 'CREATE_ADMIN',
            admin: sessionStorage.getItem('adminUsername') || 'system',
            targetAdmin: adminData.username,
            timestamp: new Date().toISOString(),
            details: `Created ${adminData.role} account for ${adminData.fullName}`
        });
        
        localStorage.setItem('adminActivityLogs', JSON.stringify(logs));
    }
    
    function checkAdminAccess() {
        // Check if user is logged in as admin
        if (!sessionStorage.getItem('isAdminLoggedIn') || sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
            alert('Access denied. Only administrators can add new admins.');
            window.location.href = 'admin-login.html';
            return;
        }
        
        // Check if current admin has permission to add admins
        const currentAdmin = sessionStorage.getItem('adminUsername');
        const admins = JSON.parse(localStorage.getItem('libraryAdmins') || '[]');
        const admin = admins.find(a => a.username === currentAdmin);
        
        // If no stored admins yet, allow (first time setup)
        if (admins.length === 0) {
            document.getElementById('currentAdmin').textContent = 'System Setup';
            return;
        }
        
        // Check permissions
        if (!admin || !admin.permissions || !admin.permissions.includes('manage_admins')) {
            alert('You do not have permission to add administrators.');
            window.location.href = 'admin-dashboard.html';
            return;
        }
        
        // Display current admin name
        document.getElementById('currentAdmin').textContent = sessionStorage.getItem('adminName') || 'Administrator';
    }
    
    // Initialize demo data if none exists
    function initializeDemoData() {
        if (!localStorage.getItem('libraryAdmins')) {
            const demoAdmins = [
                {
                    id: 'ADM-001',
                    fullName: 'System Administrator',
                    email: 'admin@admas.edu.et',
                    username: 'admin',
                    employeeId: 'EMP-001',
                    password: btoa('admin123'),
                    secretQuestion: 'pet',
                    secretAnswer: 'demo',
                    role: 'super_admin',
                    permissions: ['manage_books', 'manage_users', 'manage_admins', 'view_reports', 'system_settings', 'backup_restore'],
                    createdBy: 'system',
                    createdAt: new Date().toISOString(),
                    status: 'active'
                }
            ];
            localStorage.setItem('libraryAdmins', JSON.stringify(demoAdmins));
        }
    }
    
    // Initialize on load
    initializeDemoData();
});