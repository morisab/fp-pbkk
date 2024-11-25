import pool from '../../../lib/db';  // Database connection
import { verifyToken, verifyAdmin } from '../../../lib/auth';  // Authentication middleware

// Handle user operations (GET)
export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Get all users
        try {
            verifyToken(req); // Make sure the user is authenticated
            verifyAdmin(req); // Ensure the user is an admin
            const [users] = await pool.query('SELECT id, name, email FROM users');
            return res.json(users);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
