const expenseForm = document.getElementById('expenseForm');
const expenseDateInput = document.getElementById('expense-date');
const expenseCategorySelect = document.getElementById('expense-category');
const expenseDescriptionInput = document.getElementById('expense-description');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseCurrencySelect = document.getElementById('expense-currency');
const expenseListDiv = document.getElementById('expense-list');
const noExpensesMessage = document.getElementById('no-expenses-message');
const messageBox = document.getElementById('message-box');

const mainFilterTypeSelect = document.getElementById('main-filter-type'); 
const specificDayInput = document.getElementById('specific-day-input');     
const specificMonthSelect = document.getElementById('specific-month-select'); 
const specificYearInput = document.getElementById('specific-year-input');   
const applyFilterBtn = document.getElementById('apply-filter-btn');         

const editModal = document.getElementById('editModal');
const closeButton = document.querySelector('.close-button');
const editForm = document.getElementById('editForm');
const editIdInput = document.getElementById('edit-id');
const editTypeInput = document.getElementById('edit-type');
const editDateInput = document.getElementById('edit-date');
const editCategorySelect = document.getElementById('edit-category');
const editDescriptionInput = document.getElementById('edit-description');
const editAmountInput = document.getElementById('edit-amount');
const editCurrencySelect = document.getElementById('edit-currency');

let expenses = [];

const categories = {
    expenses: [
        "Sueldos y Salarios",
        "Alquileres",
        "Servicios Publicos",
        "Materiales y Suministros",
        "Transporte y Logistica",
        "Marketing y Publicidad",
        "Mantenimiento y Reparaciones",
        "Depreciacion",
        "Impuestos y Tasas",
        "Intereses Bancarios",
        "Comisiones",
        "Seguros",
        "Gastos de Viaje",
        "Amortizaciones",
        "Otros Gastos Operativos"
    ]
};

const months = [
    { value: 0, name: 'Enero' },
    { value: 1, name: 'Febrero' },
    { value: 2, name: 'Marzo' },
    { value: 3, name: 'Abril' },
    { value: 4, name: 'Mayo' },
    { value: 5, name: 'Junio' },
    { value: 6, name: 'Julio' },
    { value: 7, name: 'Agosto' },
    { value: 8, name: 'Septiembre' },
    { value: 9, name: 'Octubre' },
    { value: 10, name: 'Noviembre' },
    { value: 11, name: 'Diciembre' }
];

function showMessage(message, type = 'info') {
    messageBox.textContent = message;
    messageBox.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700', 'bg-blue-100', 'text-blue-700');
    if (type === 'error') {
        messageBox.classList.add('bg-red-100', 'text-red-700');
    } else if (type === 'success') {
        messageBox.classList.add('bg-green-100', 'text-green-700');
    } else {
        messageBox.classList.add('bg-blue-100', 'text-blue-700');
    }
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}

function populateMonthSelect() {
    specificMonthSelect.innerHTML = '<option value="">Selecciona un Mes</option>';
    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month.value;
        option.textContent = month.name;
        specificMonthSelect.appendChild(option);
    });
}

function updateFilterUI() {
    const selectedType = mainFilterTypeSelect.value;

    specificDayInput.classList.add('hidden');
    specificMonthSelect.classList.add('hidden');
    specificYearInput.classList.add('hidden');

    switch (selectedType) {
        case 'specificDay':
            specificDayInput.classList.remove('hidden');
            break;
        case 'specificMonth':
            specificMonthSelect.classList.remove('hidden');
            specificYearInput.classList.remove('hidden');
            break;
        case 'specificYear':
            specificYearInput.classList.remove('hidden');
            break;
    }
}

function loadExpenses() {
    expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    populateCategorySelects(); 
    populateMonthSelect(); 
    updateFilterUI(); 
    displayExpenses();
}

function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function displayExpenses() {
    const listDiv = expenseListDiv;
    const data = expenses;
    const noMessage = noExpensesMessage;

    listDiv.innerHTML = '';

    if (data.length === 0) {
        noMessage.style.display = 'block';
        return;
    } else {
        noMessage.style.display = 'none';
    }

    const filteredData = filterData(data); 
    const sortedData = [...filteredData].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedData.forEach(entry => {
        const entryItem = document.createElement('div');
        entryItem.className = 'entry-item';
        entryItem.innerHTML = `
            <div class="entry-info">
                <p class="text-lg font-semibold">${entry.description || 'Sin descripción'}</p>
                <p class="text-sm text-gray-600">Fecha: ${entry.date}</p>
                <p class="text-sm text-gray-600">Categoría: <span class="font-medium text-red-700">${entry.category}</span></p>
            </div>
            <div class="entry-actions">
                <p class="text-xl font-bold text-red-600">${entry.currency} ${entry.amount.toFixed(2)}</p>
                <button class="edit-btn bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md" data-id="${entry.id}" data-type="expenses">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-1.757 1.757L4 14.172V17h2.828l8.414-8.414-2.828-2.828z"></path></svg>
                </button>
                <button class="delete-btn bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full shadow-md" data-id="${entry.id}" data-type="expenses">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd"></path></svg>
                </button>
            </div>
        `;
        listDiv.appendChild(entryItem);
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', openEditModal);
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', deleteEntry);
    });
}

function filterData(data) {
    const selectedType = mainFilterTypeSelect.value;
    const now = new Date();
    const todayNormalized = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return data.filter(entry => {
        const entryDateParts = entry.date.split('-');
        const entryYear = parseInt(entryDateParts[0]);
        const entryMonth = parseInt(entryDateParts[1]) - 1; 
        const entryDay = parseInt(entryDateParts[2]);
        const entryDateNormalized = new Date(entryYear, entryMonth, entryDay);

        switch (selectedType) {
            case 'today':
                return entryDateNormalized.getTime() === todayNormalized.getTime();
            case 'currentMonth':
                return entryYear === todayNormalized.getFullYear() && entryMonth === todayNormalized.getMonth();
            case 'currentYear':
                return entryYear === todayNormalized.getFullYear();
            case 'specificDay':
                if (specificDayInput.value) {
                    const filterDateParts = specificDayInput.value.split('-');
                    const filterDateNormalized = new Date(parseInt(filterDateParts[0]), parseInt(filterDateParts[1]) - 1, parseInt(filterDateParts[2]));
                    return entryDateNormalized.getTime() === filterDateNormalized.getTime();
                }
                return true; 
            case 'specificMonth':
                if (specificMonthSelect.value !== '' && specificYearInput.value) {
                    const filterMonth = parseInt(specificMonthSelect.value);
                    const filterYear = parseInt(specificYearInput.value);
                    return entryYear === filterYear && entryMonth === filterMonth;
                }
                return true; 
            case 'specificYear':
                if (specificYearInput.value) {
                    const filterYear = parseInt(specificYearInput.value);
                    return entryYear === filterYear;
                }
                return true; 
            case 'all':
            default:
                return true;
        }
    });
}

function handleFormSubmit(event) {
    event.preventDefault();

    const date = expenseDateInput.value;
    const category = expenseCategorySelect.value;
    const description = expenseDescriptionInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const currency = expenseCurrencySelect.value;

    if (!date || !category || isNaN(amount) || amount <= 0) {
        showMessage('Por favor, completa todos los campos obligatorios (Fecha, Categoría, Monto) y asegúrate de que el monto sea un número positivo.', 'error');
        return;
    }

    const newEntry = {
        id: Date.now(),
        date,
        category,
        description,
        amount,
        currency
    };

    expenses.push(newEntry);

    saveExpenses();
    displayExpenses();
    event.target.reset();
    showMessage('Gasto agregado exitosamente.', 'success');
}

function deleteEntry(event) {
    const entryId = parseInt(event.currentTarget.dataset.id);

    // Reintroducir la confirmación
    if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
        expenses = expenses.filter(entry => entry.id !== entryId);
        saveExpenses();
        displayExpenses();
        showMessage('Registro eliminado exitosamente.', 'info');
    }
}

function populateCategorySelects() {
    expenseCategorySelect.innerHTML = '<option value="">Selecciona una categoría</option>';
    categories.expenses.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        expenseCategorySelect.appendChild(option);
    });

    editCategorySelect.innerHTML = ''; 
    categories.expenses.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        editCategorySelect.appendChild(option);
    });
}

function openEditModal(event) {
    const entryId = parseInt(event.currentTarget.dataset.id);
    const entryToEdit = expenses.find(entry => entry.id === entryId);

    if (entryToEdit) {
        editIdInput.value = entryToEdit.id;
        editTypeInput.value = 'expenses';
        editDateInput.value = entryToEdit.date;
        editDescriptionInput.value = entryToEdit.description;
        editAmountInput.value = entryToEdit.amount;
        editCurrencySelect.value = entryToEdit.currency;

        populateCategorySelects();
        editCategorySelect.value = entryToEdit.category;

        editModal.style.display = 'flex';
    }
}

function closeEditModal() {
    editModal.style.display = 'none';
}

editForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const id = parseInt(editIdInput.value);
    const date = editDateInput.value;
    const category = editCategorySelect.value;
    const description = editDescriptionInput.value.trim();
    const amount = parseFloat(editAmountInput.value);
    const currency = editCurrencySelect.value;

    if (!date || !category || isNaN(amount) || amount <= 0) {
        showMessage('Por favor, completa todos los campos obligatorios y asegúrate de que el monto sea un número positivo.', 'error');
        return;
    }

    const index = expenses.findIndex(entry => entry.id === id);

    if (index !== -1) {
        expenses[index] = { id, date, category, description, amount, currency };
        saveExpenses();
        displayExpenses();
        closeEditModal();
        showMessage('Gasto actualizado exitosamente.', 'success');
    }
});

closeButton.addEventListener('click', closeEditModal);
window.addEventListener('click', (event) => {
    if (event.target === editModal) {
        closeEditModal();
    }
});

expenseForm.addEventListener('submit', handleFormSubmit);

mainFilterTypeSelect.addEventListener('change', () => {
    updateFilterUI(); 
    displayExpenses(); 
});
applyFilterBtn.addEventListener('click', displayExpenses); 

specificDayInput.addEventListener('change', () => {
    mainFilterTypeSelect.value = 'specificDay'; 
    displayExpenses(); 
});
specificMonthSelect.addEventListener('change', () => {
    mainFilterTypeSelect.value = 'specificMonth';
    displayExpenses(); 
});
specificYearInput.addEventListener('input', () => { 
    if (mainFilterTypeSelect.value !== 'specificMonth' && mainFilterTypeSelect.value !== 'specificYear') {
        mainFilterTypeSelect.value = 'specificYear';
    }
    displayExpenses(); 
});

loadExpenses();
