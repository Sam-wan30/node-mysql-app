// ============================================
// Node.js MySQL User Management App - Database Seeder
// ============================================

// Import required packages
const mysql = require('mysql2');
const { faker } = require('@faker-js/faker');

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
// SEEDER FUNCTIONS
// ============================================

// Function to generate fake users
function generateFakeUsers(count) {
    const users = [];
    
    for (let i = 0; i < count; i++) {
        // Generate fake user data
        const fakeUser = {
            name: faker.person.fullName(),           // Generate full name
            email: faker.internet.email()            // Generate email
        };
        
        users.push(fakeUser);
    }
    
    return users;
}

// Function to insert users in bulk
function seedUsers(users) {
    // Prepare values array for bulk insert
    const values = users.map(user => [user.name, user.email]);
    
    // SQL query for bulk insertion
    const sql = 'INSERT INTO users (name, email) VALUES ?';
    
    connection.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Error inserting users:', err);
            return;
        }
        
        console.log(`Successfully inserted ${result.affectedRows} users into the database!`);
        console.log(`First inserted user ID: ${result.insertId}`);
        
        // Close the connection after seeding
        connection.end((err) => {
            if (err) {
                console.error('Error closing database connection:', err);
            } else {
                console.log('Database connection closed.');
            }
        });
    });
}

// Function to clear existing users (optional)
function clearUsers() {
    const sql = 'DELETE FROM users';
    
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error clearing users:', err);
            return;
        }
        
        console.log(`Cleared ${result.affectedRows} existing users from the database.`);
    });
}

// ============================================
// MAIN SEEDING PROCESS
// ============================================

async function main() {
    try {
        const numberOfUsers = 15; // Number of fake users to generate
        
        console.log(`Generating ${numberOfUsers} fake users...`);
        
        // Optional: Clear existing users before seeding
        // Uncomment the next line if you want to clear existing data
        // clearUsers();
        
        // Generate fake users
        const fakeUsers = generateFakeUsers(numberOfUsers);
        
        console.log('Sample of generated users:');
        fakeUsers.slice(0, 3).forEach((user, index) => {
            console.log(`${index + 1}. Name: ${user.name}, Email: ${user.email}`);
        });
        
        // Insert users into database
        console.log('\nInserting users into database...');
        seedUsers(fakeUsers);
        
    } catch (error) {
        console.error('Error during seeding process:', error);
        
        // Close connection on error
        connection.end((err) => {
            if (err) {
                console.error('Error closing database connection:', err);
            } else {
                console.log('Database connection closed.');
            }
        });
    }
}

// ============================================
// RUN THE SEEDER
// ============================================

// Check if this file is being run directly
if (require.main === module) {
    console.log('Starting database seeding process...');
    console.log('=====================================');
    main();
}

// Export functions for potential use in other files
module.exports = {
    generateFakeUsers,
    seedUsers,
    clearUsers
};
