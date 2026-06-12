import { useState, useEffect } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import { generateId, formatDate } from "../../utils/helpers";
import { CATEGORIES } from "../../data/mockData";

const EMPTY = {
  description: "",
  amount: "",
  category: "Food",
  type: "expense",
  date: new Date().toISOString().split("T")[0],
};

export default function TransactionModal({ existing, onClose }) {
  const { addTransaction, updateTransaction } = useTransactions();
  const [form, setForm] = useState(existing ? { ...existing, amount: String(existing.amount) } : EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = "Enter a valid amount";
    if (!form.date) errs.date = "Date is required";
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const tx = {
      ...form,
      amount: Number(form.amount),
      id: existing ? existing.id : generateId(),
      category: form.type === "income" ? "Income" : form.category,
    };

    if (existing) updateTransaction(tx);
    else          addTransaction(tx);
    onClose();
  }

  const expenseCategories = CATEGORIES.filter(c => c !== "Income");

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{existing ? "Edit Transaction" : "New Transaction"}</h3>
          <button className="btn btn-icon btn-secondary" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Type toggle */}
          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="type-toggle">
              <button
                className={`type-toggle-btn ${form.type === "income" ? "active income" : ""}`}
                onClick={() => set("type", "income")}
              >↑ Income</button>
              <button
                className={`type-toggle-btn ${form.type === "expense" ? "active expense" : ""}`}
                onClick={() => set("type", "expense")}
              >↓ Expense</button>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              className="form-input"
              placeholder="e.g. Monthly salary, Grocery shopping…"
              value={form.description}
              onChange={e => set("description", e.target.value)}
            />
            {errors.description && <span style={{ fontSize: "0.75rem", color: "var(--expense-color)" }}>{errors.description}</span>}
          </div>

          <div className="form-row">
            {/* Amount */}
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                className="form-input"
                type="number"
                placeholder="0"
                min="0"
                value={form.amount}
                onChange={e => set("amount", e.target.value)}
              />
              {errors.amount && <span style={{ fontSize: "0.75rem", color: "var(--expense-color)" }}>{errors.amount}</span>}
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={form.date}
                onChange={e => set("date", e.target.value)}
              />
              {errors.date && <span style={{ fontSize: "0.75rem", color: "var(--expense-color)" }}>{errors.date}</span>}
            </div>
          </div>

          {/* Category (only for expense) */}
          {form.type === "expense" && (
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={form.category}
                onChange={e => set("category", e.target.value)}
              >
                {expenseCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {existing ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
