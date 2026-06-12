import { useMemo } from "react";
import { useFinance } from "../context/FinanceContext";
import { applyFilters } from "../utils/helpers";

export function useTransactions() {
  const { state, dispatch } = useFinance();
  const { transactions, filters } = state;

  const filtered = useMemo(
    () => applyFilters(transactions, filters),
    [transactions, filters]
  );

  const totalIncome  = useMemo(() => transactions.filter(t => t.type === "income" ).reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0), [transactions]);
  const balance      = totalIncome - totalExpense;

  function addTransaction(tx) {
    dispatch({ type: "ADD_TRANSACTION", payload: tx });
  }
  function updateTransaction(tx) {
    dispatch({ type: "UPDATE_TRANSACTION", payload: tx });
  }
  function deleteTransaction(id) {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  }
  function setFilter(payload) {
    dispatch({ type: "SET_FILTER", payload });
  }

  return {
    transactions,
    filtered,
    totalIncome,
    totalExpense,
    balance,
    filters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setFilter,
  };
}
