import { useEffect, useState } from 'react';
import { endOfMonth, format, startOfMonth, subDays } from 'date-fns';
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  FileText,
  Home,
  Moon,
  Paperclip,
  PieChart,
  Plus,
  Settings,
  Sun,
  Target,
  TrendingDown,
  TrendingUp,
  Upload,
} from 'lucide-react';
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Header } from './components/header/Header';
import { Navigation } from './components/navigation/Navigation';
import './App.css';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  parentRecurringId?: string; // Link to recurring template if generated
  currency: string;
  notes?: string;
  attachments?: Attachment[];
}

interface RecurringTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate?: Date;
  currency: string;
}

interface BudgetGoal {
  id: string;
  category: string;
  amount: number;
  period: 'weekly' | 'monthly';
  startDate: Date;
  currency: string;
}

interface Category {
  name: string;
  color: string;
  icon: string;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // Base64 encoded file data
}

interface Widget {
  id: string;
  type: 'top-categories' | 'largest-expenses' | 'savings-rate' | 'spending-trend' | 'budget-alerts';
  title: string;
  enabled: boolean;
  order: number;
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

// Mock exchange rates (in real app, fetch from API)
const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.5,
  CAD: 1.25,
  AUD: 1.35,
};

const categories: Category[] = [
  { name: 'Food & Dining', color: '#FF6B6B', icon: '🍽️' },
  { name: 'Transportation', color: '#4ECDC4', icon: '🚗' },
  { name: 'Shopping', color: '#45B7D1', icon: '🛍️' },
  { name: 'Entertainment', color: '#96CEB4', icon: '🎬' },
  { name: 'Healthcare', color: '#FFEAA7', icon: '🏥' },
  { name: 'Utilities', color: '#DDA0DD', icon: '⚡' },
  { name: 'Salary', color: '#98D8C8', icon: '💰' },
  { name: 'Freelance', color: '#F7DC6F', icon: '💼' },
];

const App = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'analytics' | 'recurring'>('overview');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    category: '',
    type: '' as '' | 'income' | 'expense',
    minAmount: '',
    maxAmount: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    isRecurring: false,
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly',
    endDate: '',
    currency: 'USD',
    notes: '',
    attachments: [] as Attachment[],
  });
  const [newBudgetGoal, setNewBudgetGoal] = useState({
    category: '',
    amount: '',
    period: 'monthly' as 'weekly' | 'monthly',
    currency: 'USD',
  });
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: '1',
      type: 'top-categories',
      title: 'Top Spending Categories',
      enabled: true,
      order: 1,
    },
    {
      id: '2',
      type: 'largest-expenses',
      title: 'Largest Expenses',
      enabled: true,
      order: 2,
    },
    {
      id: '3',
      type: 'savings-rate',
      title: 'Savings Rate',
      enabled: true,
      order: 3,
    },
    {
      id: '4',
      type: 'spending-trend',
      title: 'Spending Trend',
      enabled: true,
      order: 4,
    },
    {
      id: '5',
      type: 'budget-alerts',
      title: 'Budget Alerts',
      enabled: true,
      order: 5,
    },
  ]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('budgetr-transactions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setTransactions(parsed.map((t: any) => ({ ...t, date: new Date(t.date) })));
    }
    const savedRecurring = localStorage.getItem('budgetr-recurring');
    if (savedRecurring) {
      const parsed = JSON.parse(savedRecurring);
      setRecurring(
        parsed.map((r: any) => ({
          ...r,
          startDate: new Date(r.startDate),
          endDate: r.endDate ? new Date(r.endDate) : undefined,
        })),
      );
    }
    const savedBudgets = localStorage.getItem('budgetr-goals');
    if (savedBudgets) {
      const parsed = JSON.parse(savedBudgets);
      setBudgetGoals(parsed.map((b: any) => ({ ...b, startDate: new Date(b.startDate) })));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('budgetr-transactions', JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem('budgetr-recurring', JSON.stringify(recurring));
  }, [recurring]);
  useEffect(() => {
    localStorage.setItem('budgetr-goals', JSON.stringify(budgetGoals));
  }, [budgetGoals]);

  // Auto-generate recurring transactions for today
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const newTxs: Transaction[] = [];
    recurring.forEach((r) => {
      const lastDate = r.startDate;
      if (r.endDate && r.endDate < new Date()) return;
      let shouldAdd = false;
      switch (r.frequency) {
        case 'daily':
          shouldAdd = format(new Date(), 'yyyy-MM-dd') >= format(r.startDate, 'yyyy-MM-dd') && (!r.endDate || format(new Date(), 'yyyy-MM-dd') <= format(r.endDate, 'yyyy-MM-dd'));
          break;
        case 'weekly': {
          const diff = Math.floor((new Date().getTime() - r.startDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
          shouldAdd = diff >= 0 && (!r.endDate || new Date() <= r.endDate);
          break;
        }
        case 'monthly': {
          const start = r.startDate;
          const now = new Date();
          shouldAdd =
            (now.getFullYear() > start.getFullYear() || (now.getFullYear() === start.getFullYear() && now.getMonth() >= start.getMonth())) && (!r.endDate || now <= r.endDate);
          break;
        }
      }
      // Only add if not already present for today
      if (shouldAdd && !transactions.some((t) => t.parentRecurringId === r.id && format(t.date, 'yyyy-MM-dd') === today)) {
        newTxs.push({
          id: Date.now().toString() + Math.random(),
          type: r.type,
          amount: r.amount,
          category: r.category,
          description: r.description + ' (Recurring)',
          date: new Date(),
          parentRecurringId: r.id,
          currency: r.currency,
        });
      }
    });
    if (newTxs.length > 0) setTransactions((txs) => [...newTxs, ...txs]);
    // eslint-disable-next-line
  }, [recurring]);

  // Load currency preference
  useEffect(() => {
    const savedCurrency = localStorage.getItem('budgetr-currency');
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  // Save currency preference
  /*   useEffect(() => {
    localStorage.setItem("budgetr-currency", selectedCurrency);
  }, [selectedCurrency]);
 */

  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    const usdAmount = amount / exchangeRates[fromCurrency];
    return usdAmount * exchangeRates[toCurrency];
  };
  /* 
  const formatCurrency = (
    amount: number,
    currency: string = selectedCurrency
  ): string => {
    const symbol = currencies.find((c) => c.code === currency)?.symbol || "$";
    return `${symbol}${amount.toFixed(2)}`;
  }; */

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const attachment: Attachment = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target?.result as string,
        };
        setNewTransaction({
          ...newTransaction,
          attachments: [...newTransaction.attachments, attachment],
        });
      };
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  };

  const removeAttachment = (attachmentId: string) => {
    setNewTransaction({
      ...newTransaction,
      attachments: newTransaction.attachments.filter((a) => a.id !== attachmentId),
    });
  };

  const downloadAttachment = (attachment: Attachment) => {
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    link.click();
  };

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category || !newTransaction.description) return;
    if (newTransaction.isRecurring) {
      const rec: RecurringTransaction = {
        id: Date.now().toString(),
        type: newTransaction.type,
        amount: parseFloat(newTransaction.amount),
        category: newTransaction.category,
        description: newTransaction.description,
        frequency: newTransaction.frequency,
        startDate: new Date(),
        endDate: newTransaction.endDate ? new Date(newTransaction.endDate) : undefined,
        currency: newTransaction.currency,
      };
      setRecurring([rec, ...recurring]);
    } else {
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: newTransaction.type,
        amount: parseFloat(newTransaction.amount),
        category: newTransaction.category,
        description: newTransaction.description,
        date: new Date(),
        currency: newTransaction.currency,
        notes: newTransaction.notes || undefined,
        attachments: newTransaction.attachments.length > 0 ? newTransaction.attachments : undefined,
      };
      setTransactions([transaction, ...transactions]);
    }
    setNewTransaction({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      isRecurring: false,
      frequency: 'monthly',
      endDate: '',
      currency: selectedCurrency,
      notes: '',
      attachments: [],
    });
    setShowAddModal(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, selectedCurrency), 0);

  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, selectedCurrency), 0);

  const balance = totalIncome - totalExpenses;

  const monthlyData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dayTransactions = transactions.filter((t) => format(t.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
    const income = dayTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, selectedCurrency), 0);
    const expenses = dayTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, selectedCurrency), 0);

    return {
      date: format(date, 'MMM dd'),
      income,
      expenses,
    };
  });

  const categoryData = categories
    .map((category) => {
      const total = transactions
        .filter((t) => t.category === category.name && t.type === 'expense')
        .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, selectedCurrency), 0);
      return { name: category.name, value: total, color: category.color };
    })
    .filter((item) => item.value > 0);

  const recentTransactions = transactions.slice(0, 5);

  const addBudgetGoal = () => {
    if (!newBudgetGoal.category || !newBudgetGoal.amount) return;
    const goal: BudgetGoal = {
      id: Date.now().toString(),
      category: newBudgetGoal.category,
      amount: parseFloat(newBudgetGoal.amount),
      period: newBudgetGoal.period,
      startDate: new Date(),
      currency: newBudgetGoal.currency,
    };
    setBudgetGoals([goal, ...budgetGoals]);
    setNewBudgetGoal({
      category: '',
      amount: '',
      period: 'monthly',
      currency: selectedCurrency,
    });
    setShowBudgetModal(false);
  };

  const getBudgetProgress = (category: string, period: 'weekly' | 'monthly') => {
    const now = new Date();
    const start = period === 'weekly' ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) : new Date(now.getFullYear(), now.getMonth(), 1);

    const spent = transactions
      .filter((t) => t.category === category && t.type === 'expense' && t.date >= start)
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, selectedCurrency), 0);

    return spent;
  };

  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Date range filter
    if (filters.startDate && transaction.date < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && transaction.date > new Date(filters.endDate)) {
      return false;
    }

    // Category filter
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }

    // Type filter
    if (filters.type && transaction.type !== filters.type) {
      return false;
    }

    // Amount range filter
    if (filters.minAmount && transaction.amount < parseFloat(filters.minAmount)) {
      return false;
    }
    if (filters.maxAmount && transaction.amount > parseFloat(filters.maxAmount)) {
      return false;
    }

    return true;
  });

  const clearFilters = () => {
    setFilters({
      search: '',
      startDate: '',
      endDate: '',
      category: '',
      type: '',
      minAmount: '',
      maxAmount: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== '');

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const csvContent = [headers.join(','), ...transactions.map((t) => [format(t.date, 'yyyy-MM-dd'), t.type, t.category, `"${t.description}"`, t.amount].join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budgetr-transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleWidget = (widgetId: string) => {
    setWidgets(widgets.map((w) => (w.id === widgetId ? { ...w, enabled: !w.enabled } : w)));
  };

  const reorderWidgets = (fromIndex: number, toIndex: number) => {
    const newWidgets = [...widgets];
    const [movedWidget] = newWidgets.splice(fromIndex, 1);
    newWidgets.splice(toIndex, 0, movedWidget);
    setWidgets(newWidgets.map((w, i) => ({ ...w, order: i + 1 })));
  };

  const getTopCategories = () => {
    const categoryTotals = categories
      .map((category) => {
        const total = transactions
          .filter((t) => t.category === category.name && t.type === 'expense')
          .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, selectedCurrency), 0);
        return { ...category, total };
      })
      .filter((c) => c.total > 0);

    return categoryTotals.sort((a, b) => b.total - a.total).slice(0, 5);
  };

  const getLargestExpenses = () =>
    transactions
      .filter((t) => t.type === 'expense')
      .sort((a, b) => convertCurrency(b.amount, b.currency, selectedCurrency) - convertCurrency(a.amount, a.currency, selectedCurrency))
      .slice(0, 5);

  const getSavingsRate = () => {
    if (totalIncome === 0) return 0;
    return ((totalIncome - totalExpenses) / totalIncome) * 100;
  };

  const getBudgetAlerts = () =>
    budgetGoals
      .map((goal) => {
        const spent = getBudgetProgress(goal.category, goal.period);
        const percentage = (spent / goal.amount) * 100;
        return { goal, spent, percentage };
      })
      .filter((alert) => alert.percentage > 80)
      .sort((a, b) => b.percentage - a.percentage);

  const renderWidget = (widget: Widget) => {
    if (!widget.enabled) return null;

    switch (widget.type) {
      case 'top-categories':
        const topCategories = getTopCategories();
        return (
          <div
            key={widget.id}
            className='widget top-categories-widget'
          >
            <div className='widget-header'>
              <h3>{widget.title}</h3>
              <button
                className='widget-toggle'
                onClick={() => toggleWidget(widget.id)}
              >
                ×
              </button>
            </div>
            <div className='widget-content'>
              {topCategories.map((category, index) => (
                <div
                  key={category.name}
                  className='category-item'
                >
                  <div className='category-rank'>#{index + 1}</div>
                  <div className='category-icon'>{category.icon}</div>
                  <div className='category-name'>{category.name}</div>
                  <div className='category-amount'>{/* {formatCurrency(category.total)} */}</div>
                </div>
              ))}
              {topCategories.length === 0 && <p className='no-data'>No spending data available</p>}
            </div>
          </div>
        );

      case 'largest-expenses':
        const largestExpenses = getLargestExpenses();
        return (
          <div
            key={widget.id}
            className='widget largest-expenses-widget'
          >
            <div className='widget-header'>
              <h3>{widget.title}</h3>
              <button
                className='widget-toggle'
                onClick={() => toggleWidget(widget.id)}
              >
                ×
              </button>
            </div>
            <div className='widget-content'>
              {largestExpenses.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className='expense-item'
                >
                  <div className='expense-rank'>#{index + 1}</div>
                  <div className='expense-icon'>{categories.find((c) => c.name === transaction.category)?.icon || '📊'}</div>
                  <div className='expense-details'>
                    <div className='expense-description'>{transaction.description}</div>
                    <div className='expense-category'>{transaction.category}</div>
                  </div>
                  <div className='expense-amount'>{/*  {formatCurrency(transaction.amount, transaction.currency)} */}</div>
                </div>
              ))}
              {largestExpenses.length === 0 && <p className='no-data'>No expenses recorded</p>}
            </div>
          </div>
        );

      case 'savings-rate':
        const savingsRate = getSavingsRate();
        return (
          <div
            key={widget.id}
            className='widget savings-rate-widget'
          >
            <div className='widget-header'>
              <h3>{widget.title}</h3>
              <button
                className='widget-toggle'
                onClick={() => toggleWidget(widget.id)}
              >
                ×
              </button>
            </div>
            <div className='widget-content'>
              <div className='savings-rate-display'>
                <div className='savings-rate-circle'>
                  <div className='savings-rate-value'>{savingsRate.toFixed(1)}%</div>
                  <div className='savings-rate-label'>Savings Rate</div>
                </div>
                <div className='savings-breakdown'>
                  <div className='breakdown-item'>
                    <span>Income:</span>
                    <span>{/* {formatCurrency(totalIncome)} */}</span>
                  </div>
                  <div className='breakdown-item'>
                    <span>Expenses:</span>
                    <span>{/* {formatCurrency(totalExpenses)} */}</span>
                  </div>
                  <div className='breakdown-item total'>
                    <span>Saved:</span>
                    <span>{/* {formatCurrency(totalIncome - totalExpenses)} */}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'budget-alerts':
        const budgetAlerts = getBudgetAlerts();
        return (
          <div
            key={widget.id}
            className='widget budget-alerts-widget'
          >
            <div className='widget-header'>
              <h3>{widget.title}</h3>
              <button
                className='widget-toggle'
                onClick={() => toggleWidget(widget.id)}
              >
                ×
              </button>
            </div>
            <div className='widget-content'>
              {budgetAlerts.map((alert, index) => (
                <div
                  key={alert.goal.id}
                  className={`alert-item ${alert.percentage > 100 ? 'over' : 'warning'}`}
                >
                  <div className='alert-icon'>{alert.percentage > 100 ? <AlertTriangle size={16} /> : <Target size={16} />}</div>
                  <div className='alert-details'>
                    <div className='alert-category'>{alert.goal.category}</div>
                    <div className='alert-progress'>
                      {/* {formatCurrency(alert.spent)} /{" "}
                      {formatCurrency(alert.goal.amount)} */}
                    </div>
                  </div>
                  <div className='alert-percentage'>{alert.percentage.toFixed(0)}%</div>
                </div>
              ))}
              {budgetAlerts.length === 0 && <p className='no-data'>All budgets are on track!</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`app ${theme}`}>
      <Header />
      <Navigation />

      {/* Main Content */}
      <main className='main-content'>
        {activeTab === 'overview' && (
          <div className='overview'>
            {/* Balance Cards */}
            <div className='balance-cards'>
              <div className='balance-card'>
                <div className='balance-icon income'>
                  <TrendingUp size={24} />
                </div>
                <div className='balance-info'>
                  <h3>Total Income</h3>
                  <p className='balance-amount income'>{/*  {formatCurrency(totalIncome)} */}</p>
                </div>
              </div>

              <div className='balance-card'>
                <div className='balance-icon expense'>
                  <TrendingDown size={24} />
                </div>
                <div className='balance-info'>
                  <h3>Total Expenses</h3>
                  <p className='balance-amount expense'>{/* {formatCurrency(totalExpenses)} */}</p>
                </div>
              </div>

              <div className='balance-card'>
                <div className='balance-icon balance'>
                  <DollarSign size={24} />
                </div>
                <div className='balance-info'>
                  <h3>Balance</h3>
                  <p className={`balance-amount ${balance >= 0 ? 'income' : 'expense'}`}>{/* {formatCurrency(balance)} */}</p>
                </div>
              </div>
            </div>

            {/* Widgets Grid */}
            <div className='widgets-grid'>
              {widgets
                .filter((w) => w.enabled)
                .sort((a, b) => a.order - b.order)
                .map(renderWidget)}
            </div>

            {/* Spending Trend */}
            <div className='chart-container'>
              <h3>Spending Trend (Last 30 Days)</h3>
              <ResponsiveContainer
                width='100%'
                height={300}
              >
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='income'
                    stroke='#10B981'
                    strokeWidth={2}
                  />
                  <Line
                    type='monotone'
                    dataKey='expenses'
                    stroke='#EF4444'
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Transactions */}
            <div className='recent-transactions'>
              <h3>Recent Transactions</h3>
              <div className='transactions-list'>
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className='transaction-item'
                  >
                    <div className='transaction-info'>
                      <div className='transaction-category'>{categories.find((c) => c.name === transaction.category)?.icon || '📊'}</div>
                      <div className='transaction-details'>
                        <h4>{transaction.description}</h4>
                        <p>{transaction.category}</p>
                      </div>
                    </div>
                    <div className='transaction-amount'>
                      <span className={transaction.type}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </span>
                      <button
                        className='delete-button'
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {recentTransactions.length === 0 && <p className='no-transactions'>No transactions yet. Add your first transaction!</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className='transactions-page'>
            <div className='transactions-header'>
              <h2>All Transactions</h2>
              <div className='transactions-actions'>
                <button
                  className={`filter-button ${showFilters ? 'active' : ''}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Settings size={16} />
                  Filters
                </button>
                {hasActiveFilters && (
                  <button
                    className='clear-filters-button'
                    onClick={clearFilters}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className='filters-panel'>
                <div className='filters-grid'>
                  <div className='form-group'>
                    <label>Search</label>
                    <input
                      type='text'
                      placeholder='Search descriptions...'
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>

                  <div className='form-group'>
                    <label>Start Date</label>
                    <input
                      type='date'
                      value={filters.startDate}
                      onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    />
                  </div>

                  <div className='form-group'>
                    <label>End Date</label>
                    <input
                      type='date'
                      value={filters.endDate}
                      onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    />
                  </div>

                  <div className='form-group'>
                    <label>Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                      <option value=''>All Categories</option>
                      {categories.map((category) => (
                        <option
                          key={category.name}
                          value={category.name}
                        >
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='form-group'>
                    <label>Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          type: e.target.value as '' | 'income' | 'expense',
                        })
                      }
                    >
                      <option value=''>All Types</option>
                      <option value='income'>Income</option>
                      <option value='expense'>Expense</option>
                    </select>
                  </div>

                  <div className='form-group'>
                    <label>Min Amount</label>
                    <input
                      type='number'
                      placeholder='0.00'
                      value={filters.minAmount}
                      onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                    />
                  </div>

                  <div className='form-group'>
                    <label>Max Amount</label>
                    <input
                      type='number'
                      placeholder='0.00'
                      value={filters.maxAmount}
                      onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Results Summary */}
            {hasActiveFilters && (
              <div className='results-summary'>
                <p>
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                </p>
              </div>
            )}

            <div className='transactions-list'>
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className='transaction-item'
                >
                  <div className='transaction-info'>
                    <div className='transaction-category'>{categories.find((c) => c.name === transaction.category)?.icon || '📊'}</div>
                    <div className='transaction-details'>
                      <h4>{transaction.description}</h4>
                      <p>
                        {transaction.category} • {format(transaction.date, 'MMM dd, yyyy')}
                      </p>
                      {transaction.notes && <p className='transaction-notes'>{transaction.notes}</p>}
                      {transaction.attachments && transaction.attachments.length > 0 && (
                        <div className='transaction-attachments'>
                          {transaction.attachments.map((attachment) => (
                            <button
                              key={attachment.id}
                              className='attachment-button'
                              onClick={() => downloadAttachment(attachment)}
                              title={attachment.name}
                            >
                              <Paperclip size={14} />
                              {attachment.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='transaction-amount'>
                    <span className={transaction.type}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {/*  {formatCurrency(transaction.amount, transaction.currency)} */}
                    </span>
                    <button
                      className='delete-button'
                      onClick={() => deleteTransaction(transaction.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              {filteredTransactions.length === 0 && (
                <p className='no-transactions'>{hasActiveFilters ? 'No transactions match your filters.' : 'No transactions yet. Add your first transaction!'}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className='analytics'>
            <div className='analytics-header'>
              <h2>Spending Analytics</h2>
              <button
                className='add-button'
                onClick={() => setShowBudgetModal(true)}
              >
                <Plus size={16} />
                Add Budget Goal
              </button>
            </div>

            {/* Budget Goals */}
            {budgetGoals.length > 0 && (
              <div className='budget-goals'>
                <h3>Budget Goals</h3>
                <div className='budget-goals-list'>
                  {budgetGoals.map((goal) => {
                    const spent = getBudgetProgress(goal.category, goal.period);
                    const percentage = (spent / goal.amount) * 100;
                    const isOverBudget = percentage > 100;
                    const isNearLimit = percentage > 80;

                    return (
                      <div
                        key={goal.id}
                        className={`budget-goal-item ${isOverBudget ? 'over-budget' : isNearLimit ? 'near-limit' : ''}`}
                      >
                        <div className='budget-goal-header'>
                          <div className='budget-goal-info'>
                            <h4>{goal.category}</h4>
                            <p>{goal.period.charAt(0).toUpperCase() + goal.period.slice(1)} Budget</p>
                          </div>
                          <div className='budget-goal-amounts'>
                            <span className='spent'>{/* {formatCurrency(spent)} */}</span>
                            <span className='total'>/ {/* {formatCurrency(goal.amount)} */}</span>
                          </div>
                        </div>
                        <div className='budget-progress'>
                          <div
                            className={`progress-bar ${isOverBudget ? 'over' : isNearLimit ? 'warning' : ''}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <div className='budget-status'>
                          {isOverBudget && <span className='status over'>Over Budget!</span>}
                          {isNearLimit && !isOverBudget && <span className='status warning'>Near Limit</span>}
                          {!isNearLimit && <span className='status good'>On Track</span>}
                        </div>
                        <button
                          className='delete-button'
                          onClick={() => setBudgetGoals(budgetGoals.filter((g) => g.id !== goal.id))}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category Breakdown */}
            <div className='chart-container'>
              <h3>Spending by Category</h3>
              {categoryData.length > 0 ? (
                <ResponsiveContainer
                  width='100%'
                  height={300}
                >
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='value'
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        /* `${formatCurrency(value)}`, */
                        'Amount',
                      ]}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <p className='no-data'>No spending data available yet.</p>
              )}
            </div>

            {/* Category List */}
            <div className='category-breakdown'>
              <h3>Category Breakdown</h3>
              <div className='category-list'>
                {categoryData.map((category) => (
                  <div
                    key={category.name}
                    className='category-item'
                  >
                    <div className='category-info'>
                      <div
                        className='category-color'
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <span className='category-amount'>{/* {formatCurrency(category.value)} */}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recurring' && (
          <div className='analytics'>
            <h2>Recurring Transactions</h2>
            <div className='transactions-list'>
              {recurring.map((r) => (
                <div
                  key={r.id}
                  className='transaction-item'
                >
                  <div className='transaction-info'>
                    <div className='transaction-category'>{categories.find((c) => c.name === r.category)?.icon || '🔁'}</div>
                    <div className='transaction-details'>
                      <h4>{r.description}</h4>
                      <p>
                        {r.category} • {r.frequency.charAt(0).toUpperCase() + r.frequency.slice(1)} • Start: {format(r.startDate, 'MMM dd, yyyy')}
                        {r.endDate ? ` • End: ${format(r.endDate, 'MMM dd, yyyy')}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className='transaction-amount'>
                    <span className={r.type}>
                      {r.type === 'income' ? '+' : '-'}${r.amount.toFixed(2)}
                    </span>
                    <button
                      className='delete-button'
                      onClick={() => setRecurring(recurring.filter((x) => x.id !== r.id))}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              {recurring.length === 0 && <p className='no-transactions'>No recurring transactions yet.</p>}
            </div>
          </div>
        )}
      </main>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div
          className='modal-overlay'
          onClick={() => setShowAddModal(false)}
        >
          <div
            className='modal'
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Add Transaction</h2>

            <div className='form-group'>
              <label>Type</label>
              <div className='type-buttons'>
                <button
                  className={`type-button ${newTransaction.type === 'expense' ? 'active' : ''}`}
                  onClick={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                >
                  <TrendingDown size={16} />
                  Expense
                </button>
                <button
                  className={`type-button ${newTransaction.type === 'income' ? 'active' : ''}`}
                  onClick={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                >
                  <TrendingUp size={16} />
                  Income
                </button>
              </div>
            </div>

            <div className='form-group'>
              <label>Amount</label>
              <input
                type='number'
                placeholder='0.00'
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value,
                  })
                }
              />
            </div>

            <div className='form-group'>
              <label>Category</label>
              <select
                value={newTransaction.category}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    category: e.target.value,
                  })
                }
              >
                <option value=''>Select a category</option>
                {categories
                  .filter((c) =>
                    newTransaction.type === 'income' ? c.name.includes('Salary') || c.name.includes('Freelance') : !c.name.includes('Salary') && !c.name.includes('Freelance'),
                  )
                  .map((category) => (
                    <option
                      key={category.name}
                      value={category.name}
                    >
                      {category.icon} {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className='form-group'>
              <label>Description</label>
              <input
                type='text'
                placeholder='Enter description'
                value={newTransaction.description}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className='form-group'>
              <label>
                <input
                  type='checkbox'
                  checked={newTransaction.isRecurring}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      isRecurring: e.target.checked,
                    })
                  }
                  style={{ marginRight: 8 }}
                />
                Make this a recurring transaction
              </label>
            </div>

            {newTransaction.isRecurring && (
              <>
                <div className='form-group'>
                  <label>Frequency</label>
                  <select
                    value={newTransaction.frequency}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        frequency: e.target.value as 'daily' | 'weekly' | 'monthly',
                      })
                    }
                  >
                    <option value='daily'>Daily</option>
                    <option value='weekly'>Weekly</option>
                    <option value='monthly'>Monthly</option>
                  </select>
                </div>
                <div className='form-group'>
                  <label>End Date (optional)</label>
                  <input
                    type='date'
                    value={newTransaction.endDate}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            )}

            <div className='form-group'>
              <label>Currency</label>
              <select
                value={newTransaction.currency}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    currency: e.target.value,
                  })
                }
              >
                {currencies.map((currency) => (
                  <option
                    key={currency.code}
                    value={currency.code}
                  >
                    {currency.symbol} {currency.code}
                  </option>
                ))}
              </select>
            </div>

            <div className='form-group'>
              <label>Notes (optional)</label>
              <textarea
                placeholder='Add any additional notes...'
                value={newTransaction.notes}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    notes: e.target.value,
                  })
                }
                rows={3}
              />
            </div>

            <div className='form-group'>
              <label>Attachments (optional)</label>
              <div className='file-upload-area'>
                <label className='file-upload-button'>
                  <Paperclip size={16} />
                  Choose Files
                  <input
                    type='file'
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                <p className='file-upload-hint'>Upload receipts or related documents</p>
              </div>

              {newTransaction.attachments.length > 0 && (
                <div className='attachments-list'>
                  {newTransaction.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className='attachment-item'
                    >
                      <div className='attachment-info'>
                        <FileText size={16} />
                        <span>{attachment.name}</span>
                        <span className='attachment-size'>({(attachment.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        className='remove-attachment'
                        onClick={() => removeAttachment(attachment.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className='modal-actions'>
              <button
                className='cancel-button'
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className='save-button'
                onClick={addTransaction}
              >
                Save Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Budget Goal Modal */}
      {showBudgetModal && (
        <div
          className='modal-overlay'
          onClick={() => setShowBudgetModal(false)}
        >
          <div
            className='modal'
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Add Budget Goal</h2>

            <div className='form-group'>
              <label>Category</label>
              <select
                value={newBudgetGoal.category}
                onChange={(e) =>
                  setNewBudgetGoal({
                    ...newBudgetGoal,
                    category: e.target.value,
                  })
                }
              >
                <option value=''>Select a category</option>
                {categories
                  .filter((c) => !c.name.includes('Salary') && !c.name.includes('Freelance'))
                  .map((category) => (
                    <option
                      key={category.name}
                      value={category.name}
                    >
                      {category.icon} {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className='form-group'>
              <label>Amount</label>
              <input
                type='number'
                placeholder='0.00'
                value={newBudgetGoal.amount}
                onChange={(e) => setNewBudgetGoal({ ...newBudgetGoal, amount: e.target.value })}
              />
            </div>

            <div className='form-group'>
              <label>Period</label>
              <select
                value={newBudgetGoal.period}
                onChange={(e) =>
                  setNewBudgetGoal({
                    ...newBudgetGoal,
                    period: e.target.value as 'weekly' | 'monthly',
                  })
                }
              >
                <option value='weekly'>Weekly</option>
                <option value='monthly'>Monthly</option>
              </select>
            </div>

            <div className='form-group'>
              <label>Currency</label>
              <select
                value={newBudgetGoal.currency}
                onChange={(e) =>
                  setNewBudgetGoal({
                    ...newBudgetGoal,
                    currency: e.target.value,
                  })
                }
              >
                {currencies.map((currency) => (
                  <option
                    key={currency.code}
                    value={currency.code}
                  >
                    {currency.symbol} {currency.code}
                  </option>
                ))}
              </select>
            </div>

            <div className='modal-actions'>
              <button
                className='cancel-button'
                onClick={() => setShowBudgetModal(false)}
              >
                Cancel
              </button>
              <button
                className='save-button'
                onClick={addBudgetGoal}
              >
                Save Budget Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
