const { getAccountById } = require('../services/account');
const { getCategory } = require('../services/categories');
const {
  getAllTransactions,
  addTransaction,
  getTransactionById,
  deleteTransaction
} = require('../services/transactions'); 

// Get all transactions for a specific account
exports.getTransactions = async (req, res) => {
  const { accountId } = req.params;
  try {
    const account = await getAccountById(accountId);
    if (!account || account.userId !== req.userId) {
      return res.status(404).json({ error: 'Account not found or unauthorized' });
    }
    const transactions = await getAllTransactions(accountId);
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Add a new transaction
exports.createTransaction = async (req, res) => {
  const { accountId, categoryId, amount, type, description, date } = req.body;
  const userId = req.userId;

  const account = await getAccountById(accountId);
    if (!account || account.userId !== userId) {
        return res.status(403).json({ error: 'Account not found or unauthorized' });
    }
    const category = await getCategory(categoryId);
    if (!category || category.accountId !== accountId) {
        return res.status(404).json({ error: 'Category not found or does not belong to this account' });    
    }
  try {
    const transaction = await addTransaction(accountId, userId, categoryId, amount, type, description, date);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a single transaction by ID
exports.getTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await getTransactionById(id,parseInt(req.userId));
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get transaction' });
  }
};

// Delete a transaction
exports.removeTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await deleteTransaction(id,parseInt(req.userId));
    res.status(200).json({ message: 'Transaction deleted', transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
