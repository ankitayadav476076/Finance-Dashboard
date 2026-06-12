import { useTransactions } from "../../hooks/useTransactions";
import { formatCurrency } from "../../utils/helpers";

export default function SummaryCards() {
  const { totalIncome, totalExpense, balance } = useTransactions();

  const cards = [
    {
      type:  "balance",
      icon:  "◈",
      label: "Total Balance",
      value: balance,
      sub:   "Net across all time",
      cls:   balance >= 0 ? "positive" : "negative",
    },
    {
      type:  "income",
      icon:  "↑",
      label: "Total Income",
      value: totalIncome,
      sub:   "All income recorded",
      cls:   "positive",
    },
    {
      type:  "expense",
      icon:  "↓",
      label: "Total Expenses",
      value: totalExpense,
      sub:   "All expenses recorded",
      cls:   "negative",
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((c) => (
        <div key={c.type} className={`summary-card ${c.type}`}>
          <div className="summary-icon">{c.icon}</div>
          <div className="summary-label">{c.label}</div>
          <div className={`summary-value ${c.cls}`}>
            {formatCurrency(Math.abs(c.value))}
            {c.type === "balance" && c.value < 0 && (
              <span style={{ fontSize: "0.7em", marginLeft: 4 }}>deficit</span>
            )}
          </div>
          <div className="summary-sub">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
