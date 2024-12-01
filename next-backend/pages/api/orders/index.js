import pool from '../../../lib/db';  // Database connection
import { verifyToken, verifyAdmin } from '../../../lib/auth';  // Authentication middleware
import { runMiddleware } from '../../../lib/cors';  // Import middleware CORS

// Create a new order or get all orders
export default async function handler(req, res) {
    // Menjalankan middleware CORS
    await runMiddleware(req, res, () => {});

    if (req.method === 'POST') {
        // Create a new order
        const { user_id, order_items } = req.body;

        // Validate input
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        if (!Array.isArray(order_items) || order_items.length === 0) {
            return res.status(400).json({ message: 'Order items are required' });
        }

        try {
            let totalAmount = 0;
            for (const item of order_items) {
                const [menuItemRows] = await pool.query('SELECT price FROM menu_items WHERE id = ?', [item.menu_id]);
                const menuItem = menuItemRows[0];
                if (!menuItem) {
                    return res.status(400).json({ message: `Menu item with id ${item.menu_id} not found` });
                }
                totalAmount += menuItem.price * item.quantity;
            }

            // Create order
            const [orderResult] = await pool.query(
                'INSERT INTO orders (user_id, total_amount, order_date, status) VALUES (?, ?, NOW(), ?)',
                [user_id, totalAmount, 'pending']
            );
            const orderId = orderResult.insertId;

            // Create order items
            for (const item of order_items) {
                await pool.query(
                    'INSERT INTO order_items (order_id, menu_id, quantity) VALUES (?, ?, ?)',
                    [orderId, item.menu_id, item.quantity]
                );
            }

            return res.status(201).json({ message: 'Order created successfully', order_id: orderId });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else if (req.method === 'GET') {
        // Get all orders (admin only)
        try {
            verifyToken(req); // Ensure the user is authenticated
            verifyAdmin(req); // Ensure the user is an admin
            const [orders] = await pool.query('SELECT * FROM orders');
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
