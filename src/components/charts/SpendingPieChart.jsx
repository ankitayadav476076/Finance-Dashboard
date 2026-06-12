import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
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
      <p style={{ fontWeight: 600, color: d.payload.fill }}>{d.name}</p>
      <p style={{ color: "var(--text-secondary)", marginTop: 3 }}>{formatCurrency(d.value)}</p>
    </div>
  );
}

export default function SpendingPieChart() {
  const { transactions } = useTransactions();
  const data = getCategoryTotals(transactions).slice(0, 6);

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <div className="section-title" style={{ marginBottom: 12 }}>Spending Breakdown</div>
        <div className="empty-state">
          <div className="empty-state-icon">◎</div>
          <p>No expense data yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="section-header">
        <div>
          <div className="section-title">Spending Breakdown</div>
          <div className="section-sub">By category</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={CATEGORY_COLORS[entry.name] || "#888"}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "0.72rem", paddingTop: "6px" }}
            formatter={(val) => <span style={{ color: "var(--text-secondary)" }}>{val}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
