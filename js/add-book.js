// Add Book Functionality
let currentTab = 'single';
let csvBooksData = [];
let selectedCategory = '';

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check admin login
    if (!sessionStorage.getItem('isAdminLoggedIn')) {
        window.location.href = 'admin-login.html';
        return;
    }

    // Setup event listeners
    setupEventListeners();
    
    // Setup drag and drop for cover image
    setupDragAndDrop();
    
    // Setup category selection
    setupCategorySelection();
    
    // Setup real-time preview
    setupRealTimePreview();
});

// Setup event listeners
function setupEventListeners() {
    // Cover upload click
    document.getElementById('coverUploadArea').addEventListener('click', function() {
        document.getElementById('coverUpload').click();
    });
    
    // Cover file input change
    document.getElementById('coverUpload').addEventListener('change', function(e) {
        if (this.files.length) {
            handleCoverUpload(this.files[0]);
        }
    });
    
    // Enter key for search (if any)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBooks();
            }
        });
    }
    
    // Enable real-time form validation
    setupFormValidation();
}

// Setup drag and drop for cover image
function setupDragAndDrop() {
    const dropArea = document.getElementById('coverUploadArea');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.style.borderColor = '#3498db';
        dropArea.style.background = '#e3f2fd';
    }
    
    function unhighlight() {
        dropArea.style.borderColor = '#bdc3c7';
        dropArea.style.background = '#f8f9fa';
    }
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length) {
            handleCoverUpload(files[0]);
        }
    }
}

// Handle cover image upload
function handleCoverUpload(file) {
    // Validate file type
    if (!file.type.match('image.*')) {
        alert('Please select an image file (JPG, PNG, GIF, etc.)');
        return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Update preview in upload area
        const coverPreview = document.getElementById('coverPreview');
        coverPreview.innerHTML = `<img src="${e.target.result}" alt="Book Cover">`;
        
        // Update preview in preview section
        const previewCoverImage = document.getElementById('previewCoverImage');
        previewCoverImage.src = e.target.result;
        previewCoverImage.style.display = 'block';
        document.getElementById('previewCoverPlaceholder').style.display = 'none';
        
        // Store the image data
        localStorage.setItem('tempCoverImage', e.target.result);
    };
    
    reader.readAsDataURL(file);
}

// Setup category selection
function setupCategorySelection() {
    const categoryOptions = document.querySelectorAll('.category-option');
    categoryOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            categoryOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            selectedCategory = this.dataset.category;
            document.getElementById('bookCategory').value = selectedCategory;
            
            // Update preview
            updateBookPreview();
            
            // Hide error if shown
            document.getElementById('categoryError').classList.remove('show');
        });
    });
}

// Setup real-time preview
function setupRealTimePreview() {
    const fields = ['bookTitle', 'bookAuthor', 'bookYear', 'bookPages', 'bookDescription', 'bookCopies'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', updateBookPreview);
        }
    });
}

// Update book preview
function updateBookPreview() {
    // Update title
    const title = document.getElementById('bookTitle').value || 'Book Title';
    document.getElementById('previewTitle').textContent = title;
    
    // Update author
    const author = document.getElementById('bookAuthor').value || 'Author Name';
    document.getElementById('previewAuthor').textContent = author;
    
    // Update year
    const year = document.getElementById('bookYear').value || '2024';
    document.getElementById('previewYear').textContent = year;
    
    // Update pages
    const pages = document.getElementById('bookPages').value || '--';
    document.getElementById('previewPages').textContent = pages;
    
    // Update description
    const description = document.getElementById('bookDescription').value || 'Book description will appear here...';
    document.getElementById('previewDescription').textContent = description;
    
    // Update copies
    const copies = document.getElementById('bookCopies').value || '1';
    document.getElementById('previewCopies').textContent = copies;
    
    // Update category
    if (selectedCategory) {
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
        
        const categoryName = categoryMap[selectedCategory] || selectedCategory;
        document.getElementById('previewCategory').textContent = categoryName;
    }
}

// Setup form validation
function setupFormValidation() {
    const requiredFields = ['bookTitle', 'bookAuthor', 'bookYear', 'bookDescription', 'bookCopies'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', validateField);
        }
    });
}

// Validate individual field
function validateField() {
    const fieldId = this.id;
    const value = this.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch(fieldId) {
        case 'bookTitle':
            if (value.length < 3 || value.length > 200) {
                isValid = false;
                errorMessage = 'Title must be between 3-200 characters';
            }
            break;
        case 'bookAuthor':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Please enter a valid author name';
            }
            break;
        case 'bookYear':
            const year = parseInt(value);
            if (isNaN(year) || year < 1500 || year > new Date().getFullYear()) {
                isValid = false;
                errorMessage = `Please enter a valid year (1500-${new Date().getFullYear()})`;
            }
            break;
        case 'bookDescription':
            if (value.length < 50 || value.length > 1000) {
                isValid = false;
                errorMessage = 'Description must be between 50-1000 characters';
            }
            break;
        case 'bookCopies':
            const copies = parseInt(value);
            if (isNaN(copies) || copies < 1) {
                isValid = false;
                errorMessage = 'Please enter at least 1 copy';
            }
            break;
    }
    
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        } else {
            errorElement.classList.remove('show');
        }
    }
    
    return isValid;
}

// Validate entire form
function validateForm() {
    let isValid = true;
    
    // Validate required fields
    const requiredFields = ['bookTitle', 'bookAuthor', 'bookYear', 'bookDescription', 'bookCopies'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !validateField.call(field)) {
            isValid = false;
        }
    });
    
    // Validate category
    if (!selectedCategory) {
        document.getElementById('categoryError').classList.add('show');
        isValid = false;
    } else {
        document.getElementById('categoryError').classList.remove('show');
    }
    
    return isValid;
}

// Switch between tabs
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });
    
    // Show active section
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(tabName + 'Form').classList.add('active');
    
    // Reset CSV preview if switching to single
    if (tabName === 'single') {
        document.getElementById('csvPreview').style.display = 'none';
        csvBooksData = [];
    }
}

// Submit single book
function submitSingleBook() {
    if (!validateForm()) {
        alert('Please fill in all required fields correctly.');
        return;
    }
    
    // Collect book data
    const book = {
        id: 'book_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        title: document.getElementById('bookTitle').value.trim(),
        author: document.getElementById('bookAuthor').value.trim(),
        isbn: document.getElementById('bookISBN').value.trim(),
        year: parseInt(document.getElementById('bookYear').value),
        publisher: document.getElementById('bookPublisher').value.trim(),
        pages: document.getElementById('bookPages').value ? parseInt(document.getElementById('bookPages').value) : null,
        description: document.getElementById('bookDescription').value.trim(),
        category: selectedCategory,
        categoryDisplay: getCategoryDisplayName(selectedCategory),
        copies: parseInt(document.getElementById('bookCopies').value),
        availableCopies: parseInt(document.getElementById('bookCopies').value),
        location: document.getElementById('bookLocation').value.trim(),
        language: document.getElementById('bookLanguage').value,
        edition: document.getElementById('bookEdition').value.trim(),
        keywords: document.getElementById('bookKeywords').value.split(',').map(k => k.trim()).filter(k => k),
        coverImage: localStorage.getItem('tempCoverImage'),
        addedDate: new Date().toISOString().split('T')[0],
        status: 'available',
        borrowedCount: 0,
        rating: 0,
        reviews: []
    };
    
    // Save book
    if (saveBookToStorage(book)) {
        showSuccessMessage(book);
        
        // Clear form
        clearForm();
        
        // Clear temp image
        localStorage.removeItem('tempCoverImage');
    } else {
        alert('Error saving book. Please try again.');
    }
}

// Get category display name
function getCategoryDisplayName(category) {
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
    
    return categoryMap[category] || category;
}

// Save book to localStorage
function saveBookToStorage(book) {
    try {
        // Get existing books
        let books = JSON.parse(localStorage.getItem('libraryBooks') || '[]');
        
        // Add new book
        books.push(book);
        
        // Save back to localStorage
        localStorage.setItem('libraryBooks', JSON.stringify(books));
        
        // Also save to homepage display
        updateHomepageBooks(book);
        
        console.log('Book saved successfully:', book);
        return true;
    } catch (error) {
        console.error('Error saving book:', error);
        return false;
    }
}

// Update homepage books
function updateHomepageBooks(book) {
    // Get homepage books
    let homepageBooks = JSON.parse(localStorage.getItem('homepageBooks') || '[]');
    
    // Add new book to beginning
    homepageBooks.unshift({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.categoryDisplay,
        coverImage: book.coverImage,
        available: book.availableCopies > 0
    });
    
    // Keep only latest 12 books
    if (homepageBooks.length > 12) {
        homepageBooks = homepageBooks.slice(0, 12);
    }
    
    // Save back
    localStorage.setItem('homepageBooks', JSON.stringify(homepageBooks));
}

// Show success message
function showSuccessMessage(book) {
    // Hide form
    document.querySelectorAll('.form-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show success message
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    
    // Update success message with book info
    document.getElementById('addedBookInfo').innerHTML = `
        <strong>${book.title}</strong> by ${book.author} has been added to the library with ${book.copies} copies.
    `;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Clear form
function clearForm() {
    // Clear all form fields
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookAuthor').value = '';
    document.getElementById('bookISBN').value = '';
    document.getElementById('bookYear').value = new Date().getFullYear();
    document.getElementById('bookPublisher').value = '';
    document.getElementById('bookPages').value = '';
    document.getElementById('bookDescription').value = '';
    document.getElementById('bookCopies').value = '1';
    document.getElementById('bookLocation').value = '';
    document.getElementById('bookEdition').value = '';
    document.getElementById('bookKeywords').value = '';
    
    // Clear category selection
    document.querySelectorAll('.category-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    selectedCategory = '';
    document.getElementById('bookCategory').value = '';
    
    // Clear cover image
    const coverPreview = document.getElementById('coverPreview');
    coverPreview.innerHTML = `
        <i class="fas fa-book"></i>
        <span style="font-size: 0.9rem; margin-top: 10px;">No cover selected</span>
    `;
    
    document.getElementById('previewCoverImage').style.display = 'none';
    document.getElementById('previewCoverPlaceholder').style.display = 'flex';
    
    // Clear errors
    document.querySelectorAll('.form-error').forEach(error => {
        error.classList.remove('show');
    });
    
    // Reset preview
    updateBookPreview();
}

// Add another book
function addAnotherBook() {
    // Hide success message
    document.getElementById('successMessage').style.display = 'none';
    
    // Show single form
    switchTab('single');
    
    // Show form
    document.querySelectorAll('.form-section').forEach(section => {
        section.style.display = 'block';
    });
}

// CSV Import Functions
function downloadCSVTemplate() {
    const template = `Title,Author,ISBN,Year,Publisher,Pages,Category,Description,Copies,Language,Location,Edition
"Software Engineering","Ian Sommerville","978-0133943030",2015,"Pearson",790,"computer-science","Comprehensive guide to software engineering principles",5,"English","Shelf A-1","10th Edition"
"Database Systems","Abraham Silberschatz","978-0078022159",2019,"McGraw-Hill",1344,"computer-science","Complete database systems textbook",3,"English","Shelf B-3","7th Edition"
"Digital Libraries","Michael Lesk","978-0262122989",2005,"MIT Press",308,"computer-science","Introduction to digital library concepts",2,"English","Shelf C-2","1st Edition"
"Java Programming","Herbert Schildt","978-1259589317",2017,"McGraw-Hill",1248,"computer-science","Complete Java programming guide",4,"English","Shelf A-5","10th Edition"`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admas_library_books_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
        alert('Please select a CSV file.');
        return;
    }

    // Validate file size
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB.');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const csvContent = e.target.result;
            const books = parseCSVFile(csvContent);
            
            if (books.length > 0) {
                csvBooksData = books;
                showCSVPreview(books);
            } else {
                alert('No valid books found in the CSV file. Please check the format.');
            }
        } catch (error) {
            console.error('Error parsing CSV:', error);
            alert('Error parsing CSV file. Please ensure it follows the correct format.');
        }
    };
    
    reader.readAsText(file);
}

function parseCSVFile(csvContent) {
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return [];
    
    // Parse headers
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Map header indices
    const titleIndex = headers.indexOf('title');
    const authorIndex = headers.indexOf('author');
    const isbnIndex = headers.indexOf('isbn');
    const yearIndex = headers.indexOf('year');
    const categoryIndex = headers.indexOf('category');
    const copiesIndex = headers.indexOf('copies');
    const publisherIndex = headers.indexOf('publisher');
    const pagesIndex = headers.indexOf('pages');
    const descriptionIndex = headers.indexOf('description');
    const languageIndex = headers.indexOf('language');
    const locationIndex = headers.indexOf('location');
    const editionIndex = headers.indexOf('edition');
    
    const books = [];
    
    // Parse data rows (limit to 100 rows)
    for (let i = 1; i < Math.min(lines.length, 101); i++) {
        const values = parseCSVLine(lines[i]);
        
        if (values.length > 0) {
            const book = {
                title: titleIndex >= 0 ? values[titleIndex].trim() : '',
                author: authorIndex >= 0 ? values[authorIndex].trim() : '',
                isbn: isbnIndex >= 0 ? values[isbnIndex].trim() : '',
                year: yearIndex >= 0 ? parseInt(values[yearIndex]) || new Date().getFullYear() : new Date().getFullYear(),
                publisher: publisherIndex >= 0 ? values[publisherIndex].trim() : '',
                pages: pagesIndex >= 0 ? parseInt(values[pagesIndex]) || null : null,
                category: categoryIndex >= 0 ? values[categoryIndex].trim() : 'computer-science',
                description: descriptionIndex >= 0 ? values[descriptionIndex].trim() : '',
                copies: copiesIndex >= 0 ? parseInt(values[copiesIndex]) || 1 : 1,
                language: languageIndex >= 0 ? values[languageIndex].trim() || 'english' : 'english',
                location: locationIndex >= 0 ? values[locationIndex].trim() : '',
                edition: editionIndex >= 0 ? values[editionIndex].trim() : '1st Edition'
            };
            
            // Validate required fields
            if (book.title && book.author && book.year >= 1500 && book.year <= new Date().getFullYear() && book.copies > 0) {
                books.push(book);
            }
        }
    }
    
    return books;
}

function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"' && !inQuotes) {
            inQuotes = true;
        } else if (char === '"' && inQuotes && nextChar === '"') {
            current += '"';
            i++; // Skip next quote
        } else if (char === '"' && inQuotes) {
            inQuotes = false;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    values.push(current);
    return values;
}

function showCSVPreview(books) {
    const previewBody = document.getElementById('csvPreviewBody');
    previewBody.innerHTML = '';
    
    // Show first 5 books
    const previewBooks = books.slice(0, 5);
    
    previewBooks.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${book.year}</td>
            <td>${book.isbn || 'N/A'}</td>
        `;
        previewBody.appendChild(row);
    });
    
    // Update count
    document.getElementById('importCount').textContent = `${books.length} books found`;
    
    // Show preview
    document.getElementById('csvPreview').style.display = 'block';
}

function openCSVPreview() {
    // Create sample data
    const sampleBooks = [
        {
            title: "Software Engineering",
            author: "Ian Sommerville",
            category: "computer-science",
            year: 2015,
            isbn: "978-0133943030"
        },
        {
            title: "Database Systems",
            author: "Abraham Silberschatz",
            category: "computer-science",
            year: 2019,
            isbn: "978-0078022159"
        },
        {
            title: "Digital Libraries",
            author: "Michael Lesk",
            category: "computer-science",
            year: 2005,
            isbn: "978-0262122989"
        }
    ];
    
    showCSVPreview(sampleBooks);
}

function importFromCSV() {
    if (csvBooksData.length === 0) {
        alert('No books to import. Please upload a CSV file first.');
        return;
    }
    
    if (!confirm(`Are you sure you want to import ${csvBooksData.length} books?`)) {
        return;
    }
    
    let importedCount = 0;
    let failedCount = 0;
    
    csvBooksData.forEach(book => {
        try {
            const fullBook = {
                id: 'book_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                title: book.title,
                author: book.author,
                isbn: book.isbn,
                year: book.year,
                publisher: book.publisher,
                pages: book.pages,
                description: book.description,
                category: book.category,
                categoryDisplay: getCategoryDisplayName(book.category),
                copies: book.copies,
                availableCopies: book.copies,
                location: book.location,
                language: book.language,
                edition: book.edition,
                keywords: [],
                coverImage: null,
                addedDate: new Date().toISOString().split('T')[0],
                status: 'available',
                borrowedCount: 0,
                rating: 0,
                reviews: []
            };
            
            if (saveBookToStorage(fullBook)) {
                importedCount++;
            } else {
                failedCount++;
            }
        } catch (error) {
            console.error('Error importing book:', error);
            failedCount++;
        }
    });
    
    // Show results
    if (importedCount > 0) {
        alert(`Successfully imported ${importedCount} books! ${failedCount > 0 ? `(${failedCount} failed)` : ''}`);
        
        // Clear CSV preview
        document.getElementById('csvPreview').style.display = 'none';
        csvBooksData = [];
        
        // Switch back to single tab
        switchTab('single');
    } else {
        alert('No books were imported. Please check your CSV file format.');
    }
}

// Export functions to global scope
window.switchTab = switchTab;
window.submitSingleBook = submitSingleBook;
window.addAnotherBook = addAnotherBook;
window.downloadCSVTemplate = downloadCSVTemplate;
window.handleCSVUpload = handleCSVUpload;
window.openCSVPreview = openCSVPreview;
window.importFromCSV = importFromCSV;