const {PrismaClient} = require('../generated/prisma/client');
const prisma = new PrismaClient();


async function getAllAccounts(userId){
    try{
        const accounts = await prisma.account.findMany({where: {userId: userId}});
        return accounts;
    }catch(err){
        console.error("Error fetching accoutns:" ,err);
        throw new Error(err);
    }
}

async function createAccount(name,type,balance=0,userId){
    try{
        const account = await prisma.account.create({
            data:{
                name,
                type,
                balance,
                userId: userId,
            }
        })
        return account;
    }catch(err){
        console.error("Error creating account:",err);
        throw new Error(err);
    }
}

async function getAccountById(accountId){
    try{
        const id = parseInt(accountId);
        const account = await prisma.account.findUnique({where: {id}});
        return account;
    }catch(err){
        console.error("Error fetching account:",err);
        throw new Error(err);
    }
}

async function deleteAccount(accountId) {
  try {
    const id = parseInt(accountId);
    await prisma.transaction.deleteMany({ where: { accountId: id } });
    await prisma.category.deleteMany({ where: { accountId: id } });
    const account = await prisma.account.delete({ where: { id } });
    return account;
  } catch (err) {
    console.error("Error deleting account:", err);
    throw new Error("Failed to delete account");
  }
}


async function updateAccount(accountId,type,name,balance){
    try{
        const id = parseInt(accountId);
        console.log("Updating account with ID:", id,"new balance:", balance);
        const updated = await prisma.account.update({
            where: {id},
            data: {
                name,
                type,
                balance: parseFloat(balance)
            }
        })
        return updated;
    }catch(err){
        console.error("Error updating account:",err);
        throw new Error(err);
    }
}

module.exports = {
    getAllAccounts,
    createAccount,
    getAccountById,
    deleteAccount,
    updateAccount,
}