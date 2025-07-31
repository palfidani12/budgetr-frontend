import { useModal } from '../../../hooks/modal';
import { CreateTransactionForm } from '../modal-content/create-transaction-form/CreateTransactionForm';
import classes from './Modal.module.scss';

export const Modal = () => {
  const { isOpen, modalType, closeModal } = useModal();
  const modalTitle = modalType === 'addPocket' ? 'Create Account' : 'Create transaction';

  return (
    <>
      {isOpen && (
        <div
          className={classes.modalBackdrop}
          onClick={closeModal}
        >
          <div
            className={classes.modalContent}
            onClick={(e) => e.stopPropagation()}
            role='dialog'
            aria-modal='true'
          >
            <button
              className={classes.closeButton}
              onClick={closeModal}
              aria-label='Close'
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
