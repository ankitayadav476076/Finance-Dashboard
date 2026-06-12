import { useState } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import { useFinance } from "../../context/FinanceContext";
import TransactionModal from "./TransactionModal";

export default function TransactionControls() {
  const { filters, setFilter, filtered } = useTransactions();
  const { state } = useFinance();
  const isAdmin = state.role === "admin";
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="transactions-controls">
        {/* Search */}
        <div className="search-input-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            placeholder="Search by description or category…"
            value={filters.search}
            onChange={e => setFilter({ search: e.target.value })}
          />
        </div>

        {/* Type filter */}
        <select
          className="filter-select"
          value={filters.type}
          onChange={e => setFilter({ type: e.target.value })}
        >
          <option value="all">All Types</option>
          <option value="income">Income Only</option>
          <option value="expense">Expenses Only</option>
        </select>

        {/* Sort buttons */}
        <button
          className={`sort-btn ${filters.sortBy === "date" ? "active" : ""}`}
          onClick={() => setFilter({
            sortBy: "date",
            sortDir: filters.sortBy === "date" && filters.sortDir === "desc" ? "asc" : "desc"
          })}
        >
          Date {filters.sortBy === "date" ? (filters.sortDir === "asc" ? "↑" : "↓") : "⇅"}
        </button>

        <button
          className={`sort-btn ${filters.sortBy === "amount" ? "active" : ""}`}
          onClick={() => setFilter({
            sortBy: "amount",
            sortDir: filters.sortBy === "amount" && filters.sortDir === "desc" ? "asc" : "desc"
          })}
        >
          Amount {filters.sortBy === "amount" ? (filters.sortDir === "asc" ? "↑" : "↓") : "⇅"}
        </button>

        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>

        {/* Admin: Add button */}
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Transaction
          </button>
        )}
      </div>

      {showModal && (
        <TransactionModal existing={null} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
