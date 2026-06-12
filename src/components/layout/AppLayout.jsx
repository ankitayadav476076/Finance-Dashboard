import { useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DashboardPage from "../../pages/DashboardPage";
import TransactionsPage from "../../pages/TransactionsPage";
import InsightsPage from "../../pages/InsightsPage";

export default function AppLayout() {
  const { state } = useFinance();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function renderPage() {
    switch (state.activePage) {
      case "dashboard":     return <DashboardPage />;
      case "transactions":  return <TransactionsPage />;
      case "insights":      return <InsightsPage />;
      default:              return <DashboardPage />;
    }
  }

  const pageTitles = {
    dashboard:    { title: "Dashboard",    sub: "Your financial overview" },
    transactions: { title: "Transactions", sub: "Manage your income & expenses" },
    insights:     { title: "Insights",     sub: "Understand your spending patterns" },
  };

  const current = pageTitles[state.activePage] || pageTitles.dashboard;

  return (
    <div className="app-layout">
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Topbar
          title={current.title}
          sub={current.sub}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="page-content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
