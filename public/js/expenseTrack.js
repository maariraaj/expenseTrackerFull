const expenseForm = document.querySelector("#expense-form");
const amountInput = document.querySelector("#amount");
const descriptionInput = document.querySelector("#description");
const categoryInput = document.querySelector("#category");
const expensesTable = document.getElementById("expenses-table");
const expensesTableBody = document.querySelector("#expenses-table tbody");
const premiumButton = document.getElementById("rzp-button1");
const rowsPerPageInput = document.getElementById("rowsPerPage");
const logoutButton = document.getElementById('logout-btn');

function getRowsPerPage() {
    const rows = localStorage.getItem("rowsPerPage");
    return rows ? parseInt(rows, 10) : 10;
}

function setRowsPerPage(rows) {
    localStorage.setItem("rowsPerPage", rows);
}

rowsPerPageInput.addEventListener("input", (e) => {
    const rows = parseInt(e.target.value, 10);
    if (rows > 0) {
        setRowsPerPage(rows);
        fetchExpenses();
    }
});

const fetchExpenses = async (page = 1) => {
    const rows = localStorage.getItem("rowsPerPage");
    const limit = rows ? parseInt(rows, 10) : 10;
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`/expenses/expenses?page=${page}&limit=${limit}`, {
            headers: { 'Authorization': token },
        });

        const { expenses, totalPages, currentPage } = response.data;
        renderExpenses(expenses, currentPage, limit);
        renderPagination(totalPages, currentPage);
    } catch (error) {
        console.error("Error fetching expenses:", error);
    }
};

const renderExpenses = (expenses, currentPage, limit) => {
    expensesTableBody.innerHTML = "";
    expenses.forEach((expense, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td class="border px-4 py-2">${(limit * (currentPage - 1)) + index + 1}</td>
        <td class="border px-4 py-2">${expense.amount}</td>
        <td class="border px-4 py-2">${expense.description}</td>
        <td class="border px-4 py-2">${expense.category}</td>
        <td class="border px-4 py-2">
            <button class="bg-rose-600 text-white px-4 py-2 rounded" onclick="deleteExpense(${expense.id})">
                Delete
            </button>
        </td>
    `;
        expensesTableBody.appendChild(row);
    });
};

const renderPagination = (totalPages, currentPage) => {
    const paginationContainer = document.getElementById('pagination-container') || document.createElement('div');
    paginationContainer.id = 'pagination-container';
    paginationContainer.classList.add('mt-4', 'text-center');
    paginationContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add(
            'px-4', 'py-2', 'm-1', 'border', 'rounded',
            i === currentPage ? 'bg-cyan-600' : 'bg-white'
        );
        button.onclick = () => fetchExpenses(i);
        paginationContainer.appendChild(button);
    }
    document.querySelector('main').appendChild(paginationContainer);
};

const addExpense = async (amount, description, category) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post("/expenses/expense",
            {
                amount,
                description,
                category,
            },
            { headers: { 'Authorization': token } }
        );
        fetchExpenses();
    } catch (error) {
        console.error("Error adding expense:", error);
    }
};

async function deleteExpense(expenseId) {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.delete(`/expenses/${expenseId}`, {
            headers: { 'Authorization': token }
        });
        if (response.status === 200) {
            alert("Expense deleted successfully!");
            fetchExpenses();
        }
    } catch (error) {
        console.error("Error deleting expense:", error);
        alert("An error occurred while deleting the expense.");
    }
}

expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = amountInput.value.trim();
    const description = descriptionInput.value.trim();
    const category = categoryInput.value;
    if (!amount || !description || !category) {
        alert("Please fill in all fields!");
        return;
    }
    addExpense(amount, description, category);
    expenseForm.reset();
});

const leaderboardDiv = document.createElement("div");
leaderboardDiv.classList.add("mt-8", "max-w-4xl", "mx-auto");

const renderLeaderboard = (leaderboard) => {
    leaderboardDiv.innerHTML = `
        <h2 class="text-xl font-bold mb-4">Leaderboard</h2>
        <table class="w-full bg-white shadow-md rounded-lg">
            <thead>
                <tr class="bg-cyan-600 text-white">
                    <th class="py-2 px-4 text-left">Rank</th>
                    <th class="py-2 px-4 text-left">User</th>
                    <th class="py-2 px-4 text-left">Total Expense</th>
                </tr>
            </thead>
            <tbody>
                ${leaderboard.map((entry, index) => `
                    <tr>
                        <td class="border px-4 py-2">${index + 1}</td>
                        <td class="border px-4 py-2">${entry.name}</td>
                        <td class="border px-4 py-2">${entry.totalExpense}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table> `;
    expensesTable.parentNode.appendChild(leaderboardDiv);
};

const showLeaderboard = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('/premium/leaderboard', {
            headers: { 'Authorization': token },
        });
        if (response.data.success) {
            renderLeaderboard(response.data.leaderboard);
        } else {
            alert("Failed to fetch leaderboard.");
        }
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
    }
};

const goToDownload = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("You are not logged in. Please log in to access this page.");
        return;
    }
    window.location.href = '/expenses/downloadExp.html';
};

const premiumStatusText = document.createElement("div");
premiumStatusText.classList.add(
    "text-4xl",
    "font-bold",
    "text-transparent",
    "bg-clip-text",
    "bg-gradient-to-r",
    "from-teal-400",
    "via-pink-500",
    "to-purple-600"
);
premiumStatusText.innerHTML = `
    You are a premium user!
    <div class="py-2 px-4">
    <button class="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-emerald-600 hover:via-teal-600 hover:to-blue-600 focus:outline-none" onclick="showLeaderboard()">
        Show Leaderboard
    </button>
    <button class="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-emerald-600 hover:via-teal-600 hover:to-blue-600 focus:outline-none" onclick="goToDownload()">
        Download Expense
    </button></div>`;

const replaceWithPremiumText = () => {
    premiumButton.replaceWith(premiumStatusText);
};

const checkPremiumStatus = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('/purchase/orders', {
            headers: { 'Authorization': token },
        });
        const orders = response.data.orders;

        const isPremiumUser = orders.some(order => order.status === 'SUCCESSFUL');
        if (isPremiumUser) {
            replaceWithPremiumText();
        }
    } catch (error) {
        console.error("Error checking premium status:", error);
    }
};

premiumButton.onclick = async (e) => {
    const token = localStorage.getItem('token');
    const response = await axios.get('/purchase/premiumMembership', {
        headers: { 'Authorization': token },
    });
    const options = {
        key: response.data.key_id,
        order_id: response.data.order.id,
        handler: async function (response) {
            await axios.post('/purchase/updateTransactionStatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
                status: 'SUCCESSFUL',
            }, {
                headers: { 'Authorization': token },
            });
            checkPremiumStatus();
        },
        'modal': {
            'ondismiss': async function () {
                await axios.post('/purchase/updateTransactionStatus',
                    {
                        order_id: options.order_id,
                        status: 'FAILED',
                    },
                    { headers: { "Authorization": token } }
                );
                alert("Transaction Failed or Cancelled!");
            }
        }
    };
    const razorpay = new Razorpay(options);
    razorpay.open();
};

logoutButton.onclick = () => {
    localStorage.clear();
    window.location.href = '/auth/logIn.html';
}

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return window.location.href = '/auth/logIn.html';
    }
    rowsPerPageInput.value = getRowsPerPage();
    fetchExpenses();
    checkPremiumStatus();
});