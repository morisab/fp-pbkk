import pool from '../../../../lib/db';
import { runMiddleware } from '../../../../lib/cors'; // Import CORS middleware

export default async function handler(req, res) {
  // Run CORS middleware to allow the request
  await runMiddleware(req, res, () => {});

  const { id } = req.query; // Get the order ID from the query parameter

  // Handle only POST requests to process payment
  if (req.method === 'POST') {
    const { payment_method } = req.body;

    try {
      if (!payment_method) {
        return res.status(400).json({ message: 'Payment method is required' });
      }

      // Fetch the order to ensure it exists
      const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
      const order = orderRows[0];

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if the order is already paid
      if (order.status === 'paid') {
        return res.status(400).json({ message: 'Order has already been paid' });
      }

      // Insert payment into the payments table
      const [paymentResult] = await pool.query(
        'INSERT INTO payments (amount, payment_method, order_id) VALUES (?, ?, ?)',
        [order.total_amount, payment_method, id]
      );

      // Return success message with payment ID
      return res.status(201).json({ message: 'Payment created successfully', payment_id: paymentResult.insertId });
    } catch (error) {
      return res.status(500).json({ message: 'Database error', error });
    }
  } else {
    // If method is not POST, return method not allowed
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
