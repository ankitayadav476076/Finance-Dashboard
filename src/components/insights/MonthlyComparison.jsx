import { useMemo } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import { groupByMonth, formatCurrency } from "../../utils/helpers";

export default function MonthlyComparison() {
  const { transactions } = useTransactions();
  const monthly = useMemo(() => groupByMonth(transactions), [transactions]);

  const last6 = monthly.slice(-6);
  const maxIncome  = Math.max(...last6.map(m => m.income),  1);
  const maxExpense = Math.max(...last6.map(m => m.expense), 1);
  const maxVal     = Math.max(maxIncome, maxExpense);

  if (last6.length === 0) {
    return (
      <div className="chart-card">
        <div className="section-title" style={{ marginBottom: 12 }}>Monthly Comparison</div>
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <p>No data yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="section-header">
        <div>
          <div className="section-title">Monthly Comparison</div>
          <div className="section-sub">Last {last6.length} months — income vs expenses</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--income-color)", display: "inline-block" }} />
          Income
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--expense-color)", display: "inline-block" }} />
          Expenses
        </div>
      </div>

      {last6.map((m) => (
        <div key={m.month} className="month-compare-row">
          <div className="month-label">{m.label}</div>
          <div className="month-bar-wrap">
            <div className="month-bar-row">
              <div className="month-bar-track">
                <div
                  className="month-bar-fill income"
                  style={{ width: `${(m.income / maxVal) * 100}%` }}
                />
              </div>
              <span className="month-bar-val">{formatCurrency(m.income)}</span>
            </div>
            <div className="month-bar-row">
              <div className="month-bar-track">
                <div
                  className="month-bar-fill expense"
                  style={{ width: `${(m.expense / maxVal) * 100}%` }}
                />
              </div>
              <span className="month-bar-val">{formatCurrency(m.expense)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
