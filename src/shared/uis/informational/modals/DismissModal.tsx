import { type ReactNode } from "react";
import styles from "./Modal.module.css";
import PillButton from "../../Buttons/PillButton/PillButton";

type DismissModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  buttonTitle?: string
};

const DismissModal = ({ isOpen, onClose, title, children, buttonTitle='Dissmiss Button Title' }: DismissModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {title && <h2 className={styles.title}>{title}</h2>}
        
        <div className={styles.content}>{children}</div>
        
        <PillButton
         variant="danger"
         title={buttonTitle}
         handleClick={onClose}
        />
        
      </div>
    </div>
  );
};

export default DismissModal;