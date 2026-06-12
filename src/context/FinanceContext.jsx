import { createContext, useContext, useReducer, useEffect } from "react";
import { mockTransactions } from "../data/mockData";

const FinanceContext = createContext(null);

const STORAGE_KEY = "finflow_transactions";
const ROLE_KEY    = "finflow_role";
const THEME_KEY   = "finflow_theme";

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const initialState = {
  transactions: loadFromStorage(STORAGE_KEY, mockTransactions),
  role:         loadFromStorage(ROLE_KEY,    "admin"),
  darkMode:     loadFromStorage(THEME_KEY,   false),
  filters: {
    search: "",
    type:   "all",
    sortBy: "date",
    sortDir:"desc",
  },
  activePage: "dashboard",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, activePage: action.payload };

    case "SET_ROLE":
      return { ...state, role: action.payload };

    case "TOGGLE_DARK":
      return { ...state, darkMode: !state.darkMode };

    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions] };

    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };

    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, JSON.stringify(state.role));
  }, [state.role]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, JSON.stringify(state.darkMode));
    document.documentElement.setAttribute("data-theme", state.darkMode ? "dark" : "light");
  }, [state.darkMode]);

  return (
    <FinanceContext.Provider value={{ state, dispatch }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}
