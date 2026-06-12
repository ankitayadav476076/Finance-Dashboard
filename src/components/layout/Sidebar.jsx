import { useFinance } from "../../context/FinanceContext";

const NAV_ITEMS = [
  { id: "dashboard",    icon: "◈", label: "Dashboard"    },
  { id: "transactions", icon: "⇄", label: "Transactions" },
  { id: "insights",     icon: "◎", label: "Insights"     },
];

export default function Sidebar({ isOpen, onClose }) {
  const { state, dispatch } = useFinance();

  function navigate(page) {
    dispatch({ type: "SET_PAGE", payload: page });
    onClose();
  }

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-logo">
        <h1>Fin<span>Flow</span></h1>
        <p>Finance Dashboard</p>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${state.activePage === item.id ? "active" : ""}`}
            onClick={() => navigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {/* Role selector */}
        <div className="role-selector">
          <label>Access Role</label>
          <select
            className="role-select"
            value={state.role}
            onChange={(e) => dispatch({ type: "SET_ROLE", payload: e.target.value })}
          >
            <option value="admin">🔑 Admin</option>
            <option value="viewer">👁 Viewer</option>
          </select>
          <div>
            <span className={`role-badge ${state.role}`}>
              {state.role === "admin" ? "✦ Admin Access" : "◉ View Only"}
            </span>
          </div>
        </div>

        {/* Dark mode toggle */}
        <button className="dark-toggle" onClick={() => dispatch({ type: "TOGGLE_DARK" })}>
          <span>{state.darkMode ? "☽ Dark Mode" : "☀ Light Mode"}</span>
          <div className={`toggle-pill ${state.darkMode ? "on" : ""}`} />
        </button>
      </div>
    </aside>
  );
}
