import type React from 'react';
import {useEffect} from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Modal: React.FC<ModalProps> = ({isOpen, onClose, modalRef, children, ...props}) => {
  const handleOutsideClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="z-30 fixed inset-0 flex items-center justify-center bg-black bg-opacity-25">
      <div
        className="rounded-lg p-4 flex flex-col justify-center max-w-[1280px max-h-screen bg-background"
        {...props}
        ref={modalRef}
      >
        {children}
      </div>
    </div>
  );
};
