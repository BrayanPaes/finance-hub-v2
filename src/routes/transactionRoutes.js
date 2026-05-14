const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, transactionController.getTransaction);

router.post('/', authMiddleware, transactionController.createTransaction);

router.get('/balance', authMiddleware, transactionController.getBalance);

router.delete('/:id', authMiddleware, transactionController.deleteTransaction);

router.put('/:id', authMiddleware, transactionController.updateTransaction);


module.exports = router;