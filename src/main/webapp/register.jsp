<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Admas Library</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .register-container {
            background: white;
            border-radius: 20px;
            padding: 50px;
            width: 100%;
            max-width: 600px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .register-header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .register-header h1 {
            color: #2c3e50;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }
        
        .form-row {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .form-group {
            flex: 1;
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #2c3e50;
            font-weight: 500;
        }
        
        .form-group input,
        .form-group select {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
        }
        
        .btn-register {
            width: 100%;
            padding: 15px;
            background: #27ae60;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            cursor: pointer;
            margin-top: 20px;
        }
        
        .register-footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        
        .register-footer a {
            color: #3498db;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="logo">
    <!-- Use CONTEXT PATH for JSP -->
    <img src="${pageContext.request.contextPath}/images/logo.png" 
         alt="Admas Library Logo" 
         class="logo-img">
    <h1>Admas Digital Library</h1>
</div>
    <div class="register-container">
        <div class="register-header">
            <h1><i class="fas fa-user-plus"></i> Create Account</h1>
            <p>Join Admas University Digital Library</p>
        </div>
        
        <form action="register" method="post">
            <div class="form-row">
                <div class="form-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" required>
                </div>
                <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" required>
                </div>
            </div>
            
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="name@admas.edu.et" required>
            </div>
            
            <div class="form-group">
                <label>Student/Staff ID</label>
                <input type="text" name="idNumber" required>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>User Type</label>
                    <select name="userType" required>
                        <option value="">Select Role</option>
                        <option value="STUDENT">Student</option>
                        <option value="TEACHER">Teacher/Staff</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" required>
                </div>
            </div>
            
            <button type="submit" class="btn-register">
                <i class="fas fa-user-plus"></i> Register
            </button>
        </form>
        
        <div class="register-footer">
            <p>Already have an account? <a href="login.jsp">Login here</a></p>
        </div>
        
        <%-- Display success/error messages --%>
        <%
            String success = request.getParameter("success");
            String error = request.getParameter("error");
            
            if (success != null) {
        %>
            <div style="color: green; margin-top: 20px; padding: 10px; background: #e6ffe6; border-radius: 5px;">
                <i class="fas fa-check-circle"></i> <%= success %>
            </div>
        <%
            }
            
            if (error != null) {
        %>
            <div style="color: red; margin-top: 20px; padding: 10px; background: #ffe6e6; border-radius: 5px;">
                <i class="fas fa-exclamation-circle"></i> <%= error %>
            </div>
        <%
            }
        %>
    </div>
</body>
</html>