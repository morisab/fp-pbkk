const jwt = require('jsonwebtoken');
const pool = require('../configs/database');
const secret = process.env.JWT_SECRET || 'hasu';

const adminMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        const [rows] = await pool.query('SELECT is_admin FROM users WHERE id = ?', [decoded.userId]);
        const user = rows[0];

        if (!user || user.is_admin !== 1) {
            return res.status(403).json({ message: 'Access denied. Admins only' });
        }

        // Pass user info to request if needed in further middleware/routes
        req.user = { id: decoded.userId, is_admin: user.is_admin };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token', error });
    }
};

module.exports = adminMiddleware;
