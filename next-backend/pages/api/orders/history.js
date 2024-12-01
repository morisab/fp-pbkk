import pool from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';  // Assuming verifyToken middleware exists
import { runMiddleware } from '../../../lib/cors';  // Import the CORS middleware

export default async function handler(req, res) {
    // Menjalankan CORS middleware
    await runMiddleware(req, res, () => {});

    if (req.method === 'GET') {
        // Get order history for a user
        try {
            verifyToken(req); // Ensure the user is authenticated

            const userId = req.userId; // Assume the user ID is available after token verification

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

            const [reviews] = await pool.query('SELECT * FROM reviews WHERE order_id IN (?)', [orders.map(order => order.order_id)]);

            const result = orders.map(order => {
                const items = orderItems.filter(item => item.order_id === order.order_id);
                const orderDetails = items.map(item => ({
                    menu_names: item.menu_name,
                    quantity: item.quantity,
                    price: item.price
                }));

                const review = reviews.find(r => r.order_id === order.order_id);
                return {
                    order_id: order.order_id,
                    total_amount: order.total_amount,
                    order_date: order.order_date,
                    status: order.status,
                    payment_method: order.payment_method,
                    order: orderDetails,
                    review: review ? { rating: review.rating } : null
                };
            });

            return res.json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
