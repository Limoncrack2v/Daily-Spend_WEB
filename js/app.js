// ================================
// REFERENCIAS AL HTML
// ================================
const incomeInput    = document.getElementById('income');
const calculateBtn   = document.getElementById('calculate-btn');
const resultsSection = document.getElementById('results');

// ================================
// ESTADO DE LA APP
// Aquí guardamos todos los datos importantes.
// Piénsalo como la "memoria" de la app.
// ================================
let budget = { needs: 0, wants: 0, savings: 0 };

// Cada categoría tiene su lista de gastos
let expenses = { needs: [], wants: [], savings: [] };

// ================================
// CONFIGURACIÓN DE CADA CATEGORÍA
// Así evitamos repetir código para cada tarjeta
// ================================
const categories = [
  { key: 'needs',   ratio: 0.50 },
  { key: 'wants',   ratio: 0.30 },
  { key: 'savings', ratio: 0.20 },
];

// ================================
// UTILIDADES
// ================================
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
}

// Suma todos los gastos de una categoría
function getTotalSpent(category) {
  return expenses[category].reduce((total, exp) => total + exp.amount, 0);
  // reduce() recorre el array sumando cada gasto al total
}

// ================================
// ACTUALIZAR EL CÍRCULO DE PROGRESO
// ================================
function updateRing(category) {
  const spent      = getTotalSpent(category);
  const total      = budget[category];
  const percent    = total > 0 ? Math.min((spent / total) * 100, 100) : 0;

  // El círculo tiene circunferencia de 201px (2 * π * radio32 ≈ 201)
  // stroke-dashoffset controla cuánto del arco se muestra:
  // 201 = vacío, 0 = lleno
  const circumference = 201;
  const offset = circumference - (percent / 100) * circumference;

  const ring  = document.getElementById(`${category}-ring`);
  const label = document.getElementById(`${category}-ring-label`);

  ring.style.strokeDashoffset = offset;
  label.textContent = Math.round(percent) + '%';
}

// ================================
// ACTUALIZAR EL DISPONIBLE DE CADA TARJETA
// ================================
function updateAvailable(category) {
  const spent     = getTotalSpent(category);
  const available = budget[category] - spent;

  const availableEl = document.getElementById(`${category}-available`);
  availableEl.textContent = formatCurrency(available);

  // Si se pasó del presupuesto, lo marcamos en rojo
  if (available < 0) {
    availableEl.classList.add('over-budget');
  } else {
    availableEl.classList.remove('over-budget');
  }
}

// ================================
// RENDERIZAR LA LISTA DE GASTOS
// "Renderizar" = convertir datos en elementos HTML visibles
// ================================
function renderExpenses(category) {
  const list = document.getElementById(`${category}-list`);
  list.innerHTML = ''; // Limpiamos la lista antes de redibujarla

  expenses[category].forEach((expense, index) => {
    // Creamos un elemento <li> por cada gasto
    const li = document.createElement('li');
    li.className = 'expense-item';
    li.innerHTML = `
      <strong>${expense.name}</strong>
      <span>${formatCurrency(expense.amount)}</span>
      <button class="delete-btn" data-category="${category}" data-index="${index}">🗑️</button>
    `;
    list.appendChild(li);
  });
}

// ================================
// AGREGAR UN GASTO
// ================================
function addExpense(category) {
  // Encontramos los inputs de esa tarjeta específica
  const card       = document.querySelector(`.card.${category}`);
  const nameInput  = card.querySelector('.expense-name');
  const amountInput = card.querySelector('.expense-amount');

  const name   = nameInput.value.trim();     // .trim() elimina espacios al inicio/final
  const amount = parseFloat(amountInput.value);

  // Validación
  if (!name || !amount || amount <= 0) {
    alert('Escribe un nombre y un monto válido');
    return;
  }

  // Agregamos el gasto al array de esa categoría
  expenses[category].push({ name, amount });

  // Limpiamos los inputs
  nameInput.value   = '';
  amountInput.value = '';

  // Actualizamos la interfaz
  renderExpenses(category);
  updateAvailable(category);
  updateRing(category);
}

// ================================
// ELIMINAR UN GASTO
// Usamos "delegación de eventos": en lugar de poner un
// listener en cada botón, ponemos uno en la lista padre
// y detectamos en cuál botón se hizo clic
// ================================
document.addEventListener('click', function(event) {

  // ¿Se hizo clic en un botón de agregar?
  if (event.target.classList.contains('add-btn')) {
    const category = event.target.dataset.category;
    addExpense(category);
  }

  // ¿Se hizo clic en un botón de eliminar?
  if (event.target.classList.contains('delete-btn')) {
    const category = event.target.dataset.category;
    const index    = parseInt(event.target.dataset.index);

    // splice(index, 1) elimina 1 elemento en esa posición del array
    expenses[category].splice(index, 1);

    renderExpenses(category);
    updateAvailable(category);
    updateRing(category);
  }
});

// ================================
// CALCULAR PRESUPUESTO PRINCIPAL
// ================================
function calculate() {
  const income = parseFloat(incomeInput.value);

  if (!income || income <= 0) {
    alert('Por favor ingresa un ingreso válido mayor a 0');
    return;
  }

  // Guardamos el presupuesto de cada área
  budget.needs   = income * 0.50;
  budget.wants   = income * 0.30;
  budget.savings = income * 0.20;

  // Reiniciamos los gastos al recalcular
  expenses = { needs: [], wants: [], savings: [] };

  // Actualizamos los montos en las tarjetas
  categories.forEach(({ key }) => {
    document.getElementById(`${key}-amount`).textContent    = formatCurrency(budget[key]);
    document.getElementById(`${key}-available`).textContent = formatCurrency(budget[key]);
    renderExpenses(key);
    updateRing(key);
  });

  // Mostramos la sección
  resultsSection.removeAttribute('hidden');
  setTimeout(() => resultsSection.classList.add('visible'), 10);
}

// ================================
// EVENTOS PRINCIPALES
// ================================
calculateBtn.addEventListener('click', calculate);
incomeInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') calculate();
});