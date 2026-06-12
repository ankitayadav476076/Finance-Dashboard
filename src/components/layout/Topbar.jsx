import { useFinance } from "../../context/FinanceContext";

export default function Topbar({ title, sub, onMenuClick }) {
  const { state } = useFinance();
  const now = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button className="hamburger" onClick={onMenuClick} aria-label="Open menu">
          <span /><span /><span />
        </button>
        <div className="topbar-left">
          <h2>{title}</h2>
          <p>{sub}</p>
        </div>
      </div>

      <div className="topbar-right">
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{now}</span>
        <span className={`role-badge ${state.role}`} style={{ fontSize: "0.72rem" }}>
          {state.role === "admin" ? "✦ Admin" : "◉ Viewer"}
        </span>
      </div>
    </header>
  );
}
