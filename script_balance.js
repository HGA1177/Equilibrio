const totalGastosSpan = document.getElementById('total-gastos');
const totalIngresosSpan = document.getElementById('total-ingresos');
const balanceTotalSpan = document.getElementById('balance-total');
const mainFilterTypeSelect = document.getElementById('main-filter-type');
const specificDayInput = document.getElementById('specific-day-input');
const specificMonthSelect = document.getElementById('specific-month-select');
const specificYearInput = document.getElementById('specific-year-input');
const applyFilterBtn = document.getElementById('apply-filter-btn');

let expenses = [];
let incomes = [];

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
    updateSummaryTotals();
}

function loadData() {
    expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    incomes = JSON.parse(localStorage.getItem('incomes') || '[]');
    
    populateMonthSelect(); 
    updateFilterUI(); 
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

function updateSummaryTotals() {
    const filteredExpenses = filterData(expenses);
    const filteredIncomes = filterData(incomes);

    const totalExpenses = filteredExpenses.reduce((sum, entry) => sum + entry.amount, 0);
    const totalIncomes = filteredIncomes.reduce((sum, entry) => sum + entry.amount, 0);
    const balance = totalIncomes - totalExpenses;

    totalGastosSpan.textContent = `USD ${totalExpenses.toFixed(2)}`;
    totalIngresosSpan.textContent = `USD ${totalIncomes.toFixed(2)}`;
    balanceTotalSpan.textContent = `USD ${balance.toFixed(2)}`;

    if (balance < 0) {
        balanceTotalSpan.classList.remove('text-yellow-600');
        balanceTotalSpan.classList.add('text-red-600');
    } else {
        balanceTotalSpan.classList.remove('text-red-600');
        balanceTotalSpan.classList.add('text-yellow-600'); 
    }
}

mainFilterTypeSelect.addEventListener('change', updateFilterUI);
applyFilterBtn.addEventListener('click', updateSummaryTotals);

specificDayInput.addEventListener('change', () => {
    mainFilterTypeSelect.value = 'specificDay'; 
    updateSummaryTotals(); 
});
specificMonthSelect.addEventListener('change', () => {
    mainFilterTypeSelect.value = 'specificMonth';
    updateSummaryTotals(); 
});
specificYearInput.addEventListener('input', () => {
    if (mainFilterTypeSelect.value !== 'specificMonth' && mainFilterTypeSelect.value !== 'specificYear') {
        mainFilterTypeSelect.value = 'specificYear';
    }
    updateSummaryTotals();
});

loadData();
