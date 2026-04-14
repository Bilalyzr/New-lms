import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

let toastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type }]);
        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
    const error = useCallback((msg) => addToast(msg, 'error', 6000), [addToast]);
    const warning = useCallback((msg) => addToast(msg, 'warning', 5000), [addToast]);
    const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);

    const icons = {
        success: <CheckCircle size={18} />,
        error: <XCircle size={18} />,
        warning: <AlertTriangle size={18} />,
        info: <Info size={18} />
    };

    return (
        <ToastContext.Provider value={{ success, error, warning, info, addToast }}>
            {children}

            {/* Toast Container */}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast-item toast-${toast.type}`}>
                        <span className="toast-icon">{icons[toast.type]}</span>
                        <span className="toast-msg">{toast.message}</span>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
