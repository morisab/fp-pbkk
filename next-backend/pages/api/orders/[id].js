import pool from '../../../lib/db';
import { verifyToken, verifyAdmin } from '../../../lib/auth';

export default async function handler(req, res) {
    const { id } = req.query; // Get the order ID from the query parameter

    if (req.method === 'GET') {
        // Get a specific order by ID
        try {
            const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
            const order = rows[0];

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            return res.status(200).json(order);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else if (req.method === 'PATCH') {
        // Confirm an order (admin only)
        try {
            verifyToken(req);
            verifyAdmin(req);
            const { employee_id } = req.body;

            await pool.query('UPDATE orders SET employee_id = ?, status = ? WHERE id = ?', [employee_id, 'paid', id]);

            const [orderRows] = await pool.query('SELECT user_id, total_amount FROM orders WHERE id = ?', [id]);
            const order = orderRows[0];

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const { user_id, total_amount } = order;

            const [loyaltyRows] = await pool.query('SELECT points FROM loyalty_programs WHERE user_id = ?', [user_id]);
            const loyaltyProgram = loyaltyRows[0];
            if (loyaltyProgram) {
                const newPoints = loyaltyProgram.points + Math.floor(total_amount / 1000);
                await pool.query('UPDATE loyalty_programs SET points = ? WHERE user_id = ?', [newPoints, user_id]);
            }

            return res.status(200).json({ message: 'Order confirmed' });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else if (req.method === 'POST') {
        const { payment_method } = req.body;

        // Create payment for the order
        try {
            if (!payment_method) {
                return res.status(400).json({ message: 'Payment method is required' });
            }

            const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
            const order = orderRows[0];

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            if (order.status === 'paid') {
                return res.status(400).json({ message: 'Order has already been paid' });
            }

            const [paymentResult] = await pool.query(
                'INSERT INTO payments (amount, payment_method, order_id) VALUES (?, ?, ?)',
                [order.total_amount, payment_method, id]
            );

            return res.status(201).json({ message: 'Payment created successfully', payment_id: paymentResult.insertId });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else if (req.method === 'DELETE') {
        // Delete an order (admin only)
        try {
            verifyToken(req);
            verifyAdmin(req);

            const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
            const order = orderRows[0];

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            await pool.query('DELETE FROM orders WHERE id = ?', [id]);
            return res.status(200).json({ message: 'Order deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
