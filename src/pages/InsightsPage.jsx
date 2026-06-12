import InsightCards from "../components/insights/InsightCards";
import MonthlyComparison from "../components/insights/MonthlyComparison";
import CategoryBreakdown from "../components/insights/CategoryBreakdown";
import SpendingPieChart from "../components/charts/SpendingPieChart";

export default function InsightsPage() {
  return (
    <div className="animate-fade">
      {/* KPI insight cards */}
      <InsightCards />

      {/* Charts row */}
      <div className="charts-grid" style={{ marginBottom: 24 }}>
        <MonthlyComparison />
        <SpendingPieChart />
      </div>

      {/* Full-width category bar chart */}
      <CategoryBreakdown />
    </div>
  );
}
