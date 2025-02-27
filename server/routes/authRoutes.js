const express = require('express');
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (username !== "admin" || password !== "password") {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    return res.status(200).json({ success: 'Login successful' });
});

module.exports = router;
