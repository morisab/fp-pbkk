import pool from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';
import { runMiddleware } from '../../../lib/cors';

export default async function handler(req, res) {
    try {
        // Jalankan middleware CORS
        await runMiddleware(req, res, () => { });

        // Periksa metode request
        if (req.method !== 'GET') {
            return res.status(405).json({ message: 'Method Not Allowed' });
        }

        // Verifikasi token dan dapatkan userId
        const decoded = verifyToken(req);
        const userId = decoded.userId;

        // Periksa jika userId tidak ditemukan
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User ID not found' });
        }

        // Query untuk mendapatkan pesanan pengguna
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

        // Jika tidak ada pesanan, kembalikan array kosong
        if (orders.length === 0) {
            return res.json([]);
        }

        // Ambil semua order_id dari hasil pesanan
        const orderIds = orders.map(order => order.order_id);

        // Query untuk mendapatkan detail item pesanan
        const [orderItems] = await pool.query(`
            SELECT 
                oi.order_id,
                m.name AS menu_name,
                oi.quantity,
                m.price
            FROM order_items oi
            LEFT JOIN menu_items m ON oi.menu_id = m.id
            WHERE oi.order_id IN (?);
        `, [orderIds]);

        // Query untuk mendapatkan ulasan pesanan
        const [reviews] = await pool.query(`
            SELECT 
                order_id, 
                rating 
            FROM reviews 
            WHERE order_id IN (?);
        `, [orderIds]);

        // Gabungkan hasil menjadi satu array
        const result = orders.map(order => {
            const items = orderItems.filter(item => item.order_id === order.order_id);
            const orderDetails = items.map(item => ({
                menu_name: item.menu_name,
                quantity: item.quantity,
                price: item.price,
            }));

            const review = reviews.find(r => r.order_id === order.order_id);
            return {
                order_id: order.order_id,
                total_amount: order.total_amount,
                order_date: order.order_date,
                status: order.status,
                payment_method: order.payment_method,
                items: orderDetails,
                review: review ? { rating: review.rating } : null,
            };
        });

        // Kembalikan hasil
        return res.json(result);
    } catch (error) {
        console.error('Error in handler:', error.message);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
