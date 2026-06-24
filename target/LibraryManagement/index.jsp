<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admas University Library</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; }
        
        .navbar {
            background: #2c3e50;
            color: white;
            padding: 15px 0;
        }
        
        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .navbar .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .logo i {
            font-size: 24px;
            color: #3498db;
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 25px;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .hero {
            background: #2c3e50;
            color: white;
            padding: 80px 0;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        
        .search-box {
            max-width: 600px;
            margin: 30px auto;
            display: flex;
            background: white;
            border-radius: 50px;
            overflow: hidden;
        }
        
        .search-box input {
            flex: 1;
            padding: 15px 25px;
            border: none;
            font-size: 16px;
        }
        
        .search-box button {
            background: #3498db;
            color: white;
            border: none;
            padding: 15px 30px;
            cursor: pointer;
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 50px;
            margin-top: 50px;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-item i {
            font-size: 2.5rem;
            color: #3498db;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <div class="logo">
                <i class="fas fa-book"></i>
                <h1>Admas Digital Library</h1>
            </div>
            <ul class="nav-links">
                <li><a href="index.jsp"><i class="fas fa-home"></i> Home</a></li>
                <li><a href="login.jsp"><i class="fas fa-sign-in-alt"></i> Login</a></li>
                <li><a href="register.jsp"><i class="fas fa-user-plus"></i> Register</a></li>
            </ul>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1>Welcome to Admas University Digital Library</h1>
            <p>Access thousands of books, journals, and resources anytime, anywhere</p>
            
            <div class="search-box">
                <input type="text" placeholder="Search books by title, author, or keyword...">
                <button><i class="fas fa-search"></i> Search</button>
            </div>
            
            <div class="stats">
                <div class="stat-item">
                    <i class="fas fa-book-open"></i>
                    <h3>15,000+</h3>
                    <p>Books Available</p>
                </div>
                <div class="stat-item">
                    <i class="fas fa-users"></i>
                    <h3>8,500+</h3>
                    <p>Active Members</p>
                </div>
                <div class="stat-item">
                    <i class="fas fa-laptop"></i>
                    <h3>24/7</h3>
                    <p>Online Access</p>
                </div>
            </div>
        </div>
    </section>
    
    <script>
        // Simple search functionality
        document.querySelector('.search-box button').addEventListener('click', function() {
            const query = document.querySelector('.search-box input').value;
            if (query.trim()) {
                alert('Searching for: ' + query);
            }
        });
    </script>
</body>
</html>