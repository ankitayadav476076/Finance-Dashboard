import TransactionControls from "../components/transactions/TransactionControls";
import TransactionTable from "../components/transactions/TransactionTable";

export default function TransactionsPage() {
  return (
    <div className="card animate-fade">
      <div className="section-header" style={{ marginBottom: 20 }}>
        <div>
          <div className="section-title">All Transactions</div>
          <div className="section-sub">Search, filter and manage your financial records</div>
        </div>
      </div>
      <TransactionControls />
      <TransactionTable />
    </div>
  );
}
