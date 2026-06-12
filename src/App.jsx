import { FinanceProvider } from "./context/FinanceContext";
import AppLayout from "./components/layout/AppLayout";

export default function App() {
  return (
    <FinanceProvider>
      <AppLayout />
    </FinanceProvider>
  );
}
