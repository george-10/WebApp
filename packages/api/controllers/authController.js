const { registerUser, loginUser } = require('../services/auth');

async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        console.log(username, email, password);
        const user = await registerUser(username, email, password);
        res.status(201).json({ message: "User registered", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const token = await loginUser(email, password);
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    register,
    login
};
