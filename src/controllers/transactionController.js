const pool = require('../config/db');

exports.getTransactions = async (req, res) => {
    try {
        const userId = req.user.id;

        const { type } = req.query;

        let sql = 'SELECT * FROM transactions WHERE user_id = ?';
        const values = [userId];

        if (type) {
            sql += ' AND type = ?';
            values.push(type);
        }

        sql += ' ORDER BY date DESC';

        const [rows] = await pool.query(sql, values);
        res.json(rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error while fetching transactions.' });
    }
};


exports.createTransaction = async (req, res) => {
    const { description, amount, type, date } = req.body;
    const userId = req.user.id; 

    if (!description || !amount || !type) {
        return res.status(400).json({ error: 'Description, amount and type are required.' });
    }
    
    if (typeof amount !== 'number') {
        return res.status(400).json({ error: 'Amount must be a number.' });
    }

    if (type !== 'income' && type !== 'expense') {
        return res.status(400).json({ error: 'Type must be "income" or "expense".' });
    }

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


exports.deleteTransaction = async (req, res) => {
    try {

        const transactionId = req.params.id;
        const userId = req.user.id; 

        const [result] = await pool.query(
            'DELETE FROM transactions WHERE id = ? AND user_id = ?',
            [transactionId, userId]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Transaction not found or not authorized.' });
    }

    res.json({ message: 'Transaction deleted sucessfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error while deleting transaction.' });
    }
};



exports.updateTransaction = async (req, res) => {
    
    const transactionId = req.params.id;
    const userId = req.user.id;

    const { description, amount, type, date } = req.body;

    try {
        const [result] = await pool.query(
        'UPDATE transactions SET description = ?, amount = ?, type = ?, date = ? WHERE id = ? AND user_id = ?',
        [description, amount, type, date, transactionId, userId]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Transaction not found or not authorized.' });
    }

    res.json({ message: 'Transaction updated sucessfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error while updating transaction.' });
    }
};

exports.getBalance = async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await pool.query(
            `SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpense
             FROM transactions 
             WHERE user_id = ?`,
            [userId]
        );

        const totalIncome = Number(rows[0].totalIncome) || 0;
        const totalExpense = Number(rows[0].totalExpense) || 0;
        const balance = totalIncome - totalExpense;

        res.json({ totalIncome, totalExpense, balance });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error while calculating balance.' });
    }
};