const pool = require('../config/db');

exports.getTransaction = async (req, res) => {
    try {
        const userId = req.user.id;

        res.json({ message: `Access granted! This is the protected area for user ID:` })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

exports.createTransaction = async (req, res) => {
    const { description, amount, type, date } = req.body;
    const userId = req.user.id; 

    const transactionDate = date || new Date();

    try {

        const [result] = await pool.query(
            'INSERT INTO transactions (user_id, description, amount, type, date) VALUES (?, ?, ?, ?, ?)',
            [userId, description, amount, type, transactionDate]
        );

        res.status(201).json({
            id: result.insertId,
            user_id: userId,
            description,
            amount,
            type,
            date: transactionDate
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error while creating transaction.' });
    }
};