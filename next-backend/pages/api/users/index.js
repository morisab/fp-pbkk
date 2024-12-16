import pool from '../../../lib/db';  // Database connection
import { verifyToken, verifyAdmin } from '../../../lib/auth';  // Authentication middleware
import { runMiddleware } from '../../../lib/cors';  // Import middleware CORS
import bcrypt from 'bcrypt'; // To hash the password

// Handle user operations (GET, POST)
export default async function handler(req, res) {
    // Menjalankan middleware CORS
    await runMiddleware(req, res, () => { });

    // Handle GET request to fetch all users
    if (req.method === 'GET') {
        try {
            verifyToken(req); // Make sure the user is authenticated
            verifyAdmin(req); // Ensure the user is an admin
            const [users] = await pool.query('SELECT id, name, email FROM users');
            return res.json(users);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Handle POST request to add a new user
    if (req.method === 'POST') {
        try {
            verifyToken(req); // Make sure the user is authenticated
            verifyAdmin(req); // Ensure the user is an admin

            const { name, email, password, password_confirmation } = req.body;

            // Validate input data
            if (!name || !email || !password || !password_confirmation) {
                return res.status(400).json({ message: 'All fields are required.' });
            }

            if (password !== password_confirmation) {
                return res.status(400).json({ message: 'Passwords do not match.' });
            }

            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user into the database
            const [result] = await pool.query(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword]
            );

            // Respond with the newly created user
            return res.status(201).json({
                id: result.insertId,
                name,
                email,
            });
        } catch (error) {
            console.error('Error adding user:', error);
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // If method is not GET or POST, return Method Not Allowed
    return res.status(405).json({ message: 'Method Not Allowed' });
}
