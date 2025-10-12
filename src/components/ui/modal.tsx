import React from 'react';


import { useSidebar } from '@/context/sidebar-context';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}


const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  const { sidebarOpen } = useSidebar();
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={sidebarOpen ? { marginLeft: '16rem', width: 'calc(100% - 16rem)' } : {}}
    >
      {children}
    </div>
  );
};

export default Modal;
