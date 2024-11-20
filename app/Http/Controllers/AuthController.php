const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Adjust the path to your database config
require('dotenv').config();

// Handle user registration
exports.register = async (req, res) => {
    const { name, email, password, password_confirmation } = req.body;

    // Basic validation
    if (!name || !email || !password || !password_confirmation) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== password_confirmation) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
            name,
            email,
            hashedPassword,
        ]);

        const user = { id: result.insertId, name, email };
        return res.status(201).json({ message: 'User registered successfully!', user });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: 'Database error', error });
    }
};

// Handle user login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'The provided credentials are incorrect.' });
        }

        const token = jwt.sign({ id: user.id, isAdmin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({ token, userId: user.id, name: user.name, isAdmin: user.is_admin });
    } catch (error) {
        return res.status(500).json({ message: 'Database error', error });
    }
};

// Handle user logout
exports.logout = (req, res) => {
    // In a stateless JWT setup, logging out can be done by simply removing the token on the client-side
    return res.json({ message: 'Logged out successfully!' });
};
