// UserController.js
const bcrypt = require('bcrypt');
const pool = require('../configs/database'); // Sesuaikan path ke konfigurasi database

class UserController {
    // Create a new user
    async createUser(req, res) {
        const { name, email, password } = req.body;

        // Validasi dasar
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const [result] = await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
                name,
                email,
                hashedPassword,
            ]);

            const user = { id: result.insertId, name, email };
            return res.status(201).json({ message: 'User created successfully!', user });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Email already exists' });
            }
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Get all users
    async getAllUsers(req, res) {
        try {
            const [users] = await pool.query('SELECT id, name, email FROM users');
            return res.json(users);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Get a user by ID
    async getUserById(req, res) {
        const { id } = req.params;

        try {
            const [rows] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [id]);
            const user = rows[0];

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Update a user
    async updateUser(req, res) {
        const { id } = req.params;
        const { name, email, password } = req.body;

        // Validasi dasar
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        try {
            const updates = [name, email, id];

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                updates.push(hashedPassword);
                await pool.query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [...updates]);
            } else {
                await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', updates);
            }

            return res.json({ message: 'User updated successfully!' });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Delete a user
    async deleteUser(req, res) {
        const { id } = req.params;

        try {
            const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.json({ message: 'User deleted successfully!' });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }
}

module.exports = new UserController();
