import pool from '../../../lib/db';
import { verifyToken, verifyAdmin } from '../../../lib/auth'; // Assuming you have these middleware functions

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Get all menu items
        try {
            verifyToken(req);
            verifyAdmin(req);
            const [rows] = await pool.query('SELECT * FROM menu_items');
            return res.status(200).json(rows);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    else if (req.method === 'POST') {
        try {
            verifyToken(req);
            verifyAdmin(req);

            const { name, price, description, category } = req.body;

            if (!name || typeof name !== 'string' || name.length > 255) {
                return res.status(400).json({ message: 'Invalid name' });
            }
            if (typeof price !== 'number') {
                return res.status(400).json({ message: 'Invalid price' });
            }
            if (description && (typeof description !== 'string' || description.length > 1000)) {
                return res.status(400).json({ message: 'Invalid description' });
            }
            if (category && (typeof category !== 'string' || category.length > 255)) {
                return res.status(400).json({ message: 'Invalid category' });
            }

            const [result] = await pool.query(
                'INSERT INTO menu_items (name, price, description, category) VALUES (?, ?, ?, ?)',
                [name, price, description, category]
            );

            const menuItem = { id: result.insertId, name, price, description, category };
            return res.status(201).json({ message: 'Menu item created successfully!', menu_item: menuItem });
        } catch (error) {
            return res.status(403).json({ message: error.message });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
