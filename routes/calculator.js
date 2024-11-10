// routes/calculator.js
const express = require('express');
const router = express.Router();

// Evaluator function for advanced calculations (using math.js or JavaScript's built-in eval)
const { create, all } = require('mathjs');
const math = create(all);

router.post('/calculate', (req, res) => {
    const { operation, a, b } = req.body;
    let result;

    try {
        switch (operation) {
            case 'add':
                result = a + b;
                break;
            case 'subtract':
                result = a - b;
                break;
            case 'multiply':
                result = a * b;
                break;
            case 'divide':
                result = b !== 0 ? a / b : 'Error: Division by zero';
                break;
            default:
                result = 'Error: Invalid operation';
        }
        res.json({ result });
    } catch (error) {
        res.status(400).json({ result: 'Error in calculation' });
    }
});

router.post('/advanced-calculate', (req, res) => {
    const { expression } = req.body;
    let result;

    try {
        result = math.evaluate(expression);
        res.json({ result });
    } catch (error) {
        res.status(400).json({ result: 'Error in calculation' });
    }
});

module.exports = router;
