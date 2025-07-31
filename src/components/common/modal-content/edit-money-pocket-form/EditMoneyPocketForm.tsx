import { type FC, useState } from 'react';
import styles from './EditMoneyPocketForm.module.scss';

interface EditMoneyPocketFormProps {
  initialName?: string;
  initialBalance?: number;
  onSubmit: (data: { name: string; balance: number }) => void;
  onCancel?: () => void;
}

const EditMoneyPocketForm: FC<EditMoneyPocketFormProps> = ({ initialName = '', initialBalance = 0, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialName);
  const [balance, setBalance] = useState(initialBalance);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, balance });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
    >
      <div className={styles['form-group']}>
        <label htmlFor='name'>Name</label>
        <input
          id='name'
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className={styles['form-group']}>
        <label htmlFor='balance'>Balance</label>
        <input
          id='balance'
          type='number'
          value={balance}
          onChange={(e) => setBalance(Number(e.target.value))}
          required
        />
      </div>
      <div className={styles.actions}>
        <button
          type='submit'
          className={styles['save-button']}
        >
          Save
        </button>
        {onCancel && (
          <button
            type='button'
            onClick={onCancel}
            className={styles['cancel-button']}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EditMoneyPocketForm;
