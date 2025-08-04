const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const categoryController = require('../controllers/categoriesController');

router.use(authMiddleware);

/**
 * @swagger
 * /category/account/{accountId}:
 *   get:
 *     summary: Get all categories for a specific account
 *     tags: [Categories]
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
 *         description: List of categories
 *       500:
 *         description: Server error
 */
router.get('/account/:accountId', categoryController.getCategoriesByAccount);

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - accountId
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 example: income
 *               accountId:
 *                 type: int
 *                 example: 1
 *     responses:
 *       201:
 *         description: Category created
 *       500:
 *         description: Failed to create category
 */
router.post('/', categoryController.createCategory);

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
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
 *         description: Category deleted
 *       500:
 *         description: Failed to delete category
 */
router.delete('/:id', categoryController.removeCategory);

module.exports = router;
