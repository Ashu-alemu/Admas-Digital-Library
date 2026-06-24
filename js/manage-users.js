// Manage Users Functionality
let allUsers = [];
let currentUsers = [];
let currentPage = 1;
const usersPerPage = 10;
let searchTerm = '';
let currentRole = '';
let currentStatus = '';
let currentDepartment = '';
let currentSort = 'name';

// Sample user data (will be loaded from localStorage)
const sampleUsers = [
    {
        id: 'user_1',
        fullName: 'Bontu Wakagari',
        email: 'bontu@admas.edu.et',
        studentId: 'ATR/001/14',
        phone: '+251 97 821 7070',
        role: 'student',
        department: 'computer-science',
        year: '4th Year',
        address: 'Addis Ababa, Ethiopia',
        status: 'active',
        booksBorrowed: 12,
        joinDate: '2022-09-01',
        avatar: null
    },
    {
        id: 'user_2',
        fullName: 'Hana Daba',
        email: 'hana@admas.edu.et',
        studentId: 'ATR/002/14',
        phone: '+251 91 234 5678',
        role: 'student',
        department: 'computer-science',
        year: '4th Year',
        address: 'Addis Ababa, Ethiopia',
        status: 'active',
        booksBorrowed: 8,
        joinDate: '2022-09-01',
        avatar: null
    },
    {
        id: 'user_3',
        fullName: 'Ashenafi Lakew',
        email: 'ashenafi@admas.edu.et',
        studentId: 'ATR/003/14',
        phone: '+251 92 345 6789',
        role: 'student',
        department: 'computer-science',
        year: '4th Year',
        address: 'Addis Ababa, Ethiopia',
        status: 'active',
        booksBorrowed: 15,
        joinDate: '2022-09-01',
        avatar: null
    },
    {
        id: 'user_4',
        fullName: 'Dr. Samuel Mekonnen',
        email: 'samuel@admas.edu.et',
        staffId: 'STAFF/001',
        phone: '+251 93 456 7890',
        role: 'faculty',
        department: 'computer-science',
        position: 'Professor',
        address: 'Addis Ababa, Ethiopia',
        status: 'active',
        booksBorrowed: 3,
        joinDate: '2020-01-15',
        avatar: null
    },
    {
        id: 'user_5',
        fullName: 'Alemitu Bekele',
        email: 'alemitu@admas.edu.et',
        studentId: 'BUS/001/15',
        phone: '+251 94 567 8901',
        role: 'student',
        department: 'business',
        year: '3rd Year',
        address: 'Addis Ababa, Ethiopia',
        status: 'active',
        booksBorrowed: 5,
        joinDate: '2023-09-01',
        avatar: null
    },
    {
        id: 'user_6',
        fullName: 'Tewodros Girma',
        email: 'tewodros@admas.edu.et',
        staffId: 'STAFF/002',
        phone: '+251 95 678 9012',
        role: 'staff',
        department: 'library',
        position: 'Librarian',
        address: 'Addis Ababa, Ethiopia',
        status: 'active',
        booksBorrowed: 0,
        joinDate: '2021-03-10',
        avatar: null
    }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check admin login
    if (!sessionStorage.getItem('isAdminLoggedIn')) {
        window.location.href = 'admin-login.html';
        return;
    }

    // Load users and initialize
    loadUsers();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Enter key for search
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchUsers();
        }
    });

    // Real-time search
    document.getElementById('searchInput').addEventListener('input', function() {
        if (this.value.trim() === '') {
            searchTerm = '';
            filterAndDisplayUsers();
        }
    });
}

// Load users from localStorage
function loadUsers() {
    try {
        // Try to load from localStorage first
        allUsers = JSON.parse(localStorage.getItem('libraryUsers') || '[]');
        
        // If no users in localStorage, use sample data
        if (allUsers.length === 0) {
            allUsers = [...sampleUsers];
            localStorage.setItem('libraryUsers', JSON.stringify(allUsers));
        }
        
        // Calculate statistics
        updateUsersStats();
        
        // Filter and display users
        filterAndDisplayUsers();
        
        // Update UI
        updatePagination();
        
        console.log(`Loaded ${allUsers.length} users`);
    } catch (error) {
        console.error('Error loading users:', error);
        showNoDataMessage();
    }
}

// Calculate and display statistics
function updateUsersStats() {
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter(user => user.status === 'active').length;
    const students = allUsers.filter(user => user.role === 'student').length;
    const totalBooksBorrowed = allUsers.reduce((sum, user) => sum + (user.booksBorrowed || 0), 0);

    const statsHTML = `
        <div class="stat-card">
            <i class="fas fa-users"></i>
            <h3>${totalUsers}</h3>
            <p>Total Users</p>
        </div>
        <div class="stat-card">
            <i class="fas fa-user-check"></i>
            <h3>${activeUsers}</h3>
            <p>Active Users</p>
        </div>
        <div class="stat-card">
            <i class="fas fa-graduation-cap"></i>
            <h3>${students}</h3>
            <p>Students</p>
        </div>
        <div class="stat-card">
            <i class="fas fa-book"></i>
            <h3>${totalBooksBorrowed}</h3>
            <p>Books Borrowed</p>
        </div>
    `;

    document.getElementById('usersStats').innerHTML = statsHTML;
}

// Filter users based on search and filters
function filterAndDisplayUsers() {
    let filteredUsers = [...allUsers];

    // Apply search
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
            user.fullName.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            (user.studentId && user.studentId.toLowerCase().includes(term)) ||
            (user.staffId && user.staffId.toLowerCase().includes(term))
        );
    }

    // Apply role filter
    if (currentRole) {
        filteredUsers = filteredUsers.filter(user => user.role === currentRole);
    }

    // Apply status filter
    if (currentStatus) {
        filteredUsers = filteredUsers.filter(user => user.status === currentStatus);
    }

    // Apply department filter
    if (currentDepartment) {
        filteredUsers = filteredUsers.filter(user => user.department === currentDepartment);
    }

    // Apply sorting
    filteredUsers = sortUserList(filteredUsers);

    // Update current users
    currentUsers = filteredUsers;

    // Display users
    displayUsers(currentPage);

    // Update pagination
    updatePagination();

    // Show/hide no data message
    if (filteredUsers.length === 0) {
        showNoDataMessage();
    } else {
        hideNoDataMessage();
    }
}

// Sort users
function sortUserList(users) {
    switch(currentSort) {
        case 'name':
            return users.sort((a, b) => a.fullName.localeCompare(b.fullName));
        case 'name-desc':
            return users.sort((a, b) => b.fullName.localeCompare(a.fullName));
        case 'date':
            return users.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
        case 'books':
            return users.sort((a, b) => (b.booksBorrowed || 0) - (a.booksBorrowed || 0));
        default:
            return users;
    }
}

// Display users for current page
function displayUsers(page) {
    const tableBody = document.getElementById('usersTableBody');
    tableBody.innerHTML = '';

    // Calculate start and end indices
    const startIndex = (page - 1) * usersPerPage;
    const endIndex = Math.min(startIndex + usersPerPage, currentUsers.length);
    const pageUsers = currentUsers.slice(startIndex, endIndex);

    if (pageUsers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    No users to display
                </td>
            </tr>
        `;
        return;
    }

    // Create table rows
    pageUsers.forEach((user, index) => {
        const row = createUserRow(user, startIndex + index);
        tableBody.appendChild(row);
    });
}

// Create a user table row
function createUserRow(user, index) {
    const row = document.createElement('tr');
    
    // Get first letter for avatar
    const firstLetter = user.fullName.charAt(0).toUpperCase();
    
    // Get ID (student or staff)
    const userID = user.studentId || user.staffId || 'N/A';
    
    // Role badge
    let roleBadge;
    switch(user.role) {
        case 'student':
            roleBadge = `<span class="role-badge student">Student</span>`;
            break;
        case 'faculty':
            roleBadge = `<span class="role-badge faculty">Faculty</span>`;
            break;
        case 'staff':
            roleBadge = `<span class="role-badge staff">Staff</span>`;
            break;
        case 'admin':
            roleBadge = `<span class="role-badge admin">Admin</span>`;
            break;
        default:
            roleBadge = `<span class="role-badge student">Student</span>`;
    }
    
    // Status badge
    let statusBadge;
    switch(user.status) {
        case 'active':
            statusBadge = `<span class="status-badge status-active">
                <i class="fas fa-circle"></i> Active
            </span>`;
            break;
        case 'inactive':
            statusBadge = `<span class="status-badge status-inactive">
                <i class="fas fa-circle"></i> Inactive
            </span>`;
            break;
        case 'suspended':
            statusBadge = `<span class="status-badge status-suspended">
                <i class="fas fa-circle"></i> Suspended
            </span>`;
            break;
        default:
            statusBadge = `<span class="status-badge status-active">
                <i class="fas fa-circle"></i> Active
            </span>`;
    }
    
    // Department name
    const departmentMap = {
        'computer-science': 'Computer Science',
        'engineering': 'Engineering',
        'business': 'Business',
        'arts': 'Arts & Humanities',
        'science': 'Science',
        'law': 'Law',
        'medicine': 'Medicine',
        'library': 'Library'
    };
    
    const departmentName = departmentMap[user.department] || user.department || 'N/A';
    
    row.innerHTML = `
        <td>
            <div class="user-info-cell">
                <div class="user-avatar">
                    ${user.avatar ? `<img src="${user.avatar}" alt="${user.fullName}">` : firstLetter}
                </div>
                <div>
                    <div class="user-name">${user.fullName}</div>
                    <div class="user-email">${user.email}</div>
                </div>
            </div>
        </td>
        <td>${userID}</td>
        <td>${roleBadge}</td>
        <td>${departmentName}</td>
        <td>
            <div>${user.booksBorrowed || 0}</div>
            <div style="font-size: 0.8rem; color: #7f8c8d;">
                ${user.booksBorrowed === 0 ? 'No books' : 'Currently borrowed'}
            </div>
        </td>
        <td>${statusBadge}</td>
        <td>
            <div class="action-buttons">
                <button class="action-btn-small btn-view" onclick="viewUser('${user.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn-small btn-edit" onclick="editUser('${user.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn-small btn-delete" onclick="deleteUser('${user.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;

    return row;
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(currentUsers.length / usersPerPage);
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
            ${currentUsers.length} users, Page ${currentPage} of ${totalPages}
        </span>
    `;

    paginationDiv.innerHTML = paginationHTML;
}

// Go to specific page
function goToPage(page) {
    if (page < 1 || page > Math.ceil(currentUsers.length / usersPerPage)) return;
    
    currentPage = page;
    displayUsers(page);
    updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Search users
function searchUsers() {
    searchTerm = document.getElementById('searchInput').value.trim();
    currentPage = 1;
    filterAndDisplayUsers();
}

// Filter users
function filterUsers() {
    currentRole = document.getElementById('roleFilter').value;
    currentStatus = document.getElementById('statusFilter').value;
    currentDepartment = document.getElementById('departmentFilter').value;
    currentPage = 1;
    filterAndDisplayUsers();
}

// Sort users
function sortUsers() {
    currentSort = document.getElementById('sortFilter').value;
    filterAndDisplayUsers();
}

// View user details
function viewUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) {
        alert('User not found!');
        return;
    }

    const departmentMap = {
        'computer-science': 'Computer Science',
        'engineering': 'Engineering',
        'business': 'Business',
        'arts': 'Arts & Humanities',
        'science': 'Science',
        'law': 'Law',
        'medicine': 'Medicine',
        'library': 'Library'
    };
    
    const roleMap = {
        'student': 'Student',
        'faculty': 'Faculty Member',
        'staff': 'Staff',
        'admin': 'Administrator'
    };
    
    const statusMap = {
        'active': 'Active',
        'inactive': 'Inactive',
        'suspended': 'Suspended'
    };
    
    const departmentName = departmentMap[user.department] || user.department || 'N/A';
    const roleName = roleMap[user.role] || user.role;
    const statusName = statusMap[user.status] || user.status;

    const detailsHTML = `
        <div class="user-details-modal">
            <div class="user-details-header" style="display: flex; gap: 30px; margin-bottom: 30px;">
                <div class="user-avatar-large" style="width: 120px; height: 120px; border-radius: 50%; 
                     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                     display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                    ${user.avatar ? 
                        `<img src="${user.avatar}" alt="${user.fullName}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` :
                        user.fullName.charAt(0).toUpperCase()
                    }
                </div>
                <div style="flex: 1;">
                    <h2 style="color: #2c3e50; margin-bottom: 10px;">${user.fullName}</h2>
                    <p style="color: #3498db; font-size: 1.1rem; margin-bottom: 15px;">${user.email}</p>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                        <div>
                            <strong>Role:</strong><br>
                            ${roleName}
                        </div>
                        <div>
                            <strong>Status:</strong><br>
                            <span style="color: ${user.status === 'active' ? '#27ae60' : '#e74c3c'}">
                                ${statusName}
                            </span>
                        </div>
                        <div>
                            <strong>ID Number:</strong><br>
                            ${user.studentId || user.staffId || 'N/A'}
                        </div>
                        <div>
                            <strong>Department:</strong><br>
                            ${departmentName}
                        </div>
                        <div>
                            <strong>Phone:</strong><br>
                            ${user.phone || 'N/A'}
                        </div>
                        <div>
                            <strong>Year/Level:</strong><br>
                            ${user.year || user.position || 'N/A'}
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between;">
                            <div>
                                <strong>Books Borrowed:</strong> ${user.booksBorrowed || 0}
                            </div>
                            <div>
                                <strong>Join Date:</strong> ${user.joinDate || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            ${user.address ? `
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #2c3e50; margin-bottom: 10px;">Address</h3>
                    <p style="line-height: 1.6; color: #555;">${user.address}</p>
                </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 30px;">
                <button onclick="editUser('${user.id}')" style="padding: 10px 25px; background: #3498db; color: white; 
                       border: none; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
                    <i class="fas fa-edit"></i> Edit User
                </button>
            </div>
        </div>
    `;

    document.getElementById('viewUserContent').innerHTML = detailsHTML;
    openModal('viewUserModal');
}

// Edit user
function editUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) {
        alert('User not found!');
        return;
    }

    const editFormHTML = `
        <form id="editUserFormContent" onsubmit="saveUserChanges(event, '${user.id}')">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div class="form-group">
                    <label for="editFullName">Full Name *</label>
                    <input type="text" id="editFullName" class="form-control" value="${user.fullName}" required>
                </div>
                <div class="form-group">
                    <label for="editEmail">Email Address *</label>
                    <input type="email" id="editEmail" class="form-control" value="${user.email}" required>
                </div>
                <div class="form-group">
                    <label for="editID">ID Number *</label>
                    <input type="text" id="editID" class="form-control" value="${user.studentId || user.staffId || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editPhone">Phone Number</label>
                    <input type="tel" id="editPhone" class="form-control" value="${user.phone || ''}">
                </div>
                <div class="form-group">
                    <label for="editRole">Role *</label>
                    <select id="editRole" class="form-control" required>
                        <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
                        <option value="faculty" ${user.role === 'faculty' ? 'selected' : ''}>Faculty</option>
                        <option value="staff" ${user.role === 'staff' ? 'selected' : ''}>Staff</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editDepartment">Department</label>
                    <select id="editDepartment" class="form-control">
                        <option value="">Select Department</option>
                        <option value="computer-science" ${user.department === 'computer-science' ? 'selected' : ''}>Computer Science</option>
                        <option value="engineering" ${user.department === 'engineering' ? 'selected' : ''}>Engineering</option>
                        <option value="business" ${user.department === 'business' ? 'selected' : ''}>Business</option>
                        <option value="arts" ${user.department === 'arts' ? 'selected' : ''}>Arts & Humanities</option>
                        <option value="science" ${user.department === 'science' ? 'selected' : ''}>Science</option>
                        <option value="law" ${user.department === 'law' ? 'selected' : ''}>Law</option>
                        <option value="medicine" ${user.department === 'medicine' ? 'selected' : ''}>Medicine</option>
                        <option value="library" ${user.department === 'library' ? 'selected' : ''}>Library</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editYear">Year/Level</label>
                    <input type="text" id="editYear" class="form-control" value="${user.year || user.position || ''}">
                </div>
                <div class="form-group">
                    <label for="editStatus">Status *</label>
                    <select id="editStatus" class="form-control" required>
                        <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                        <option value="suspended" ${user.status === 'suspended' ? 'selected' : ''}>Suspended</option>
                    </select>
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label for="editAddress">Address</label>
                    <textarea id="editAddress" class="form-control" rows="3">${user.address || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="editBooksBorrowed">Books Borrowed</label>
                    <input type="number" id="editBooksBorrowed" class="form-control" value="${user.booksBorrowed || 0}" min="0">
                </div>
                <div class="form-group">
                    <label for="editJoinDate">Join Date</label>
                    <input type="date" id="editJoinDate" class="form-control" value="${user.joinDate || ''}">
                </div>
            </div>
            
            <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <button type="button" class="btn-cancel" onclick="closeModal('editUserModal')">
                    Cancel
                </button>
                <button type="submit" class="btn-submit">
                    Save Changes
                </button>
            </div>
        </form>
    `;

    document.getElementById('editUserForm').innerHTML = editFormHTML;
    openModal('editUserModal');
}

// Save user changes
function saveUserChanges(event, userId) {
    event.preventDefault();
    
    const userIndex = allUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        alert('User not found!');
        return;
    }

    // Get form values
    const updatedUser = {
        ...allUsers[userIndex],
        fullName: document.getElementById('editFullName').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        phone: document.getElementById('editPhone').value.trim() || null,
        role: document.getElementById('editRole').value,
        department: document.getElementById('editDepartment').value || null,
        status: document.getElementById('editStatus').value,
        address: document.getElementById('editAddress').value.trim() || null,
        booksBorrowed: parseInt(document.getElementById('editBooksBorrowed').value) || 0,
        joinDate: document.getElementById('editJoinDate').value || null
    };

    // Set appropriate ID field based on role
    const id = document.getElementById('editID').value.trim();
    if (updatedUser.role === 'student') {
        updatedUser.studentId = id;
        updatedUser.staffId = null;
    } else {
        updatedUser.staffId = id;
        updatedUser.studentId = null;
    }

    // Set year/position field
    const yearPosition = document.getElementById('editYear').value.trim();
    if (updatedUser.role === 'student') {
        updatedUser.year = yearPosition || null;
        updatedUser.position = null;
    } else {
        updatedUser.position = yearPosition || null;
        updatedUser.year = null;
    }

    // Update user
    allUsers[userIndex] = updatedUser;

    // Save to localStorage
    localStorage.setItem('libraryUsers', JSON.stringify(allUsers));

    // Close modal and refresh
    closeModal('editUserModal');
    loadUsers();
    
    alert('User updated successfully!');
}

// Delete user
function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }

    const userIndex = allUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        alert('User not found!');
        return;
    }

    const userName = allUsers[userIndex].fullName;

    // Check if user has borrowed books
    if (allUsers[userIndex].booksBorrowed > 0) {
        if (!confirm(`User "${userName}" has ${allUsers[userIndex].booksBorrowed} borrowed books. Delete anyway?`)) {
            return;
        }
    }

    // Remove user
    allUsers.splice(userIndex, 1);

    // Save to localStorage
    localStorage.setItem('libraryUsers', JSON.stringify(allUsers));

    // Refresh
    loadUsers();
    
    alert(`User "${userName}" deleted successfully!`);
}

// Add new user
function addNewUser() {
    openModal('addUserModal');
}

// Save new user
function saveNewUser(event) {
    event.preventDefault();

    // Generate unique ID
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Get form values
    const newUser = {
        id: userId,
        fullName: document.getElementById('newFullName').value.trim(),
        email: document.getElementById('newEmail').value.trim(),
        phone: document.getElementById('newPhone').value.trim() || null,
        role: document.getElementById('newRole').value,
        department: document.getElementById('newDepartment').value || null,
        status: document.getElementById('newStatus').value,
        address: document.getElementById('newAddress').value.trim() || null,
        booksBorrowed: 0,
        joinDate: new Date().toISOString().split('T')[0],
        avatar: null
    };

    // Set appropriate ID field
    const id = document.getElementById('newID').value.trim();
    if (newUser.role === 'student') {
        newUser.studentId = id;
        newUser.staffId = null;
    } else {
        newUser.staffId = id;
        newUser.studentId = null;
    }

    // Set year/position field
    const yearPosition = document.getElementById('newYear').value.trim();
    if (newUser.role === 'student') {
        newUser.year = yearPosition || null;
        newUser.position = null;
    } else {
        newUser.position = yearPosition || null;
        newUser.year = null;
    }

    // Add to users array
    allUsers.push(newUser);

    // Save to localStorage
    localStorage.setItem('libraryUsers', JSON.stringify(allUsers));

    // Close modal and refresh
    closeModal('addUserModal');
    loadUsers();
    
    // Reset form
    document.getElementById('addUserForm').reset();
    
    alert('New user added successfully!');
}

// Export users to CSV
function exportUsers() {
    if (allUsers.length === 0) {
        alert('No users to export!');
        return;
    }

    // Create CSV content
    const headers = ['Full Name', 'Email', 'ID', 'Role', 'Department', 'Status', 'Phone', 'Books Borrowed', 'Join Date'];
    const csvRows = [headers.join(',')];

    allUsers.forEach(user => {
        const row = [
            `"${user.fullName}"`,
            `"${user.email}"`,
            `"${user.studentId || user.staffId || ''}"`,
            user.role,
            `"${user.department || ''}"`,
            user.status,
            `"${user.phone || ''}"`,
            user.booksBorrowed || 0,
            user.joinDate || ''
        ];
        csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const date = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `admas_library_users_${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`Exported ${allUsers.length} users to CSV file!`);
}

// Show no data message
function showNoDataMessage() {
    document.getElementById('usersTable').style.display = 'none';
    document.getElementById('pagination').style.display = 'none';
    document.getElementById('noDataMessage').style.display = 'block';
}

// Hide no data message
function hideNoDataMessage() {
    document.getElementById('usersTable').style.display = 'table';
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
window.searchUsers = searchUsers;
window.filterUsers = filterUsers;
window.sortUsers = sortUsers;
window.goToPage = goToPage;
window.viewUser = viewUser;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.addNewUser = addNewUser;
window.saveNewUser = saveNewUser;
window.exportUsers = exportUsers;
window.closeModal = closeModal;