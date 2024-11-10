// public/script.js

let currentNumber = '';
let previousNumber = '';
let operation = '';

function appendNumber(number) {
    currentNumber += number;
    updateDisplay();
}

function operate(selectedOperation) {
    if (currentNumber === '') return;
    if (previousNumber !== '') calculate();
    operation = selectedOperation;
    previousNumber = currentNumber;
    currentNumber = '';
}

function updateDisplay() {
    document.getElementById('display').value = currentNumber;
}

function clearDisplay() {
    currentNumber = '';
    previousNumber = '';
    operation = '';
    updateDisplay();
}

async function calculate() {
    if (previousNumber === '' || currentNumber === '') return;

    const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            operation: operation,
            a: previousNumber,
            b: currentNumber
        })
    });

    const data = await response.json();
    currentNumber = data.result;
    previousNumber = '';
    operation = '';
    updateDisplay();
}
