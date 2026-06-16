const display = document.getElementById('display');
let expression = '';
const buttons = document.querySelectorAll('.buttons button');

function updateDisplay() {
  display.textContent = expression || '0';
}

function safeEvaluate(expr) {
  // Replace friendly operators
  const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/[^0-9.+\-*/()% ]/g, '');
  try {
    // eslint-disable-next-line no-new-func
    const result = Function('return (' + sanitized + ')')();
    if (Number.isFinite(result)) return String(result);
    return 'Error';
  } catch (e) {
    return 'Error';
  }
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const val = btn.textContent;
    if (!action) {
      // digit
      expression += val;
    } else {
      switch (action) {
        case 'clear':
          expression = '';
          break;
        case 'delete':
          expression = expression.slice(0, -1);
          break;
        case 'decimal':
          expression += '.';
          break;
        case 'operator':
          // avoid duplicate operators
          if (expression === '') return;
          const last = expression.slice(-1);
          if (/[-+×÷*/]/.test(last)) expression = expression.slice(0, -1);
          expression += val;
          break;
        case 'percent':
          // convert current expression to percent of itself
          try {
            const evaled = safeEvaluate(expression);
            if (evaled === 'Error') { expression = 'Error'; break; }
            expression = String(Number(evaled) / 100);
          } catch { expression = 'Error'; }
          break;
        case 'equals':
          expression = safeEvaluate(expression);
          break;
      }
    }
    updateDisplay();
  });
});

updateDisplay();
