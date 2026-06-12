import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { useTransactions } from "../../hooks/useTransactions";
import { getCategoryTotals, formatCurrency } from "../../utils/helpers";
import { CATEGORY_COLORS } from "../../data/mockData";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      padding: "10px 14px",
      boxShadow: "var(--shadow-md)",
      fontSize: "0.82rem",
    }}>
      <p style={{ fontWeight: 600, color: d.payload.fill || "var(--text-primary)" }}>{d.payload.name}</p>
      <p style={{ color: "var(--text-secondary)", marginTop: 3 }}>{formatCurrency(d.value)}</p>
    </div>
  );
}

export default function CategoryBreakdown() {
  const { transactions } = useTransactions();
  const data = useMemo(() => getCategoryTotals(transactions), [transactions]);

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <div className="section-title" style={{ marginBottom: 12 }}>Category Breakdown</div>
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p>No expenses to show.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="section-header">
        <div>
          <div className="section-title">Category Breakdown</div>
          <div className="section-sub">Total expenses per category</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={CATEGORY_COLORS[entry.name] || "#888"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
