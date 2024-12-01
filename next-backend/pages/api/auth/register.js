import bcrypt from 'bcrypt';
import pool from '../../../lib/db';
import { runMiddleware } from '@/lib/cors';

export default async function handler(req, res) {
    await runMiddleware(req, res, () => {});

    if (req.method === 'POST') {
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
            await pool.query(
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
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
}
