const user = require('../models/userModel');
const bcrypt = require('bcrypt');
require('dotenv').config(); // Ensure to load environment variables

async function createAdmin() {
    try {
        // Check if admin already exists
        const existingAdmin = await user.findOne({ email: process.env.ADMIN_EMAIL });

        if (!existingAdmin) {
            // Hash the password with bcrypt
            const hashedPassword =  bcrypt.hash(process.env.ADMIN_PASSWORD, 10); // Use await here

            // Create a new admin account with values from environment variables
            const newAdmin = new user({
                username: process.env.ADMIN_USERNAME || 'Admin', // Use env var if available
                email: process.env.ADMIN_EMAIL, // Admin email from .env
                password: hashedPassword, // Use the correctly hashed password
                role: 'admin', // Explicitly set role to 'admin'
            });

            // Save new admin to the database
            await newAdmin.save();
            console.log('Admin account created successfully!');
        } else {
            console.log('Admin already exists!');
        }
    } catch (err) {
        console.error('Error creating admin:', err);
    }
}

module.exports = createAdmin;
