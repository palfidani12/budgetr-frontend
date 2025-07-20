import React, { useState } from "react";
import styles from "./EditTransactionForm.module.scss";

interface EditTransactionFormProps {
  initialDescription?: string;
  initialAmount?: number;
  initialDate?: string;
  onSubmit: (data: { description: string; amount: number; date: string }) => void;
  onCancel?: () => void;
}

const EditTransactionForm: React.FC<EditTransactionFormProps> = ({
  initialDescription = "",
  initialAmount = 0,
  initialDate = "",
  onSubmit,
  onCancel,
}) => {
  const [description, setDescription] = useState(initialDescription);
  const [amount, setAmount] = useState(initialAmount);
  const [date, setDate] = useState(initialDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ description, amount, date });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles["form-group"]}>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>
      <div className={styles["form-group"]}>
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          required
        />
      </div>
      <div className={styles["form-group"]}>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </div>
      <div className={styles.actions}>
        <button type="submit" className={styles["save-button"]}>Save</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={styles["cancel-button"]}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EditTransactionForm; 