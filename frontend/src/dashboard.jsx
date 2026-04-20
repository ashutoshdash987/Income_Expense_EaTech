import { useEffect, useState } from "react";
import API from "./api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");

  const fetchTransactions = async () => {
    const res = await API.get("/transactions");
    setTransactions(res.data);
  };

  const fetchSummary = async () => {
    const res = await API.get("/summary");
    setSummary(res.data);
  };

  const addTransaction = async () => {
    if (!amount) return;

    await API.post("/transactions", {
      type,
      amount: Number(amount),
      category
    });

    setAmount("");
    fetchTransactions();
    fetchSummary();
  };

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, []);

  // 🔥 Data for charts
  const incomeExpenseData = summary
    ? [
        { name: "Income", value: summary.total_income },
        { name: "Expense", value: summary.total_expense }
      ]
    : [];

  const categoryData = summary
    ? Object.entries(summary.category_breakdown).map(([key, value]) => ({
        name: key,
        value
      }))
    : [];

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
      
      <h2>Dashboard</h2>

      {/* Summary */}
      {summary && (
        <div>
          <h3>Balance: ₹{summary.balance}</h3>
          <p>Income: ₹{summary.total_income}</p>
          <p>Expense: ₹{summary.total_expense}</p>
        </div>
      )}

      <hr />

      {/* Charts */}
      {summary && (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          
          {/* Income vs Expense */}
          <div>
            <h4>Income vs Expense</h4>
            <PieChart width={250} height={250}>
              <Pie
                data={incomeExpenseData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
              >
                <Cell fill="green" />
                <Cell fill="red" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          {/* Category Breakdown */}
          <div>
            <h4>Category Breakdown</h4>
            <PieChart width={250} height={250}>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={`hsl(${index * 60}, 70%, 50%)`} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

        </div>
      )}

      <hr />

      {/* Add Transaction */}
      <h4>Add Transaction</h4>

      <select onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select onChange={(e) => setCategory(e.target.value)}>
        <option>Food</option>
        <option>Salary</option>
        <option>Rent</option>
        <option>Transport</option>
        <option>Entertainment</option>
      </select>

      <button onClick={addTransaction}>Add</button>

      <hr />

      {/* Transactions */}
      <h4>Transactions</h4>

      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.category} - ₹{t.amount} ({t.type})
          </li>
        ))}
      </ul>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
}