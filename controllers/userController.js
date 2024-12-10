const users = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

//register
exports.registerController = async (req, res) => {
    try {
      const { username, email, password, phone, address } = req.body;
  
      // Check if all required fields are provided
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
      }
  
      // Check if the user already exists
      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered.' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new users({
        username,
        email,
        password: hashedPassword,
        phone,
        address,
      });
  
      await newUser.save();
  
      return res.status(201).json({ message: 'User registered successfully!', username: newUser.username  });
    } catch (err) {
      console.error('Error in registerController:', err.message);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };

//login
exports.loginController = async (req, res) => {
  console.log("Inside loginController");
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const existingUser = await users.findOne({email});
    console.log("Existing User:", existingUser);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the password matches the stored hash
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    console.log("Password Match Result:", isPasswordValid);
    console.log("Provided Password:", password);
    console.log("Stored Hashed Password:", existingUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Check user's role
    const userRole = existingUser.role;
    console.log(`User Role: ${userRole}`);

    if (userRole === 'admin') {
      console.log('Admin logged in.');
    } else if (userRole === 'customer') {
      console.log('Customer logged in.');
    } else {
      return res.status(403).json({ message: 'Access denied. Invalid role.' });
    }

    // Generate token
    if (!process.env.JWTPASSWORD) {
      return res.status(500).json({ message: 'JWT secret is not configured.' });
    }

    const token = jwt.sign({ userId: existingUser._id }, process.env.JWTPASSWORD);
    return res.status(200).json({
      message: 'Login successful.',
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      },
      token,
    });
  } catch (err) {
    console.error('Error in loginController:', err.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


  
  
 

