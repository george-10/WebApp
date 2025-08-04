const {
    getAllAccounts,
    createAccount,
    getAccountById,
    deleteAccount,
    updateAccount
} = require('../services/account'); // Adjust path if necessary

// Get all accounts for  user
exports.getAccounts = async (req, res) => {
    try {
        const userId = req.userId;
        const accounts = await getAllAccounts(userId);
        res.status(200).json(accounts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
};

// Create a new account
exports.createAccount = async (req, res) => {
    const { name, type, balance = 0 } = req.body;
    const userId = req.userId;

    try {
        const account = await createAccount(name, type, balance, userId);
        res.status(201).json(account);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create account' });
    }
};

// Get a single account by ID
exports.getAccount = async (req, res) => {
    const { id } = req.params;

    try {
        const account = await getAccountById(id);
        if (!account || account.userId !== req.userId) {
            return res.status(404).json({ error: 'Account not found or unauthorized' });
        }

        res.status(200).json(account);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get account' });
    }
};

// Delete account by ID
exports.deleteAccount = async (req, res) => {
    const { id } = req.params;

    try {
        const account = await getAccountById(id);

        if (!account || account.userId !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized or account not found' });
        }

        const deleted = await deleteAccount(id);
        res.status(200).json({ message: 'Account deleted', account: deleted });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete account' });
    }
};

// Update account
exports.updateAccount = async (req, res) => {
    const { id } = req.params;
    const { name, type, balance } = req.body;

    try {
        const account = await getAccountById(id);

        if (!account || account.userId !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized or account not found' });
        }

        const updated = await updateAccount(id, type, name, balance);
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update account' });
    }
};
