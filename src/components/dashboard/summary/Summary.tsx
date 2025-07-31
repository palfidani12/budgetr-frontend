import classes from './Summary.module.scss';

interface SummaryProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export const Summary = ({ totalBalance, totalIncome, totalExpenses }: SummaryProps) => (
  <div className={classes.summaryGrid}>
    <div className={classes.summaryItemCard}>
      <div className={classes.balanceAccent} />
      <span className={classes.summaryIcon + ' ' + classes.balanceIcon}>
        {/* Bank icon SVG */}
        <svg
          width='32'
          height='32'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M3 10l9-7 9 7' />
          <path d='M9 21V14H15V21' />
          <path d='M21 21H3' />
          <path d='M3 21V10' />
          <path d='M21 21V10' />
        </svg>
      </span>
      <span className={classes.summaryLabel}>Total Balance</span>
      <span className={classes.summaryValue}>${totalBalance.toFixed(2)}</span>
    </div>
    <div className={classes.summaryItemCard}>
      <div className={classes.incomeAccent} />
      <span className={classes.summaryIcon + ' ' + classes.incomeIcon}>
        {/* Up arrow icon SVG */}
        <svg
          width='32'
          height='32'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M12 19V5' />
          <path d='M5 12l7-7 7 7' />
        </svg>
      </span>
      <span className={classes.summaryLabel}>Total Income</span>
      <span className={classes.summaryValue}>${totalIncome.toFixed(2)}</span>
    </div>
    <div className={classes.summaryItemCard}>
      <div className={classes.expensesAccent} />
      <span className={classes.summaryIcon + ' ' + classes.expensesIcon}>
        {/* Down arrow icon SVG */}
        <svg
          width='32'
          height='32'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M12 5v14' />
          <path d='M19 12l-7 7-7-7' />
        </svg>
      </span>
      <span className={classes.summaryLabel}>Total Expenses</span>
      <span className={classes.summaryValue + ' ' + (totalExpenses > 0 ? classes.negative : '')}>${totalExpenses.toFixed(2)}</span>
    </div>
  </div>
);
