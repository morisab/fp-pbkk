import jwt from 'jsonwebtoken';
import pool from './db';

const secret = process.env.JWT_SECRET || 'hasu';

export function verifyToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Access token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

export async function verifyAdmin(req) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        throw new Error('Access token is missing');
    }

    try {
        const decoded = jwt.verify(token, secret);

        const [rows] = await pool.query('SELECT is_admin FROM users WHERE id = ?', [decoded.userId]);
        const user = rows[0];

        if (!user || user.is_admin !== 1) {
            throw new Error('Access denied. Admins only');
        }

        return { id: decoded.userId, isAdmin: user.is_admin };
    } catch (error) {
        throw new Error('Invalid token');
    }
}