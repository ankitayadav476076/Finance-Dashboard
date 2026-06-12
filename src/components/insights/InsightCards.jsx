import { useMemo } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import { getCategoryTotals, groupByMonth, formatCurrency } from "../../utils/helpers";

export default function InsightCards() {
  const { transactions, totalIncome, totalExpense, balance } = useTransactions();

  const insights = useMemo(() => {
    const catTotals  = getCategoryTotals(transactions);
    const monthly    = groupByMonth(transactions);
    const topCat     = catTotals[0];
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

    // Month-over-month expense change
    let momChange = null;
    if (monthly.length >= 2) {
      const last = monthly[monthly.length - 1];
      const prev = monthly[monthly.length - 2];
      if (prev.expense > 0) {
        momChange = (((last.expense - prev.expense) / prev.expense) * 100).toFixed(1);
      }
    }

    // Average monthly expense
    const avgExpense = monthly.length > 0
      ? monthly.reduce((s, m) => s + m.expense, 0) / monthly.length
      : 0;

    // Highest spend month
    const maxMonth = monthly.reduce((best, m) => m.expense > (best?.expense || 0) ? m : best, null);

    return { topCat, savingsRate, momChange, avgExpense, maxMonth, monthly };
  }, [transactions, totalIncome, totalExpense, balance]);

  const cards = [
    {
      icon: "🏆",
      label: "Top Spending Category",
      value: insights.topCat ? insights.topCat.name : "—",
      desc: insights.topCat ? `${formatCurrency(insights.topCat.value)} total spent` : "No expenses yet",
    },
    {
      icon: "💰",
      label: "Savings Rate",
      value: `${insights.savingsRate}%`,
      desc: `${formatCurrency(balance)} saved of ${formatCurrency(totalIncome)} income`,
    },
    {
      icon: "📊",
      label: "Avg Monthly Expense",
      value: formatCurrency(insights.avgExpense),
      desc: `Across ${insights.monthly.length} months recorded`,
    },
    {
      icon: "📈",
      label: "Month-over-Month",
      value: insights.momChange !== null
        ? `${insights.momChange > 0 ? "+" : ""}${insights.momChange}%`
        : "—",
      desc: insights.momChange !== null
        ? insights.momChange > 0
          ? "Expenses increased vs last month"
          : "Expenses decreased vs last month"
        : "Not enough data",
    },
    {
      icon: "📅",
      label: "Highest Spend Month",
      value: insights.maxMonth ? insights.maxMonth.label : "—",
      desc: insights.maxMonth ? `${formatCurrency(insights.maxMonth.expense)} in expenses` : "No data",
    },
    {
      icon: "⚡",
      label: "Total Transactions",
      value: transactions.length,
      desc: `${transactions.filter(t => t.type === "income").length} income · ${transactions.filter(t => t.type === "expense").length} expenses`,
    },
  ];

  return (
    <div className="insights-grid">
      {cards.map((c, i) => (
        <div className="insight-card" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
          <div className="insight-icon">{c.icon}</div>
          <div className="insight-label">{c.label}</div>
          <div className="insight-value">{c.value}</div>
          <div className="insight-desc">{c.desc}</div>
        </div>
      ))}
    </div>
  );
}
