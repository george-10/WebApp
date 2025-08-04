const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

/**
 * @swagger
 * /transactions/account/{accountId}:
 *   get:
 *     summary: Get all transactions for an account
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of transactions
 *       500:
 *         description: Server error
 */
router.get('/account/:accountId', transactionController.getTransactions);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountId
 *               - categoryId
 *               - amount
 *               - type
 *               - description
 *               - date
 *             properties:
 *               accountId:
 *                 type: number
 *                 example: 1
 *               categoryId:
 *                 type: number
 *                 example: 1
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [expense, income]
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Transaction created
 *       400:
 *         description: Validation or balance error
 *       500:
 *         description: Server error
 */
router.post('/', transactionController.createTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction found
 *       500:
 *         description: Server error
 */
router.get('/:id', transactionController.getTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete a transaction and rollback account balance
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted and balance updated
 *       500:
 *         description: Server error
 */
router.delete('/:id', transactionController.removeTransaction);

module.exports = router;
