/* INSIGHTPRO - ANALYTICS DASHBOARD */
// Sample business data
// Assignment demo ke liye use ho raha hai.

const monthlyData = [
    { month: "Jan", revenue: 5200, orders: 130, customers: 90 },
    { month: "Feb", revenue: 6800, orders: 165, customers: 110 },
    { month: "Mar", revenue: 5900, orders: 148, customers: 98 },
    { month: "Apr", revenue: 8200, orders: 205, customers: 140 },
    { month: "May", revenue: 7400, orders: 190, customers: 125 },
    { month: "Jun", revenue: 9100, orders: 240, customers: 160 }
];

const categoryData = {
    products: { label: "Products", revenue: 22000, orders: 620, customers: 390 },
    services: { label: "Services", revenue: 15800, orders: 420, customers: 300 },
    subscriptions: { label: "Subscriptions", revenue: 10450, orders: 244, customers: 174 }
};

const transactions = [
    { id: "ORD-1001", customer: "Ali Ahmed", date: "2026-06-20", amount: 420, status: "completed", category: "products" },
    { id: "ORD-1002", customer: "Sara Khan", date: "2026-06-18", amount: 890, status: "pending", category: "services" },
    { id: "ORD-1003", customer: "Usman Malik", date: "2026-06-15", amount: 250, status: "completed", category: "subscriptions" },
    { id: "ORD-1004", customer: "Ayesha Noor", date: "2026-06-12", amount: 670, status: "cancelled", category: "products" },
    { id: "ORD-1005", customer: "Hamza Ali", date: "2026-06-10", amount: 1250, status: "completed", category: "services" },
    { id: "ORD-1006", customer: "Fatima Iqbal", date: "2026-06-08", amount: 540, status: "pending", category: "products" },
    { id: "ORD-1007", customer: "Ahmed Raza", date: "2026-06-05", amount: 980, status: "completed", category: "subscriptions" },
    { id: "ORD-1008", customer: "Zainab Shah", date: "2026-06-02", amount: 350, status: "completed", category: "services" },
    { id: "ORD-1009", customer: "Bilal Hussain", date: "2026-05-28", amount: 760, status: "pending", category: "products" },
    { id: "ORD-1010", customer: "Mariam Asif", date: "2026-05-25", amount: 1100, status: "completed", category: "subscriptions" },
    { id: "ORD-1011", customer: "Daniyal Khan", date: "2026-05-20", amount: 480, status: "cancelled", category: "services" },
    { id: "ORD-1012", customer: "Hira Ahmed", date: "2026-05-15", amount: 920, status: "completed", category: "products" },
    { id: "ORD-1013", customer: "Omar Farooq", date: "2026-04-28", amount: 640, status: "completed", category: "services" },
    { id: "ORD-1014", customer: "Noor Fatima", date: "2026-04-20", amount: 1350, status: "pending", category: "subscriptions" },
    { id: "ORD-1015", customer: "Saad Ahmed", date: "2026-04-10", amount: 570, status: "completed", category: "products" },
    { id: "ORD-1016", customer: "Muneeb Ali", date: "2026-03-25", amount: 820, status: "completed", category: "services" },
    { id: "ORD-1017", customer: "Laiba Khan", date: "2026-02-18", amount: 460, status: "pending", category: "products" },
    { id: "ORD-1018", customer: "Rayan Shah", date: "2026-01-12", amount: 990, status: "completed", category: "subscriptions" }
];

// Current dashboard state
let revenueChart = null;
let categoryChart = null;
let currentPage = 1;
let rowsPerPage = 6;
let sortKey = "date";
let sortDirection = "desc";

const $ = (selector) => document.querySelector(selector);

// Format numbers as currency
const formatCurrency = (value) =>
    "$" + Number(value).toLocaleString("en-US");

const formatNumber = (value) =>
    Number(value).toLocaleString("en-US");

// Get category totals for the selected category
function getCategoryTotals() {
    const category = $("#category-filter").value;

    if (category === "all") {
        return Object.values(categoryData).reduce(
            (totals, item) => {
                totals.revenue += item.revenue;
                totals.orders += item.orders;
                totals.customers += item.customers;
                return totals;
            },
            { revenue: 0, orders: 0, customers: 0 }
        );
    }

    return { ...categoryData[category] };
}

// Get months based on the selected period
function getSelectedMonths() {
    const period = $("#date-filter").value;

    if (period === "quarter") return monthlyData.slice(-3);
    if (period === "half") return monthlyData.slice(-6);

    return monthlyData;
}

// Update KPI cards
function updateStats() {
    const totals = getCategoryTotals();

    const selectedCategory = $("#category-filter").value;
    const categoryMultiplier = selectedCategory === "all" ? 1 : 0.36;

    const months = getSelectedMonths();
    const monthlyRevenue = months.reduce(
        (sum, item) => sum + item.revenue,
        0
    );

    const revenue = Math.round(
        monthlyRevenue * categoryMultiplier
    );

    const orders = Math.round(
        months.reduce((sum, item) => sum + item.orders, 0) *
        (totals.orders / 1284)
    );

    const customers = Math.round(
        months.reduce((sum, item) => sum + item.customers, 0) *
        (totals.customers / 864)
    );

    $("#total-revenue").textContent = formatCurrency(revenue);
    $("#total-orders").textContent = formatNumber(orders);
    $("#total-customers").textContent = formatNumber(customers);

    const conversion = orders
        ? ((orders / Math.max(customers * 2, 1)) * 100).toFixed(2)
        : "0.00";

    $("#conversion-rate").textContent = conversion + "%";
}

// Create or update revenue chart
function updateRevenueChart() {
    if (typeof Chart === "undefined") {
        console.error("Chart.js load nahi hui. Internet connection check karein.");
        return;
    }

    const months = getSelectedMonths();
    const category = $("#category-filter").value;
    const chartType = $("#revenue-view").value;

    const multiplier = category === "all" ? 1 : 0.36;

    const labels = months.map(item => item.month);
    const values = months.map(
        item => Math.round(item.revenue * multiplier)
    );

    const isDark = document.body.classList.contains("dark-mode");
    const textColor = isDark ? "#a1a5ba" : "#85899d";
    const gridColor = isDark ? "#303347" : "#e9eaf2";

    const chartData = {
        labels,
        datasets: [{
            label: "Revenue",
            data: values,
            borderColor: "#6658e8",
            backgroundColor: chartType === "bar"
                ? "rgba(102, 88, 232, 0.75)"
                : "rgba(102, 88, 232, 0.12)",
            borderWidth: 3,
            fill: chartType === "line",
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: "#6658e8",
            borderRadius: chartType === "bar" ? 6 : 0
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: "index"
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: context =>
                        " Revenue: " + formatCurrency(context.parsed.y)
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: textColor }
            },
            y: {
                beginAtZero: true,
                grid: { color: gridColor },
                ticks: {
                    color: textColor,
                    callback: value => "$" + value.toLocaleString()
                }
            }
        }
    };

    if (revenueChart) {
        revenueChart.destroy();
    }

    revenueChart = new Chart($("#revenue-chart"), {
        type: chartType,
        data: chartData,
        options: chartOptions
    });
}

// Create or update category doughnut chart
function updateCategoryChart() {
    if (typeof Chart === "undefined") return;

    const category = $("#category-filter").value;

    const labels = [];
    const values = [];
    const colors = [];

    const colorMap = {
        products: "#6658e8",
        services: "#3885df",
        subscriptions: "#e99a32"
    };

    Object.entries(categoryData).forEach(([key, item]) => {
        if (category === "all" || category === key) {
            labels.push(item.label);
            values.push(item.revenue);
            colors.push(colorMap[key]);
        }
    });

    const isDark = document.body.classList.contains("dark-mode");

    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart = new Chart($("#category-chart"), {
        type: "doughnut",
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderColor: isDark ? "#1d2031" : "#ffffff",
                borderWidth: 4,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%",
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: context =>
                            context.label + ": " +
                            formatCurrency(context.parsed)
                    }
                }
            }
        }
    });

    // Update legend to match selected category
    document.querySelectorAll(".chart-legend span").forEach(item => {
        const label = item.textContent.trim().toLowerCase();
        item.style.display =
            category === "all" || label.startsWith(category)
                ? "flex"
                : "none";
    });
}

// Filter transactions by category, status, and search
function getFilteredTransactions() {
    const search = $("#table-search").value.trim().toLowerCase();
    const status = $("#status-filter").value;
    const category = $("#category-filter").value;

    return transactions.filter(item => {
        const matchesSearch =
            item.id.toLowerCase().includes(search) ||
            item.customer.toLowerCase().includes(search);

        const matchesStatus =
            status === "all" || item.status === status;

        const matchesCategory =
            category === "all" || item.category === category;

        return matchesSearch && matchesStatus && matchesCategory;
    });
}

// Sorting
function sortTransactions(data) {
    return [...data].sort((a, b) => {
        let first = a[sortKey];
        let second = b[sortKey];

        if (sortKey === "amount") {
            first = Number(first);
            second = Number(second);
        } else {
            first = String(first).toLowerCase();
            second = String(second).toLowerCase();
        }

        if (first < second) return sortDirection === "asc" ? -1 : 1;
        if (first > second) return sortDirection === "asc" ? 1 : -1;

        return 0;
    });
}

// Render transaction table
function renderTable() {
    const filtered = sortTransactions(getFilteredTransactions());
    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * rowsPerPage;
    const visibleRows = filtered.slice(start, start + rowsPerPage);
    const tbody = $("#transaction-body");

    tbody.innerHTML = "";

    if (visibleRows.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    No matching transactions found.
                </td>
            </tr>
        `;
    } else {
        visibleRows.forEach(item => {
            const initials = item.customer
                .split(" ")
                .map(part => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

            const row = document.createElement("tr");

            row.innerHTML = `
                <td class="order-id">${item.id}</td>
                <td>
                    <div class="customer-cell">
                        <span class="customer-avatar">${initials}</span>
                        <span>${item.customer}</span>
                    </div>
                </td>
                <td>${new Date(item.date + "T00:00:00").toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" }
                )}</td>
                <td>${formatCurrency(item.amount)}</td>
                <td><span class="status ${item.status}">${item.status}</span></td>
            `;

            tbody.appendChild(row);
        });
    }

    const firstItem = filtered.length ? start + 1 : 0;
    const lastItem = Math.min(start + rowsPerPage, filtered.length);

    $("#table-summary").textContent =
        `Showing ${firstItem}-${lastItem} of ${filtered.length} transactions`;

    renderPagination(totalPages);
}

// Create pagination buttons
function renderPagination(totalPages) {
    const pagination = $("#pagination");
    pagination.innerHTML = "";

    const previous = document.createElement("button");
    previous.className = "page-button";
    previous.textContent = "‹";
    previous.disabled = currentPage === 1;
    previous.setAttribute("aria-label", "Previous page");

    previous.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    pagination.appendChild(previous);

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement("button");

        button.className =
            "page-button" + (page === currentPage ? " active" : "");

        button.textContent = page;

        button.addEventListener("click", () => {
            currentPage = page;
            renderTable();
        });

        pagination.appendChild(button);
    }

    const next = document.createElement("button");
    next.className = "page-button";
    next.textContent = "›";
    next.disabled = currentPage === totalPages;
    next.setAttribute("aria-label", "Next page");

    next.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    pagination.appendChild(next);
}

// Update all dashboard components
function updateDashboard() {
    currentPage = 1;
    updateStats();
    updateRevenueChart();
    updateCategoryChart();
    renderTable();
}

// Filter event listeners
$("#date-filter").addEventListener("change", updateDashboard);
$("#category-filter").addEventListener("change", updateDashboard);
$("#revenue-view").addEventListener("change", updateRevenueChart);

$("#table-search").addEventListener("input", () => {
    currentPage = 1;
    renderTable();
});

$("#status-filter").addEventListener("change", () => {
    currentPage = 1;
    renderTable();
});

$("#reset-filters").addEventListener("click", () => {
    $("#date-filter").value = "all";
    $("#category-filter").value = "all";
    $("#table-search").value = "";
    $("#status-filter").value = "all";
    $("#revenue-view").value = "line";

    updateDashboard();
});

// Sorting event listeners
document.querySelectorAll(".sort-button").forEach(button => {
    button.addEventListener("click", () => {
        const key = button.dataset.sort;

        if (sortKey === key) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortKey = key;
            sortDirection = key === "date" ? "desc" : "asc";
        }

        currentPage = 1;
        renderTable();
    });
});

// Dark mode toggle
$("#theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");
    const icon = $("#theme-toggle i");

    icon.className = isDark
        ? "fa-solid fa-sun"
        : "fa-solid fa-moon";

    $("#theme-toggle").setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    updateRevenueChart();
    updateCategoryChart();
});

// Export currently filtered transactions as CSV
$("#export-btn").addEventListener("click", () => {
    const data = sortTransactions(getFilteredTransactions());

    if (data.length === 0) {
        alert("Export ke liye koi transaction available nahi.");
        return;
    }

    const headers = ["Order ID", "Customer", "Date", "Amount", "Status", "Category"];

    const rows = data.map(item => [
        item.id,
        item.customer,
        item.date,
        item.amount,
        item.status,
        item.category
    ]);

    // Escape CSV fields safely
    const csvEscape = value =>
        `"${String(value).replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
        .map(row => row.map(csvEscape).join(","))
        .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "insightpro-transactions.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
});

// Initial dashboard load
updateDashboard();
