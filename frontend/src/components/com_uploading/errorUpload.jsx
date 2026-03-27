import React from 'react';
import { AlertTriangle, RefreshCcw, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ErrorUpload({ message, onClose, onRetake }) {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className={`w-[90%] max-w-md p-6 rounded-2xl shadow-xl ${
        theme === 'dark' ? 'bg-[#1a1f2c] text-white' : 'bg-white text-gray-800'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-500" />
            <h2 className="text-lg font-semibold">Upload Error</h2>
          </div>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message */}
        <p className={`mb-6 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {message || 'Image is not clear enough. Please upload a clear bill image.'}
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
          >
            Close
          </button>

          <button
            onClick={onRetake}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
          >
            <RefreshCcw className="h-4 w-4" />
            Retake
          </button>
        </div>
      </div>
    </div>
  );
}
