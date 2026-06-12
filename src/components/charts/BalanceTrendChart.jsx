import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart, Legend,
} from "recharts";
import { useTransactions } from "../../hooks/useTransactions";
import { groupByMonth, formatCurrency } from "../../utils/helpers";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      padding: "12px 16px",
      boxShadow: "var(--shadow-md)",
      fontSize: "0.82rem",
    }}>
      <p style={{ fontWeight: 600, marginBottom: 6, color: "var(--text-primary)" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function BalanceTrendChart() {
  const { transactions } = useTransactions();
  const data = groupByMonth(transactions);

  return (
    <div className="chart-card">
      <div className="section-header">
        <div>
          <div className="section-title">Balance Trend</div>
          <div className="section-sub">Monthly income vs expenses</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--income-color)"  stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--income-color)"  stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--expense-color)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--expense-color)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "0.78rem", paddingTop: "12px" }}
            formatter={(val) => <span style={{ color: "var(--text-secondary)" }}>{val}</span>}
          />
          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="var(--income-color)"
            strokeWidth={2}
            fill="url(#incomeGrad)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="expense"
            name="Expenses"
            stroke="var(--expense-color)"
            strokeWidth={2}
            fill="url(#expenseGrad)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
