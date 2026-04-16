// ============================================
// Node.js MySQL User Management App - Main Server
// ============================================

// Import required packages
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();
const port = 3000;

// Set up middleware
app.set('view engine', 'ejs'); // Set EJS as templating engine
app.set('views', path.join(__dirname, 'views')); // Set views directory
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// MySQL Database Connection Configuration
// IMPORTANT: Replace 'your_password' with your actual MySQL root password
const connection = mysql.createConnection({
    host: 'localhost',        // MySQL server hostname
    user: 'root',             // MySQL username
    password: 'Vitianhumai@30', // MySQL password
    database: 'node_app'      // Database name
});

// Connect to MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Successfully connected to MySQL database!');
});

// ============================================
// EXPRESS ROUTES
// ============================================

// Home route - redirects to users list
app.get('/', (req, res) => {
    res.redirect('/users');
});

// Show all users route - GET /users
app.get('/users', (req, res) => {
    // SQL query to get all users ordered by ID
    const sql = 'SELECT * FROM users ORDER BY id DESC';
    
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).send('Error fetching users from database');
            return;
        }
        
        // Render the index.ejs template with users data
        res.render('index', { 
            users: results,
            title: 'User Management System'
        });
    });
});

// Add user form route - GET /users/new
app.get('/users/new', (req, res) => {
    // Render the new.ejs template for adding a user
    res.render('new', { 
        title: 'Add New User'
    });
});

// Insert user route - POST /users
app.post('/users', (req, res) => {
    // Get user data from form
    const { name, email } = req.body;
    
    // Validate input
    if (!name || !email) {
        res.status(400).send('Name and email are required');
        return;
    }
    
    // SQL query to insert new user
    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    
    connection.query(sql, [name, email], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).send('Error inserting user into database');
            return;
        }
        
        console.log('User inserted successfully with ID:', result.insertId);
        // Redirect to users list after successful insertion
        res.redirect('/users');
    });
});

// Edit user form route - GET /users/:id/edit
app.get('/users/:id/edit', (req, res) => {
    const userId = req.params.id;
    
    // SQL query to get specific user by ID
    const sql = 'SELECT * FROM users WHERE id = ?';
    
    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Error fetching user from database');
            return;
        }
        
        // Check if user exists
        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }
        
        // Render the edit.ejs template with user data
        res.render('edit', { 
            user: results[0],
            title: 'Edit User'
        });
    });
});

// Update user route - POST /users/:id
app.post('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    
    // Validate input
    if (!name || !email) {
        res.status(400).send('Name and email are required');
        return;
    }
    
    // SQL query to update user
    const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    
    connection.query(sql, [name, email, userId], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).send('Error updating user in database');
            return;
        }
        
        // Check if any row was affected
        if (result.affectedRows === 0) {
            res.status(404).send('User not found');
            return;
        }
        
        console.log('User updated successfully with ID:', userId);
        // Redirect to users list after successful update
        res.redirect('/users');
    });
});

// Delete user route - POST /users/:id/delete
app.post('/users/:id/delete', (req, res) => {
    const userId = req.params.id;
    
    // SQL query to delete user by ID
    const sql = 'DELETE FROM users WHERE id = ?';
    
    connection.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.status(500).send('Error deleting user');
            return;
        }
        
        // Check if any row was affected
        if (result.affectedRows === 0) {
            res.status(404).send('User not found');
            return;
        }
        
        console.log('User deleted successfully with ID:', userId);
        // Redirect to users list after successful deletion
        res.redirect('/users');
    });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 Error Handler - for undefined routes
app.use((req, res) => {
    res.status(404).render('error', { 
        title: 'Page Not Found',
        message: 'The page you are looking for does not exist.'
    });
});

// 500 Error Handler - for server errors
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).render('error', { 
        title: 'Server Error',
        message: 'Something went wrong on our end. Please try again later.'
    });
});

// ============================================
// START SERVER
// ============================================

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log('User Management App is ready!');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    connection.end((err) => {
        if (err) {
            console.error('Error closing database connection:', err);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});
