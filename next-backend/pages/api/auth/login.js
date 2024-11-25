import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../../lib/db';

const secret = process.env.JWT_SECRET || 'hasu'; // Pastikan menggunakan secret yang aman

export default async function handler(req, res) {
    if (req.method === 'POST') {
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
            return res.json({
                message: 'Login successful!',
                token,
                userID: user.id,
                isAdmin: user.is_admin,
                name: user.name
            });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
}
