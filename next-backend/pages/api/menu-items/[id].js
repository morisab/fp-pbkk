import pool from '../../../lib/db'; // Make sure to adjust this import path according to your project structure
import { verifyToken, verifyAdmin } from '../../../lib/auth'; // Assuming these are the middleware functions for token and admin check

// Handle GET, PUT, DELETE requests for a menu item by ID
export default async function handler(req, res) {
    const { id } = req.query; // Extract the 'id' from the query parameters

    if (req.method === 'GET') {
        // Handle GET request to fetch a menu item by ID
        try {
            const [rows] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id]);
            const menuItem = rows[0];

            if (!menuItem) {
                return res.status(404).json({ message: 'Menu item not found' });
            }

            return res.status(200).json(menuItem); // Return the menu item if found
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else if (req.method === 'PUT') {
        // Handle PUT request to update a menu item
        try {
            verifyToken(req); // Verify the user's token
            verifyAdmin(req); // Ensure the user is an admin

            const { name, price, description, category } = req.body;

            const [rows] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id]);
            const menuItem = rows[0];

            if (!menuItem) {
                return res.status(404).json({ message: 'Menu item not found' });
            }

            // Update only fields that are provided
            const updates = {};
            if (name) updates.name = name;
            if (price) updates.price = price;
            if (description) updates.description = description;
            if (category) updates.category = category;

            await pool.query('UPDATE menu_items SET ? WHERE id = ?', [updates, id]);

            return res.status(200).json({ message: 'Menu item updated successfully!', menu_item: { ...menuItem, ...updates } });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else if (req.method === 'DELETE') {
        // Handle DELETE request to remove a menu item
        try {
            verifyToken(req); // Verify the user's token
            verifyAdmin(req); // Ensure the user is an admin

            const [result] = await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Menu item not found' });
            }

            return res.status(200).json({ message: 'Menu item deleted successfully!' });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else {
        // Method Not Allowed for other HTTP methods
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
