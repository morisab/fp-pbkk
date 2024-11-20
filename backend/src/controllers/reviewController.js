// ReviewController.js
const pool = require('../configs/database');

class ReviewController {
    // Create a new review for an order
    async store(req, res) {
        const { orderId } = req.params;
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
            const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
            const order = orderRows[0];

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Check if the order has already been reviewed
            const [reviewRows] = await pool.query('SELECT * FROM reviews WHERE order_id = ?', [orderId]);
            if (reviewRows.length > 0) {
                return res.status(400).json({ message: 'Order already reviewed.' });
            }

            // Create new review
            const [result] = await pool.query(
                'INSERT INTO reviews (rating, comment, order_id) VALUES (?, ?, ?)',
                [rating, comment, orderId]
            );

            const review = { id: result.insertId, rating, comment, order_id: orderId };
            return res.status(201).json(review);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Update a review for an order
    async update(req, res) {
        const { orderId } = req.params;
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
            const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
            const order = orderRows[0];

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Check if the order has been reviewed
            const [reviewRows] = await pool.query('SELECT * FROM reviews WHERE order_id = ?', [orderId]);
            const review = reviewRows[0];

            if (!review) {
                return res.status(400).json({ message: 'Order not reviewed yet.' });
            }

            // Update review
            await pool.query(
                'UPDATE reviews SET rating = ?, comment = ? WHERE order_id = ?',
                [rating, comment, orderId]
            );

            return res.json({ message: 'Review updated successfully!', review: { ...review, rating, comment } });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Delete a review for an order
    async destroy(req, res) {
        const { orderId } = req.params;

        try {
            // Check if the order exists
            const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
            const order = orderRows[0];

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Check if the order has been reviewed
            const [reviewRows] = await pool.query('SELECT * FROM reviews WHERE order_id = ?', [orderId]);
            const review = reviewRows[0];

            if (!review) {
                return res.status(400).json({ message: 'Order not reviewed yet.' });
            }

            // Delete review
            await pool.query('DELETE FROM reviews WHERE order_id = ?', [orderId]);

            return res.json({ message: 'Review deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Get a review for an order
    async show(req, res) {
        const { orderId } = req.params;

        try {
            // Check if the order exists
            const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
            const order = orderRows[0];

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Check if the order has been reviewed
            const [reviewRows] = await pool.query('SELECT * FROM reviews WHERE order_id = ?', [orderId]);
            const review = reviewRows[0];

            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }

            return res.json(review);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Get all reviews
    async index(req, res) {
        try {
            const [reviews] = await pool.query('SELECT * FROM reviews');
            return res.json(reviews);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }
}

module.exports = new ReviewController();
