// routes/calculator.js
const express = require('express');
const router = express.Router();

// Helper function for basic operations
const calculate = (operation, a, b) => {
    switch (operation) {
        case 'add':
            return a + b;
        case 'subtract':
            return a - b;
        case 'multiply':
            return a * b;
        case 'divide':
            return b !== 0 ? a / b : 'Error: Division by zero';
        default:
            return 'Error: Invalid operation';
    }
};

router.post('/calculate', (req, res) => {
    const { operation, a, b } = req.body;
    const result = calculate(operation, parseFloat(a), parseFloat(b));
    res.json({ result });
});

module.exports = router;
