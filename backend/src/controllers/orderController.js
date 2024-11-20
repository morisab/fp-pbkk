const pool = require('../configs/database');

class OrderController {
    // Create a new order
    async createOrder(req, res) {
        const { user_id, order_items } = req.body;

        // Validate input
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        if (!Array.isArray(order_items) || order_items.length === 0) {
            return res.status(400).json({ message: 'Order items are required' });
        }

        try {
            // Calculate total amount
            let totalAmount = 0;
            for (const item of order_items) {
                const [menuItemRows] = await pool.query('SELECT price FROM menu_items WHERE id = ?', [item.menu_id]);
                const menuItem = menuItemRows[0];
                if (!menuItem) {
                    return res.status(400).json({ message: `Menu item with id ${item.menu_id} not found` });
                }
                totalAmount += menuItem.price * item.quantity;
            }

            // Log the calculated totalAmount to ensure it's correct
            console.log("Total Amount calculated:", totalAmount);

            // Create order with status "pending"
            const [orderResult] = await pool.query(
                'INSERT INTO orders (user_id, total_amount, order_date, status) VALUES (?, ?, NOW(), ?)',
                [user_id, totalAmount, 'pending'] // Ensure status is always "pending"
            );

            const orderId = orderResult.insertId;

            // Log the orderId to ensure the order is created
            console.log("Order created with ID:", orderId);

            // Create order items
            for (const item of order_items) {
                await pool.query(
                    'INSERT INTO order_items (order_id, menu_id, quantity) VALUES (?, ?, ?)',
                    [orderId, item.menu_id, item.quantity]
                );
            }

            // Return success response
            return res.status(201).json({ message: 'Order created successfully', order_id: orderId });
        } catch (error) {
            console.error("Error creating order:", error);  // Log the error for easier debugging
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Confirm an order
    async confirmOrder(req, res) {
        const { id } = req.params;
        const { employee_id } = req.body;

        // Check if user is admin
        if (!req.user.is_admin) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        try {
            // Mark order as paid and assign employee who confirmed the order
            await pool.query('UPDATE orders SET employee_id = ?, status = ? WHERE id = ?', [employee_id, 'paid', id]);

            // Update loyalty points
            const [orderRows] = await pool.query('SELECT user_id, total_amount FROM orders WHERE id = ?', [id]);
            const order = orderRows[0];

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const userId = order.user_id;
            const totalAmount = order.total_amount;

            // Fetch loyalty program points for the user
            const [loyaltyRows] = await pool.query('SELECT points FROM loyalty_programs WHERE user_id = ?', [userId]);
            const loyaltyProgram = loyaltyRows[0];
            if (loyaltyProgram) {
                const newPoints = loyaltyProgram.points + Math.floor(totalAmount / 1000);
                await pool.query('UPDATE loyalty_programs SET points = ? WHERE user_id = ?', [newPoints, userId]);
                console.log(`Updated loyalty points for user ${userId}: ${newPoints}`);
            }

            return res.json({ message: 'Order confirmed' });
        } catch (error) {
            console.error("Error confirming order:", error);
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Create a payment
    async createPayment(req, res) {
        const { id } = req.params;
        const { payment_method } = req.body;

        // Validate input
        if (!payment_method) {
            return res.status(400).json({ message: 'Payment method is required' });
        }

        try {
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
    }

    // Create a review
    async createReview(req, res) {
        const { id } = req.params;
        const { rating, comment } = req.body;

        // Validate input
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating' });
        }

        try {
            await pool.query('INSERT INTO reviews (order_id, rating, comment) VALUES (?, ?, ?)', [id, rating, comment]);
            return res.status(201).json({ message: 'Review created successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Get order history
    async getOrderHistory(req, res) {
        const userId = req.userId;

        try {
            // Ambil data pesanan utama
            const [orders] = await pool.query(`
                SELECT 
                    o.id AS order_id, 
                    o.total_amount, 
                    o.order_date, 
                    o.status, 
                    p.payment_method
                FROM orders o
                LEFT JOIN payments p ON o.id = p.order_id
                WHERE o.user_id = ?
                ORDER BY o.order_date DESC
            `, [userId]);

            // Ambil detail item pesanan untuk setiap order_id
            const [orderItems] = await pool.query(`
                SELECT 
                    oi.order_id,
                    m.name AS menu_name,
                    oi.quantity,
                    m.price
                FROM order_items oi
                LEFT JOIN menu_items m ON oi.menu_id = m.id
                WHERE oi.order_id IN (?);
            `, [orders.map(order => order.order_id)]);

            // Ambil review untuk setiap order
            const [reviews] = await pool.query('SELECT * FROM reviews WHERE order_id IN (?)', [orders.map(order => order.order_id)]);

            const reviewedOrderIds = reviews.map(review => review.order_id);

            // Strukturkan hasil sehingga setiap pesanan memiliki array item dalam 'order'
            const result = orders.map(order => {
                // Filter item yang sesuai dengan order_id
                const items = orderItems.filter(item => item.order_id === order.order_id);

                // Map item menjadi format yang diinginkan
                const orderDetails = items.map(item => ({
                    menu_names: item.menu_name,
                    quantity: item.quantity,
                    price: item.price
                }));

                // Temukan review jika ada
                const review = reviews.find(r => r.order_id === order.order_id);
                const isReviewed = reviewedOrderIds.includes(order.order_id) ? 1 : 0;

                return {
                    order_id: order.order_id,
                    total_amount: order.total_amount,
                    order_date: order.order_date,
                    status: order.status,
                    payment_method: order.payment_method,
                    order: orderDetails,
                    review: isReviewed ? { rating: review ? review.rating : null } : null // Include rating if reviewed
                };
            });

            return res.json(result);

        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Get all orders
    async index(req, res) {
        try {
            const [orders] = await pool.query('SELECT * FROM orders');
            return res.json(orders);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Get a specific order by ID
    async show(req, res) {
        const { id } = req.params;

        try {
            const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
            const order = rows[0];

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            return res.json(order);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Delete an order
    async destroy(req, res) {
        const { id } = req.params;

        try {
            const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
            const order = orderRows[0];

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            await pool.query('DELETE FROM orders WHERE id = ?', [id]);
            return res.json({ message: 'Order deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }
}

module.exports = new OrderController();
