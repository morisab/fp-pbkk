const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'hasu';

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.userId = decoded.userId;
        next();
    });
};
