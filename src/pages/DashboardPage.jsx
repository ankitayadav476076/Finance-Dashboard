import SummaryCards from "../components/charts/SummaryCards";
import BalanceTrendChart from "../components/charts/BalanceTrendChart";
import SpendingPieChart from "../components/charts/SpendingPieChart";
import TransactionControls from "../components/transactions/TransactionControls";
import TransactionTable from "../components/transactions/TransactionTable";
import { useFinance } from "../context/FinanceContext";

export default function DashboardPage() {
  const { dispatch } = useFinance();

  return (
    <div>
      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts */}
      <div className="charts-grid">
        <BalanceTrendChart />
        <SpendingPieChart />
      </div>

      {/* Recent Transactions */}
      <div className="card" style={{ marginTop: 0 }}>
        <div className="section-header">
          <div>
            <div className="section-title">Recent Transactions</div>
            <div className="section-sub">Your latest financial activity</div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => dispatch({ type: "SET_PAGE", payload: "transactions" })}
          >
            View All →
          </button>
        </div>
        <TransactionControls />
        <TransactionTable limit={8} />
      </div>
    </div>
  );
}
