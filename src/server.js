require('dotenv').config();
const userRoutes = require('./routes/userRoutes')
const transactionRoutes = require('./routes/transactionRoutes');

const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'DB_PORT'];

requiredEnv.forEach(env => {
    if (!process.env[env]) {
        throw new Error(`${env} is not defined in the .env file`);
    }
});

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
console.log('Checking variables:', process.env.DB_HOST);

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

//Test Database Connection
async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('Database connected successfully!');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

testConnection();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});