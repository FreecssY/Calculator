// public/script.js

let expression = '';
let history = [];
let lastCalculated = false;

function appendNumber(number) {
    if (lastCalculated) {
        expression = ''; // Reset the expression if a calculation was just made
        lastCalculated = false;
    }
    expression += number;
    updateDisplay();
}

function appendOperation(operation) {
    if (lastCalculated) {
        expression = ''; // Reset the expression if a calculation was just made
        lastCalculated = false;
    }

    // Handle exponentiation by showing only ^
    if (operation === '^') {
        expression += '^';
    } else if (operation === 'π') {
        // Add implicit multiplication if needed
        if (expression.length > 0 && !isNaN(expression[expression.length - 1])) {
            expression += '*';
        }
        expression += 'π';
    } else if (operation === 'sqrt(') {
        // Add implicit multiplication if needed
        if (expression.length > 0 && !isNaN(expression[expression.length - 1])) {
            expression += '*';
        }
        expression += '√('; // Append √ for square root
    } else if (['sin(', 'cos(', 'tan(', '('].includes(operation)) {
        // Add implicit multiplication if needed
        if (expression.length > 0 && !isNaN(expression[expression.length - 1])) {
            expression += '*';
        }
        expression += operation;
    } else {
        expression += operation;
    }
    updateDisplay();
}

function updateDisplay() {
    const displayElement = document.getElementById('display');
    displayElement.innerText = expression
        .replace(/\^(\d+)/g, '²') // Properly format exponentiation for better readability
        .replace(/π/g, 'π')
        .replace(/√/g, '√')
        .replace(/sin/g, 'sin')
        .replace(/cos/g, 'cos')
        .replace(/tan/g, 'tan');
    setCaretToEnd(displayElement); // Move caret to end of the expression
}

function clearDisplay() {
    expression = '';
    lastCalculated = false;
    updateDisplay();
}

async function calculate() {
    if (expression === '') return;

    try {
        // Replace symbols for calculations
        let parsedExpression = expression
            .replace(/π/g, Math.PI.toString()) // Use full precision for π
            .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)') // Replace √() with Math.sqrt()
            .replace(/(\d+)\s*\^\s*(\d+)/g, 'Math.pow($1, $2)') // Replace a^b with Math.pow(a, b)
            .replace(/sin\(([^)]+)\)/g, (match, angle) => calculateSin(angle)) // Replace sin() with predefined sin value or Math.sin() in radians
            .replace(/cos\(([^)]+)\)/g, (match, angle) => calculateCos(angle)) // Replace cos() with predefined cos value or Math.cos() in radians
            .replace(/tan\(([^)]+)\)/g, 'Math.tan($1 * (Math.PI / 180))'); // Replace tan() with Math.tan() in radians

        // Execute the calculation
        const result = eval(parsedExpression);

        // Save history with the formatted original expression
        const formattedExpression = expression.replace(/\^(\d+)/g, '²');
        addToHistory(`${formattedExpression} = ${result}`);

        expression = result.toString();
        lastCalculated = true;
        updateDisplay();
    } catch (error) {
        expression = 'Error in calculation';
        updateDisplay();
    }
}

function calculateSin(angle) {
    // Use exact values for predefined π angles
    const piValues = [0, Math.PI / 6, Math.PI / 4, Math.PI / 3, Math.PI / 2, (2 * Math.PI) / 3, (3 * Math.PI) / 4, (5 * Math.PI) / 6, Math.PI];
    const sinValues = [0, 0.5, Math.sqrt(2) / 2, Math.sqrt(3) / 2, 1, Math.sqrt(3) / 2, Math.sqrt(2) / 2, 0.5, 0];
    for (let i = 0; i < piValues.length; i++) {
        if (parseFloat(angle) === piValues[i]) {
            return sinValues[i].toString();
        }
    }
    // If not predefined, use regular Math.sin()
    return Math.sin(parseFloat(angle) * (Math.PI / 180)).toString();
}

function calculateCos(angle) {
    // Use exact values for predefined π angles
    const piValues = [0, Math.PI / 6, Math.PI / 4, Math.PI / 3, Math.PI / 2, (2 * Math.PI) / 3, (3 * Math.PI) / 4, (5 * Math.PI) / 6, Math.PI];
    const cosValues = [1, Math.sqrt(3) / 2, Math.sqrt(2) / 2, 0.5, 0, -0.5, -Math.sqrt(2) / 2, -Math.sqrt(3) / 2, -1];
    for (let i = 0; i < piValues.length; i++) {
        if (parseFloat(angle) === piValues[i]) {
            return cosValues[i].toString();
        }
    }
    // If not predefined, use regular Math.cos()
    return Math.cos(parseFloat(angle) * (Math.PI / 180)).toString();
}

function toggleAdvancedPanel() {
    const advancedPanel = document.getElementById('advancedPanel');
    const toggleButton = document.getElementById('toggleButton');

    if (advancedPanel.classList.contains('open')) {
        advancedPanel.classList.remove('open');
        toggleButton.style.display = 'block';
    } else {
        advancedPanel.classList.add('open');
        toggleButton.style.display = 'none';
    }
}

function deleteLast() {
    if (lastCalculated) {
        expression = ''; // Reset the expression if a calculation was just made
        lastCalculated = false;
    }
    expression = expression.slice(0, -1);
    updateDisplay();
}

function addToHistory(calculation) {
    history.push(calculation);
    if (history.length > 10) {
        history.shift(); // Limit history to the last 10 calculations
    }
    renderHistory();
}

function renderHistory() {
    const historyContainer = document.getElementById('history');
    historyContainer.style.display = 'block'; // Show history after first calculation
    historyContainer.innerHTML = '';

    history.forEach((item) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = item; // Using innerHTML to display formatted text
        historyContainer.appendChild(historyItem);
    });

    // Keep scrollbar if there are more items than visible space
    historyContainer.scrollTop = historyContainer.scrollHeight;
}

// Move caret to the end of the contenteditable div
function setCaretToEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
        let range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

// Handle Keyboard Input
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (['+', '-', '*', '/', '^', '(', ')'].includes(key)) {
        appendOperation(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === 'Backspace') {
        deleteLast();
    }
});
