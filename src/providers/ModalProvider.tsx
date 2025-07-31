import { type ReactNode, useEffect, useState } from 'react';
import { ModalContext, type ModalType } from '../context/modal.context';

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>();

  useEffect(() => {
    const body = document.querySelector('#budgetrBody');
    if (!body) {
      // eslint-disable-next-line no-console
      console.error('Body of budgetr not found');
    }
    if (isOpen) {
      body!.classList.add('modalShown');
    } else {
      body!.classList.remove('modalShown');
    }
  }, [isOpen]);

  const openModal = (type: ModalType) => {
    setModalType(type);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  return <ModalContext.Provider value={{ isOpen, modalType, openModal, closeModal }}>{children}</ModalContext.Provider>;
};
