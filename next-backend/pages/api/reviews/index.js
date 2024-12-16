import pool from '../../../lib/db';  // Database connection
; // Pool koneksi ke database
import { verifyToken, verifyAdmin } from '../../../lib/auth';  // Authentication middleware
import { runMiddleware } from '../../../lib/cors';  // Import middleware CORS

export default async function handler(req, res) {
    await runMiddleware(req, res, () => { });
    if (req.method === 'GET') {
        try {
            verifyToken(req); // Make sure the user is authenticated
            verifyAdmin(req); // Ensure the user is an admin
            // Query ke database untuk mendapatkan semua order
            const [orders] = await pool.query(
                'SELECT id, rating, comment, order_id FROM reviews'
            );

            if (orders.length === 0) {
                return res.status(404).json({ message: 'No revies found.' });
            }

            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching revies', error });
        }
    }

    // Jika metode HTTP selain GET
    return res.status(405).json({ message: 'Method Not Allowed' });
}
