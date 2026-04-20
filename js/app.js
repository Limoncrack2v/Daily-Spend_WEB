// ================================
// PASO 1: "Agarrar" los elementos del HTML
// Así JavaScript puede leerlos y modificarlos
// Piénsalo como: guardar una referencia a cada pieza
// ================================

const incomeInput    = document.getElementById('income');
const calculateBtn   = document.getElementById('calculate-btn');
const resultsSection = document.getElementById('results');

const needsAmount    = document.getElementById('needs-amount');
const wantsAmount    = document.getElementById('wants-amount');
const savingsAmount  = document.getElementById('savings-amount');

// ================================
// PASO 2: La función que formatea dinero
// En lugar de mostrar "7500", muestra "$7,500.00"
// ================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
}


// ================================
// PASO 3: La función principal — aquí están los cálculos
// Una función es un bloque de código con nombre
// que puedes ejecutar cuando quieras
// ================================

function calculate() {
    
    const income = parseFloat(incomeInput.value);

    if(!income || income <= 0){
        alert('Por favor ingresa un ingreso válido mayor a 0');
        return;
    }

    const needs     = income * 0.50;
    const wants     = income * 0.30;
    const savings   = income * 0.20;

    needsAmount.textContent     = formatCurrency(needs);
    wantsAmount.textContent     = formatCurrency(wants);
    savingsAmount.textContent   = formatCurrency(savings);

    resultsSection.removeAttribute('hidden');

    resultsSection.classList.add('visible');
}


// ================================
// PASO 4: El "event listener"
// Le dice al navegador: "cuando el usuario haga clic
// en el botón, ejecuta la función calculate()"
// ================================

calculateBtn.addEventListener('click', calculate);

incomeInput.addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
        calculate();
    }
})