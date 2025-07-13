import { DollarSign, LineChart, TrendingDown, TrendingUp } from "lucide-react";
import { useAuth } from "../../hooks/auth";
import { Header } from "../header/Header";
import { Navigation } from "../navigation/Navigation";
import {
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { format } from "date-fns";
import { useUser } from "../../hooks/user";
import { TimeFrameSelector } from "./time-frame-selector/TimeFrameSelector";
import { MoneyPockets } from "./money-pockets/MoneyPockets";
import classes from "./Dashboard.module.scss";

export const Dashboard = () => {
  const { userId } = useAuth();
  const user = useUser(userId);
  console.log("user", user);

  const balance = 0;
  interface Widget {
    id: string;
    type:
      | "top-categories"
      | "largest-expenses"
      | "savings-rate"
      | "spending-trend"
      | "budget-alerts";
    title: string;
    enabled: boolean;
    order: number;
  }
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: "1",
      type: "top-categories",
      title: "Top Spending Categories",
      enabled: true,
      order: 1,
    },
    {
      id: "2",
      type: "largest-expenses",
      title: "Largest Expenses",
      enabled: true,
      order: 2,
    },
    {
      id: "3",
      type: "savings-rate",
      title: "Savings Rate",
      enabled: true,
      order: 3,
    },
    {
      id: "4",
      type: "spending-trend",
      title: "Spending Trend",
      enabled: true,
      order: 4,
    },
    {
      id: "5",
      type: "budget-alerts",
      title: "Budget Alerts",
      enabled: true,
      order: 5,
    },
  ]);
  /* const monthlyData = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      const dayTransactions = transactions.filter(
        (t) => format(t.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      );
      const income = dayTransactions
        .filter((t) => t.type === "income")
        .reduce(
          (sum, t) =>
            sum + convertCurrency(t.amount, t.currency, selectedCurrency),
          0
        );
      const expenses = dayTransactions
        .filter((t) => t.type === "expense")
        .reduce(
          (sum, t) =>
            sum + convertCurrency(t.amount, t.currency, selectedCurrency),
          0
        );
  
      return {
        date: format(date, "MMM dd"),
        income,
        expenses,
      };
    });
   */

  return (
    <div>
      <Header />
      <Navigation />
      <div className={classes.dashboardContentContainer}>
        <TimeFrameSelector
          onSelect={(value) => {
            console.log("onselect called with", value);
          }}
        />
        {user?.moneyPockets && (
          <MoneyPockets moneyPockets={user?.moneyPockets} />
        )}
      </div>
      <div className="overview">
        {/* Balance Cards */}
        <div className="balance-cards">
          <div className="balance-card">
            <div className="balance-icon income">
              <TrendingUp size={24} />
            </div>
            <div className="balance-info">
              <h3>Total Income</h3>
              <p className="balance-amount income">
                {/*  {formatCurrency(totalIncome)} */}
              </p>
            </div>
          </div>

          <div className="balance-card">
            <div className="balance-icon expense">
              <TrendingDown size={24} />
            </div>
            <div className="balance-info">
              <h3>Total Expenses</h3>
              <p className="balance-amount expense">
                {/* {formatCurrency(totalExpenses)} */}
              </p>
            </div>
          </div>

          <div className="balance-card">
            <div className="balance-icon balance">
              <DollarSign size={24} />
            </div>
            <div className="balance-info">
              <h3>Balance</h3>
              <p
                className={`balance-amount ${
                  balance >= 0 ? "income" : "expense"
                }`}
              >
                {/* {formatCurrency(balance)} */}
              </p>
            </div>
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="widgets-grid">
          <p>widgets</p>
          {/*   {widgets
            .filter((w) => w.enabled)
            .sort((a, b) => a.order - b.order)
            .map(renderWidget)} */}
        </div>

        {/* Spending Trend */}
        <div className="chart-container">
          <h3>Spending Trend (Last 30 Days)</h3>
          {/*  <ResponsiveContainer width="100%" height={300}>
            <LineChart data={{}}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#EF4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer> */}
        </div>

        {/* Recent Transactions */}
        <div className="recent-transactions">
          <h3>Recent Transactions</h3>
          <div className="transactions-list">
            {/* {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-category">
                    {categories.find((c) => c.name === transaction.category)
                      ?.icon || "📊"}
                  </div>
                  <div className="transaction-details">
                    <h4>{transaction.description}</h4>
                    <p>{transaction.category}</p>
                  </div>
                </div>
                <div className="transaction-amount">
                  <span className={transaction.type}>
                    {transaction.type === "income" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </span>
                  <button
                    className="delete-button"
                     onClick={() => deleteTransaction(transaction.id)} 
                  >
                    ×
                  </button>
                </div>
              </div>
            ))} */}
            {/* {recentTransactions.length === 0 && (
              <p className="no-transactions">
                No transactions yet. Add your first transaction!
              </p>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};
