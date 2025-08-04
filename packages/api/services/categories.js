const {PrismaClient} = require('../generated/prisma/client');
const prisma = new PrismaClient();
const {getAllAccounts} = require("./account");

async function getCategories(id) {
    try{
        const accountId = parseInt(id);
        const categories = await prisma.category.findMany({
            where:{
                accountId
            }

        });
        return categories;
    }catch(err){
        console.error("Error fetching categories :",err);
        throw new Error(err);
    }
}

async function addCategory(name,type,id){
    try{

        const accountId = parseInt(id);
        const category = await prisma.category.create({
            data:{
                name,
                type,
                accountId,
            }
        })
        return category;
    }catch (err){
        console.error("Error creating category :",err);
        throw new Error(err);
    }
}

async function deleteCategory(categoryId){
    try{
        const id = parseInt(categoryId);
        const category = await prisma.category.delete({where:{id}})
        return category;
    }
    catch(err){
        console.error("Error deleting category :",err);
        throw new Error(err);
    }
}

async function getCategory(categoryId){
    try{
        const id = parseInt(categoryId);
        const category = await prisma.category.findUnique({where:{id}});
        return category;
    }catch(err){
        console.error("Error deleting category :",err);
        throw new Error(err);
    }
}

module.exports = {
    getCategories,
    addCategory,
    deleteCategory,
    getCategory
}