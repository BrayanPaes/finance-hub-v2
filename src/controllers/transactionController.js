const pool = require('../config/db');

exports.getTransaction = async (req, res) => {
    try {
        const userId = req.user.id;

        res.json({ message: `Access granted! This is the protected area for user ID:` })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};