import { createContext } from 'react';

export type ModalType = 'addTransaction' | 'addPocket';

export type ModalContextProps = {
  isOpen: boolean;
  modalType: ModalType | undefined;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextProps>(null as unknown as ModalContextProps);
