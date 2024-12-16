import { verifyToken, verifyAdmin } from '../../../../lib/auth';
import pool from '../../../../lib/db';
import { runMiddleware } from '../../../../lib/cors';

export default async function handler(req, res) {
  // Run CORS middleware
  await runMiddleware(req, res);

  const { id } = req.query;

  // Log the incoming request body and headers
  console.log('Request Body:', req.body);  // Log the body (should contain employee_id)
  console.log('Authorization Header:', req.headers.authorization); // Log the authorization header

  // Check for valid method
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Ensure token is valid
    const decoded = verifyToken(req);
    console.log('Decoded Token:', decoded);

    // Check for employee_id in the request body
    const { employee_id } = req.body;
    if (!employee_id) {
      console.error('Missing employee_id in request body');
      return res.status(400).json({ message: 'Employee ID is required' });
    }

    // Get the order from the database
    const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orderRows.length === 0) {
      console.error(`Order with ID ${id} not found`);
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderRows[0];

    // Check if the order status is "pending"
    if (order.status !== 'pending') {
      console.error(`Order with ID ${id} is not pending, current status: ${order.status}`);
      return res.status(400).json({ message: 'Order cannot be confirmed' });
    }

    // Confirm the order and update status to "paid"
    await pool.query('UPDATE orders SET status = "paid", employee_id = ? WHERE id = ?', [employee_id, id]);
    const [loyaltyRows] = await pool.query('SELECT points FROM loyalty_programs WHERE user_id = ?', [user_id]);
    const loyaltyProgram = loyaltyRows[0];
    if (loyaltyProgram) {
      const newPoints = loyaltyProgram.points + Math.floor(total_amount / 1000);
      await pool.query('UPDATE loyalty_programs SET points = ? WHERE user_id = ?', [newPoints, user_id]);
    }
    // Return a success message
    console.log(`Order ID ${id} confirmed by employee ${employee_id} and status updated to 'paid'`);
    res.status(200).json({ message: `Order ID ${id} confirmed successfully and marked as 'paid'` });

  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
