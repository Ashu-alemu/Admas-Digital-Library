// view-admins.js - View and Manage Admins

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
    loadAdmins();
    setupEventListeners();
});

function checkAdminAccess() {
    if (!sessionStorage.getItem('isAdminLoggedIn')) {
        alert('Access denied. Please login as administrator.');
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Display current admin
    const currentAdmin = sessionStorage.getItem('adminName') || 'Administrator';
    document.getElementById('currentAdmin').textContent = currentAdmin;
}

function loadAdmins() {
    const admins = JSON.parse(localStorage.getItem('libraryAdmins') || '[]');
    const tbody = document.getElementById('adminsTableBody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (admins.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">
                    <i class="fas fa-users-slash"></i>
                    <p>No administrators found</p>
                    <a href="add-admin.html" class="btn-add-first">Add First Admin</a>
                </td>
            </tr>
        `;
        updateTableCount(0);
        return;
    }
    
    admins.forEach(admin => {
        const row = document.createElement('tr');
        const lastLogin = admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never';
        const statusClass = admin.status === 'active' ? 'status-active' : 'status-inactive';
        
        row.innerHTML = `
            <td>${admin.id}</td>
            <td>
                <div class="admin-name">
                    <i class="fas fa-user-circle"></i>
                    <span>${admin.fullName}</span>
                </div>
            </td>
            <td>${admin.username}</td>
            <td>${admin.email}</td>
            <td>
                <span class="admin-role ${admin.role}">${formatRole(admin.role)}</span>
            </td>
            <td>
                <span class="admin-status ${statusClass}">
                    <i class="fas fa-circle"></i> ${admin.status}
                </span>
            </td>
            <td>${lastLogin}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-view" onclick="viewAdmin('${admin.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="editAdmin('${admin.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteAdmin('${admin.id}', '${admin.username}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    updateTableCount(admins.length);
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchAdmins');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchAdmins(this.value);
        });
    }
}

function searchAdmins(query = '') {
    const admins = JSON.parse(localStorage.getItem('libraryAdmins') || '[]');
    const tbody = document.getElementById('adminsTableBody');
    
    if (!query.trim()) {
        loadAdmins();
        return;
    }
    
    query = query.toLowerCase();
    const filteredAdmins = admins.filter(admin => 
        admin.fullName.toLowerCase().includes(query) ||
        admin.username.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query) ||
        admin.role.toLowerCase().includes(query)
    );
    
    tbody.innerHTML = '';
    
    if (filteredAdmins.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">
                    <i class="fas fa-search"></i>
                    <p>No administrators found matching "${query}"</p>
                </td>
            </tr>
        `;
        updateTableCount(0, query);
        return;
    }
    
    filteredAdmins.forEach(admin => {
        const row = document.createElement('tr');
        const lastLogin = admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never';
        const statusClass = admin.status === 'active' ? 'status-active' : 'status-inactive';
        
        row.innerHTML = `
            <td>${admin.id}</td>
            <td>
                <div class="admin-name">
                    <i class="fas fa-user-circle"></i>
                    <span>${admin.fullName}</span>
                </div>
            </td>
            <td>${admin.username}</td>
            <td>${admin.email}</td>
            <td>
                <span class="admin-role ${admin.role}">${formatRole(admin.role)}</span>
            </td>
            <td>
                <span class="admin-status ${statusClass}">
                    <i class="fas fa-circle"></i> ${admin.status}
                </span>
            </td>
            <td>${lastLogin}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-view" onclick="viewAdmin('${admin.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="editAdmin('${admin.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteAdmin('${admin.id}', '${admin.username}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    updateTableCount(filteredAdmins.length, query);
}

function updateTableCount(count, searchQuery = '') {
    const countElement = document.getElementById('tableCount');
    if (!countElement) return;
    
    if (searchQuery) {
        countElement.textContent = `Found ${count} administrator(s) matching "${searchQuery}"`;
    } else {
        countElement.textContent = `Showing ${count} administrator(s)`;
    }
}

function formatRole(role) {
    const roles = {
        'super_admin': 'Super Admin',
        'library_admin': 'Library Admin',
        'content_admin': 'Content Admin',
        'user_admin': 'User Admin',
        'report_admin': 'Report Admin'
    };
    return roles[role] || role;
}

function viewAdmin(adminId) {
    const admins = JSON.parse(localStorage.getItem('libraryAdmins') || '[]');
    const admin = admins.find(a => a.id === adminId);
    
    if (!admin) {
        alert('Admin not found');
        return;
    }
    
    alert(`
        Admin Details:
        
        ID: ${admin.id}
        Name: ${admin.fullName}
        Username: ${admin.username}
        Email: ${admin.email}
        Role: ${formatRole(admin.role)}
        Status: ${admin.status}
        Created: ${new Date(admin.createdAt).toLocaleDateString()}
        Permissions: ${admin.permissions ? admin.permissions.join(', ') : 'None'}
    `);
}

function editAdmin(adminId) {
    // In a real app, this would open an edit modal
    alert('Edit functionality would open here.\n\nIn a real application, this would load an edit form with the admin details.');
    
    // For now, redirect to a hypothetical edit page
    // window.location.href = `edit-admin.html?id=${adminId}`;
}

function deleteAdmin(adminId, username) {
    // Don't allow deleting self
    const currentAdmin = sessionStorage.getItem('adminUsername');
    if (username === currentAdmin) {
        alert('You cannot delete your own account!');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete administrator "${username}"?\n\nThis action cannot be undone.`)) {
        return;
    }
    
    const admins = JSON.parse(localStorage.getItem('libraryAdmins') || '[]');
    const filteredAdmins = admins.filter(admin => admin.id !== adminId);
    
    // Update localStorage
    localStorage.setItem('libraryAdmins', JSON.stringify(filteredAdmins));
    
    // Log the action
    logAdminDeletion(username);
    
    // Reload the table
    loadAdmins();
    
    alert(`Administrator "${username}" has been deleted.`);
}

function logAdminDeletion(username) {
    const logs = JSON.parse(localStorage.getItem('adminActivityLogs') || '[]');
    
    logs.push({
        action: 'DELETE_ADMIN',
        admin: sessionStorage.getItem('adminUsername'),
        targetAdmin: username,
        timestamp: new Date().toISOString(),
        details: `Deleted administrator account`
    });
    
    localStorage.setItem('adminActivityLogs', JSON.stringify(logs));
}

function closeModal() {
    document.getElementById('editAdminModal').style.display = 'none';
}