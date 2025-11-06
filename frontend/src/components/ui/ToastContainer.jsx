import React from 'react';
import { useToast } from '../../context/ToastContext';

const ToastItem = ({ toast, onClose }) => {
  const bg = toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-gray-700';
  return (
    <div className={`text-white px-4 py-2 rounded-lg shadow-md ${bg} mb-2 max-w-xs`}>
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm">{toast.message}</div>
        <button onClick={() => onClose(toast.id)} className="ml-2 text-white/80 hover:text-white">✕</button>
      </div>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, remove } = useToast();

  return (
    <div aria-live="polite" className="fixed bottom-6 right-6 z-50">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onClose={remove} />
      ))}
    </div>
  );
};

export default ToastContainer;
