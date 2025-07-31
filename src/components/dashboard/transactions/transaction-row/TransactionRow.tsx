import classNames from 'classnames';
import type { Transaction } from '../../../../types/transaction-type';
import classes from './TransactionRow.module.scss';

export const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
  const date = new Date(transaction.transactionTime);
  return (
    <div className={classes.transactionRow}>
      <div className={classes.nameContainer}>
        <p className={classes.vendorName}>{transaction.vendorName}</p>
        <p className={classes.transactionName}>{transaction.name}</p>
      </div>

      <p
        className={classNames(classes.amount, {
          [classes.income]: transaction.amount > 0,
          [classes.expense]: transaction.amount < 0,
        })}
      >
        {Intl.NumberFormat('hu', {
          style: 'currency',
          currency: transaction.currency,
          maximumFractionDigits: 0,
        }).format(transaction.amount)}{' '}
      </p>
      <p>{date.toLocaleString('hu')}</p>
      <p>{transaction.moneyPocketName}</p>
    </div>
  );
};
