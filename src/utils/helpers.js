export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatMonthYear(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export function getMonthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function groupByMonth(transactions) {
  const map = {};
  transactions.forEach(t => {
    const key = getMonthKey(t.date);
    if (!map[key]) map[key] = { month: key, income: 0, expense: 0 };
    if (t.type === "income")  map[key].income  += t.amount;
    else                       map[key].expense += t.amount;
  });
  return Object.values(map)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(m => ({ ...m, balance: m.income - m.expense, label: formatMonthShort(m.month) }));
}

function formatMonthShort(key) {
  const [year, month] = key.split("-");
  const d = new Date(year, parseInt(month) - 1, 1);
  return d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
}

export function getCategoryTotals(transactions) {
  const map = {};
  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function applyFilters(transactions, filters) {
  let result = [...transactions];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      t =>
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.date.includes(q)
    );
  }

  if (filters.type !== "all") {
    result = result.filter(t => t.type === filters.type);
  }

  result.sort((a, b) => {
    let aVal = filters.sortBy === "amount" ? a.amount : a.date;
    let bVal = filters.sortBy === "amount" ? b.amount : b.date;
    if (aVal < bVal) return filters.sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return filters.sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return result;
}

export function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}
