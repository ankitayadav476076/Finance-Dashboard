import { useState } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import { useFinance } from "../../context/FinanceContext";
import { formatCurrency, formatDate } from "../../utils/helpers";
import { CATEGORY_COLORS } from "../../data/mockData";
import TransactionModal from "./TransactionModal";

export default function TransactionTable({ limit }) {
  const { filtered, deleteTransaction, setFilter, filters } = useTransactions();
  const { state } = useFinance();
  const isAdmin = state.role === "admin";

  const [editTx, setEditTx] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const rows = limit ? filtered.slice(0, limit) : filtered;

  function toggleSort(field) {
    if (filters.sortBy === field) {
      setFilter({ sortDir: filters.sortDir === "asc" ? "desc" : "asc" });
    } else {
      setFilter({ sortBy: field, sortDir: "desc" });
    }
  }

  function sortArrow(field) {
    if (filters.sortBy !== field) return " ⇅";
    return filters.sortDir === "asc" ? " ↑" : " ↓";
  }

  function handleDelete(id) {
    if (deleteConfirm === id) {
      deleteTransaction(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  }

  if (rows.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⇄</div>
        <h3>No transactions found</h3>
        <p>Try adjusting your search or filters, or add a new transaction.</p>
      </div>
    );
  }

  return (
    <>
      <div className="transactions-table-wrap">
        <table className="transactions-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort("date")}>Date{sortArrow("date")}</th>
              <th>Description</th>
              <th>Category</th>
              <th onClick={() => toggleSort("amount")}>Amount{sortArrow("amount")}</th>
              <th>Type</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((tx) => (
              <tr key={tx.id}>
                <td className="tx-date">{formatDate(tx.date)}</td>
                <td className="tx-description">{tx.description}</td>
                <td>
                  <span
                    className="category-chip"
                    style={{
                      background: (CATEGORY_COLORS[tx.category] || "#888") + "22",
                      color: CATEGORY_COLORS[tx.category] || "var(--text-secondary)",
                    }}
                  >
                    {tx.category}
                  </span>
                </td>
                <td className={`amount-cell ${tx.type}`}>
                  {tx.type === "income" ? "+" : "−"}{formatCurrency(tx.amount)}
                </td>
                <td>
                  <span className={`type-badge ${tx.type}`}>
                    {tx.type === "income" ? "↑ Income" : "↓ Expense"}
                  </span>
                </td>
                {isAdmin && (
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn btn-icon btn-secondary"
                        title="Edit"
                        onClick={() => { setEditTx(tx); setShowModal(true); }}
                      >✎</button>
                      <button
                        className={`btn btn-icon ${deleteConfirm === tx.id ? "btn-danger" : "btn-secondary"}`}
                        title={deleteConfirm === tx.id ? "Click again to confirm" : "Delete"}
                        onClick={() => handleDelete(tx.id)}
                      >
                        {deleteConfirm === tx.id ? "!" : "✕"}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <TransactionModal
          existing={editTx}
          onClose={() => { setShowModal(false); setEditTx(null); }}
        />
      )}
    </>
  );
}
