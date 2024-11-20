const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../configs/database'); // Sesuaikan path jika berbeda
const secret = process.env.JWT_SECRET || 'hasu'; // Ganti dengan secret yang lebih aman

class AuthController {
    // Register
    static async register(req, res) {
        const { name, email, password, confirmPassword } = req.body;

        // Validasi input
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validasi password dan confirm password
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await pool.query(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword]
            );

            return res.status(201).json({ message: 'User registered successfully!' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Email already exists' });
            }
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Login
    static async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            const user = rows[0];

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
            return res.json({ message: 'Login successful!', token, userID: user.id, isAdmin: user.is_admin, name: user.name });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    }

    // Logout
    static logout(req, res) {
        // Di sisi frontend, cukup hapus token dari penyimpanan lokal atau cookie
        return res.json({ message: 'Logout successful!' });
    }
}

module.exports = AuthController;
