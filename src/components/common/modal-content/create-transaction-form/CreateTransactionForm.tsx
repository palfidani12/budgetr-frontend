import { useState, type FormEventHandler } from "react";
import styles from "./CreateTransactionForm.module.scss";
import { useUser } from "../../../../hooks/user";
import { useApi } from "../../../../hooks/api";
import { useModal } from "../../../../hooks/modal";

export const CreateTransactionForm = () => {
  const user = useUser();
  const api = useApi();
  const {closeModal} = useModal();
  const userMoneyPockets = user?.moneyPockets ?? [];
  const [name, setName] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedMoneyPocketId, setSelectedMoneyPocketId] = useState("");
  const [transactionTime, setTransactionTime] = useState("");
  const selectedMoneyPocket = userMoneyPockets.find(
    (pocket) => pocket.id === selectedMoneyPocketId
  );

  const formattedNow = new Date().toISOString().slice(0, 16);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await api.transactionApi.createTransaction({
      transactionName: name,
      vendorName,
      amount: Number(amount),
      transactionTime,
      moneyPocketId: selectedMoneyPocketId,
    });
    console.log({
      name,
      vendorName,
      amount: Number(amount),
      selectedMoneyPocketId,
      transactionTime,
    });
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles["form-group"]}>
        <label htmlFor="account">Account</label>
        <select
          name="account"
          id="account"
          onChange={(e) => {
            console.log("changed", e.target.value);
            setSelectedMoneyPocketId(e.target.value);
          }}
          defaultValue={""}
          className={styles.select}
        >
          <option value="" disabled>
            Select an account
          </option>
          {userMoneyPockets.map((moneyPocket) => (
            <option
              value={moneyPocket.id}
              key={`${moneyPocket.id}-${moneyPocket.name}`}
            >
              {moneyPocket.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["form-group"]}>
        <label htmlFor="transactionName">Name</label>
        <input
          id="transactionName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className={styles["form-group"]}>
        <label htmlFor="description">Vendor name</label>
        <input
          id="description"
          type="text"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
          required
        />
      </div>
      <div className={styles["form-group"]}>
        <label htmlFor="amount">Amount</label>
        <div className={styles["amount-input-container"]}>
          {selectedMoneyPocket && (
            <span className={styles["currency-prefix"]}>
              {selectedMoneyPocket.currency}
            </span>
          )}
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            step={"0.01"}
            className={styles["amount-input"]}
          />
        </div>
      </div>
      <div className={styles["form-group"]}>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="datetime-local"
          max={formattedNow}
          onChange={(e) => setTransactionTime(e.target.value)}
          required
        />
      </div>
      <div className={styles.actions}>
        <button type="submit" className={styles["save-button"]}>
          Save
        </button>
      </div>
    </form>
  );
};
