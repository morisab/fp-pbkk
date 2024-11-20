// MenuController.js
const pool = require('../configs/database');

class MenuController {
    // Get all menu items
    async index(req, res) {
        try {
            const [menuItems] = await pool.query('SELECT * FROM menu_items');
            return res.json(menuItems);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Get a menu item by ID
    async show(req, res) {
        const { id } = req.params;

        try {
            const [rows] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id]);
            const menuItem = rows[0];

            if (!menuItem) {
                return res.status(404).json({ message: 'Menu item not found' });
            }

            return res.json(menuItem);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Create a new menu item
    async store(req, res) {
        const { name, price, description, category } = req.body;

        // Validate input
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

        try {
            const [result] = await pool.query(
                'INSERT INTO menu_items (name, price, description, category) VALUES (?, ?, ?, ?)',
                [name, price, description, category]
            );

            const menuItem = { id: result.insertId, name, price, description, category };
            return res.status(201).json({ message: 'Menu item created successfully!', menu_item: menuItem });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Update a menu item
    async update(req, res) {
        const { id } = req.params;
        const { name, price, description, category } = req.body;

        try {
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

            return res.json({ message: 'Menu item updated successfully!', menu_item: { ...menuItem, ...updates } });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Delete a menu item
    async destroy(req, res) {
        const { id } = req.params;

        try {
            const [result] = await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Menu item not found' });
            }

            return res.json({ message: 'Menu item deleted successfully!' });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }
}

module.exports = new MenuController();
