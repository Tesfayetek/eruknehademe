import React, { useEffect, useRef } from 'react';
import { Trash2, AlertTriangle, Loader2, X, AlertCircle } from 'lucide-react';

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  recordName: string;
  recordType?: string;
  recordId?: string;
  confirmationMessage?: string;
  isDeleting: boolean;
  errorMessage?: string | null;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  title,
  recordName,
  recordType = 'Record',
  recordId,
  confirmationMessage = 'Are you sure you want to permanently delete this record? This action cannot be undone.',
  isDeleting,
  errorMessage,
  onConfirm,
  onCancel,
}) => {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  // Focus the Cancel button on open for safe keyboard navigation
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        cancelBtnRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle Escape key to cancel (only when not deleting)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden transform transition-all">
        {/* Header Ribbon */}
        <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                Permanent Deletion
              </span>
              <h3
                id="delete-dialog-title"
                className="font-serif text-lg font-bold text-slate-900 leading-tight"
              >
                {title || `Delete ${recordType}?`}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white disabled:opacity-40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            {confirmationMessage}
          </p>

          {/* Record Identification Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              <span>{recordType} Target</span>
              {recordId && (
                <span className="font-mono text-[10px] text-slate-400 lowercase">
                  id: {recordId}
                </span>
              )}
            </div>
            <p className="font-bold text-slate-900 text-sm break-words line-clamp-2">
              {recordName || 'Untitled Record'}
            </p>
          </div>

          {/* Error Message Display if deletion failed */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Deletion Failed</p>
                <p className="text-[11px] text-rose-700 leading-tight mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Permanent Warning */}
          <div className="flex items-center space-x-2 text-[11px] text-amber-700 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Database record will be purged permanently from Firebase.</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 shadow-sm transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                <span>Deleting Permanently...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                <span>Delete Permanently</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
