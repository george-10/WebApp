# Financial App

A full-stack personal finance management application that helps users track accounts, categorize expenses/incomes, and manage transactions.

---

## Tech Stack

- **Backend:** [Express.js](https://expressjs.com/)
- **Frontend:** [Next.js](https://nextjs.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Authentication:** JWT-based authentication with hashed passwords

---

##  Features

###  User Authentication
- Secure sign-up and login functionality
- JWT tokens used for session handling
- Passwords are hashed for user protection

###  Account Management
- Create and manage multiple financial accounts (e.g., cash, bank)
- Each account displays its own balance

###  Category Management
- Organize income and expense categories per account
- Categories help streamline and sort transactions

###  Transactions
- Add, edit, or delete transactions
- Assign transactions to both accounts and categories
- Include a description and date for each transaction

### Transaction History
- View a history of all transactions per account
- Easily track financial activity over time

### Account Balances
- Real-time total balance display per account

---
### How to run it
You should provide the api package with a .env file that contains the following:
 >DATABASE_URL="Connection string to the Dababase"
 >JWT_SECRET="Secret for JWT signature hashing"

 You can then run ` npm run prisma ` to apply the migrations and generate the schemas

 You should also provide the frontend package with a .env file that contains the following:
>NEXT_PUBLIC_API_BASE_URL="URL to you backend"

Run ` npm start ` for both the backend and frontend to start the servers