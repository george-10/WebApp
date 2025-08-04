const {
    getCategories,
    addCategory,
    deleteCategory,
    getCategory
} = require('../services/categories');
const {getAccountById} = require("../services/account"); // Adjust path as needed

// Get all categories for a specific account
exports.getCategoriesByAccount = async (req, res) => {
    const { accountId } = req.params;

    try {
        const account = await getAccountById(accountId);
        if (!account || account.userId !== req.userId) {
            return res.status(404).json({ error: 'Account not found or unauthorized' });
        }
        const categories = await getCategories(accountId);
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

// Add a new category
exports.createCategory = async (req, res) => {
    const { name, type, accountId } = req.body;
    console.log("accountId:", accountId, "name:", name, "type:", type);
    try {
        const account = await getAccountById(accountId);
        if (!account || account.userId !== req.userId) {
            return res.status(403).json({ error: 'Account not found or unauthorized' });
        }
        const category = await addCategory(name, type, accountId);
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create category' });
    }
};

// Delete a category
exports.removeCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const cate = await getCategory(id);
        if (!cate) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const account = await getAccountById(cate.accountId);
        if (!account || account.userId !== req.userId) {
            return res.status(404).json({ error: 'Account not found or unauthorized' });
        }
        const category = await deleteCategory( id );
        res.status(200).json({ message: 'Category deleted', category });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
