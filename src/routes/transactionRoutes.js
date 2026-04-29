const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, transactionController.getTransaction);

router.post('/', authMiddleware, transactionController.createTransaction);

module.exports = router;