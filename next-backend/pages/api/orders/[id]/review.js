import pool from '../../../../lib/db';
import { verifyToken, verifyAdmin } from '../../../../lib/auth';
import { runMiddleware } from '../../../../lib/cors';

// Handle review operations (POST, PUT, DELETE, GET)
export default async function handler(req, res) {
    // Menjalankan middleware CORS
    await runMiddleware(req, res, () => {});

    const { id } = req.query;

    if (req.method === 'POST') {
        // Create a new review for an order
        const { rating, comment } = req.body;

        // Validate input
        if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating' });
        }
        if (comment && (typeof comment !== 'string' || comment.length > 255)) {
            return res.status(400).json({ message: 'Invalid comment' });
        }

        try {
            // Check if the order exists
            const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
            const order = orderRows[0];

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Check if the order has already been reviewed
            const [reviewRows] = await pool.query('SELECT * FROM reviews WHERE order_id = ?', [id]);
            if (reviewRows.length > 0) {
                return res.status(400).json({ message: 'Order already reviewed.' });
            }

            // Create new review
            const [result] = await pool.query(
                'INSERT INTO reviews (rating, comment, order_id) VALUES (?, ?, ?)',
                [rating, comment, id]
            );

            const review = { id: result.insertId, rating, comment, order_id: id };
            return res.status(201).json(review);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else if (req.method === 'PUT') {
        // Update a review for an order
        const { rating, comment } = req.body;

        // Validate input
        if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating' });
        }
        if (comment && (typeof comment !== 'string' || comment.length > 255)) {
            return res.status(400).json({ message: 'Invalid comment' });
        }

        try {
            // Check if the order exists
            const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
            const order = orderRows[0];

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Check if the order has been reviewed
            const [reviewRows] = await pool.query('SELECT * FROM reviews WHERE order_id = ?', [id]);
            const review = reviewRows[0];

            if (!review) {
                return res.status(400).json({ message: 'Order not reviewed yet.' });
            }

            // Update review
            await pool.query(
                'UPDATE reviews SET rating = ?, comment = ? WHERE order_id = ?',
                [rating, comment, id]
            );

            return res.json({ message: 'Review updated successfully!', review: { ...review, rating, comment } });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else if (req.method === 'DELETE') {
        // Delete a review for an order
        try {
            const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
            const order = orderRows[0];

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const [reviewRows] = await pool.query('SELECT * FROM reviews WHERE order_id = ?', [id]);
            const review = reviewRows[0];

            if (!review) {
                return res.status(400).json({ message: 'Order not reviewed yet.' });
            }

            // Delete review
            await pool.query('DELETE FROM reviews WHERE order_id = ?', [id]);

            return res.json({ message: 'Review deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else if (req.method === 'GET') {
        // Get a review for an order
        try {
            const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
            const order = orderRows[0];

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const [reviewRows] = await pool.query('SELECT * FROM reviews WHERE order_id = ?', [id]);
            const review = reviewRows[0];

            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }

            return res.json(review);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
