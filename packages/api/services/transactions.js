const {PrismaClient}= require("../generated/prisma/client");
const { getAccountById, updateAccount } = require("./account");
const prisma = new PrismaClient();

async function getAllTransactions(accountId) {
    try {
        console.log("Fetching transactions for accountId:", accountId);
        const transactions = await prisma.transaction.findMany({
            where: {
                accountId: parseInt(accountId)
            }
        });
        return transactions;
    } catch (err) {
        console.error("Error fetching transactions:", err);
        throw new Error(err);
    }
}

async function addTransaction(accountId,userId,categoryId,amount,type,description,transactionDate) {
    try {
        const account = await getAccountById(accountId);
        const amountInt = parseInt(amount);
        var a;
        if(type=== 'expense') {
            if (account.balance < amountInt) {
                throw new Error("Insufficient balance for this expense");
            }else if (amountInt <= 0) {
                throw new Error("Amount must be greater than zero for expenses");
            }
            a = -amountInt;
        }else if(type === 'income') {
            if (amountInt <= 0) {
                throw new Error("Amount must be greater than zero for income");
            }
            a = amountInt;
        } else {
            throw new Error("Invalid transaction type");
        }
        const newBalance = parseFloat(account.balance) + parseFloat(a);
        await updateAccount(accountId, account.type, account.name, newBalance );
        const transaction = await prisma.transaction.create({
            data: {
                accountId: parseInt(accountId),
                userId: parseInt(userId),
                categoryId: parseInt(categoryId),
                amount: parseInt(amount),
                type,
                description,
                transactionDate: new Date(transactionDate)
            }
        });


        return transaction;
    } catch (err) {
        console.error("Error creating transaction:", err);
        throw new Error(err);
    }
}

async function getTransactionById(transactionId,userId) {
    try {
        const id = parseInt(transactionId);
        const transaction = await prisma.transaction.findUnique({ where: { id } });
        if (!transaction || transaction.userId !== parseInt(userId)) {
            throw new Error("Transaction not found or unauthorized");
        }
        return transaction;
    } catch (err) {
        console.error("Error fetching transaction:", err);
        throw new Error(err);
    }
}

async function deleteTransaction(transactionId,userId) {
    try {
        const id = parseInt(transactionId);
        const transaction = await prisma.transaction.findUnique({ where: { id } });
        if (!transaction || transaction.userId !== parseInt(userId)) {
            throw new Error("Transaction not found or unauthorized");
        }
        const accountId = transaction.accountId;
        const account = await getAccountById(accountId);
        const amountRollback = transaction.type === 'income' ? -transaction.amount : transaction.amount;

        const newBalance = parseFloat(account.balance) + parseFloat(amountRollback);

        await updateAccount(transaction.accountId, account.type, account.name, newBalance);
        await prisma.transaction.delete({ where: { id } });
        return transaction;

    } catch (err) {
        console.error("Error deleting transaction:", err);
        throw new Error(err);
    }
}

module.exports = {
    getAllTransactions,
    addTransaction,
    getTransactionById,
    deleteTransaction
};