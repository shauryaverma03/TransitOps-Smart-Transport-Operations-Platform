import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />
      
      {/* Modal panel */}
      <div 
        className="relative z-50 w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-surface-border overflow-hidden"
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Gradient header accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-border/50 hover:bg-surface-border flex items-center justify-center text-text-muted hover:text-text-primary transition-all duration-200"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
