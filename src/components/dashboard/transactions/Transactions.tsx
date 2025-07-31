import { useUserTransactions } from '../../../hooks/user-transactions';
import { TransactionRow } from './transaction-row/TransactionRow';
import classes from './Transactions.module.scss';

export const Transactions = () => {
  const transactions = useUserTransactions();

  return (
    <div className={classes.transactionsContainer}>
      {transactions &&
        transactions.map((transaction) => (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
          />
        ))}
    </div>
  );
};
