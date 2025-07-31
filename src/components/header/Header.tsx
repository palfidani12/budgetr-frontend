import { useState } from 'react';
import { Download, Moon, Plus, Sun, Upload } from 'lucide-react';
import { useModal } from '../../hooks/modal';
import { ThemeToggleButton } from './theme-toggle-button/ThemeToggleButton';
import classes from './Header.module.scss';

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

const toggleTheme = () => {
  console.log('toggled theme');
  // setTheme(theme === 'light' ? 'dark' : 'light');
};

const exportToCSV = () => {
  /*  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        format(t.date, 'yyyy-MM-dd'),
        t.type,
        t.category,
        `"${t.description}"`,
        t.amount
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budgetr-transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url); */
};

const exportToJSON = () => {
  /*   const data = {
    transactions,
    recurring,
    budgetGoals,
    exportDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `budgetr-data-${format(new Date(), "yyyy-MM-dd")}.json`;
  a.click();
  window.URL.revokeObjectURL(url); */
};

const importFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
  /* const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const data = JSON.parse(content);

      if (data.transactions) {
        setTransactions(
          data.transactions.map((t: any) => ({ ...t, date: new Date(t.date) }))
        );
      }
      if (data.recurring) {
        setRecurring(
          data.recurring.map((r: any) => ({
            ...r,
            startDate: new Date(r.startDate),
            endDate: r.endDate ? new Date(r.endDate) : undefined,
          }))
        );
      }
      if (data.budgetGoals) {
        setBudgetGoals(
          data.budgetGoals.map((b: any) => ({
            ...b,
            startDate: new Date(b.startDate),
          }))
        );
      }

      alert("Data imported successfully!");
    } catch (error) {
      alert("Error importing file. Please check the file format.");
    }
  };
  reader.readAsText(file);
  event.target.value = ""; */
};

export const Header = () => {
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const { openModal } = useModal();

  return (
    <div className={classes.header}>
      <div className='header-content'>
        <h1 className='app-title'>Budgetr</h1>
        <div className='header-actions'>
          <div className='export-import-buttons'>
            <button
              className='export-button'
              onClick={exportToCSV}
              title='Export to CSV'
            >
              <Download size={16} />
              CSV
            </button>
            <button
              className='export-button'
              onClick={exportToJSON}
              title='Export to JSON'
            >
              <Download size={16} />
              JSON
            </button>
            <label className='import-button'>
              <Upload size={16} />
              Import
              <input
                type='file'
                accept='.json'
                onChange={importFromFile}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <div
            className={classes.addDropdownWrapper}
            onMouseEnter={() => setShowAddDropdown(true)}
            onMouseLeave={() => setShowAddDropdown(false)}
          >
            <button className={classes.addButton}>
              <Plus size={20} /> Add
            </button>
            {showAddDropdown && (
              <div className={classes.addDropdownMenu}>
                <button
                  className={classes.addDropdownItem}
                  onClick={() => openModal('addTransaction')}
                >
                  Add Transaction
                </button>
                <button
                  className={classes.addDropdownItem}
                  onClick={() => openModal('addPocket')}
                >
                  Add Money Pocket
                </button>
              </div>
            )}
          </div>
          <ThemeToggleButton />
        </div>
      </div>
    </div>
  );
};
