import classes from "./Modal.module.scss";
import { useModal } from "../../../hooks/modal";
import EditMoneyPocketForm from "../modal-content/edit-money-pocket-form/EditMoneyPocketForm";
import { CreateTransactionForm } from "../modal-content/create-transaction-form/CreateTransactionForm";

export const Modal = () => {
  const { isOpen, modalType, closeModal } = useModal();
  console.log("modal", isOpen, modalType);
  const modalTitle =
    modalType === "addPocket" ? "Create Account" : "Create transaction";

  return (
    <>
      {isOpen && (
        <div className={classes.modalBackdrop} onClick={closeModal}>
          <div
            className={classes.modalContent}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className={classes.closeButton}
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className={classes.modalTitle}>{modalTitle}</h2>
            <div className={classes.modalBody}>
              <CreateTransactionForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
