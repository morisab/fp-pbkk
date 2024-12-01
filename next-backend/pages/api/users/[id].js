import pool from '../../../lib/db';  // Database connection
import { verifyToken, verifyAdmin } from '../../../lib/auth';  // Authentication middleware
import { runMiddleware } from '../../../lib/cors';  // Import middleware CORS

// Handle user operations (GET, PUT, DELETE)
export default async function handler(req, res) {
    // Menjalankan middleware CORS
    await runMiddleware(req, res, () => {});

    const { id } = req.query;

    if (req.method === 'GET') {
        // Get a user by ID
        try {
            verifyToken(req); // Ensure the user is authenticated
            verifyAdmin(req); // Ensure the user is an admin
            const [rows] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [id]);
            const user = rows[0];

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else if (req.method === 'PUT') {
        // Update a user
        const { name, email, password } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        try {
            verifyToken(req); // Ensure the user is authenticated
            verifyAdmin(req); // Ensure the user is an admin
            const updates = [name, email, id];

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                updates.push(hashedPassword);
                await pool.query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [...updates]);
            } else {
                await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', updates);
            }

            return res.json({ message: 'User updated successfully!' });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else if (req.method === 'DELETE') {
        // Delete a user
        try {
            verifyToken(req); // Ensure the user is authenticated
            verifyAdmin(req); // Ensure the user is an admin
            const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.json({ message: 'User deleted successfully!' });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
