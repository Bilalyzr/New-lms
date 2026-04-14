import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }) {
    const [state, setState] = useState({
        show: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'danger', // danger, warning, info
        resolve: null
    });

    const confirm = useCallback(({ title, message, confirmText, cancelText, type } = {}) => {
        return new Promise((resolve) => {
            setState({
                show: true,
                title: title || 'Are you sure?',
                message: message || '',
                confirmText: confirmText || 'Confirm',
                cancelText: cancelText || 'Cancel',
                type: type || 'danger',
                resolve
            });
        });
    }, []);

    const handleConfirm = () => {
        state.resolve?.(true);
        setState(prev => ({ ...prev, show: false }));
    };

    const handleCancel = () => {
        state.resolve?.(false);
        setState(prev => ({ ...prev, show: false }));
    };

    const typeColors = {
        danger: { bg: '#FEF2F2', icon: '#EF4444', btn: '#EF4444', btnHover: '#DC2626' },
        warning: { bg: '#FFFBEB', icon: '#F59E0B', btn: '#F59E0B', btnHover: '#D97706' },
        info: { bg: '#F5F3FF', icon: '#6C4CF1', btn: '#6C4CF1', btnHover: '#5A3ED9' }
    };

    const colors = typeColors[state.type] || typeColors.danger;

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}

            {state.show && (
                <div className="confirm-overlay" onClick={handleCancel}>
                    <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="confirm-icon-wrap" style={{ background: colors.bg }}>
                            <AlertTriangle size={24} style={{ color: colors.icon }} />
                        </div>
                        <div className="confirm-content">
                            <h3 className="confirm-title">{state.title}</h3>
                            {state.message && <p className="confirm-message">{state.message}</p>}
                        </div>
                        <div className="confirm-actions">
                            <button className="confirm-btn cancel" onClick={handleCancel}>
                                {state.cancelText}
                            </button>
                            <button
                                className="confirm-btn action"
                                style={{ background: colors.btn }}
                                onMouseEnter={(e) => e.target.style.background = colors.btnHover}
                                onMouseLeave={(e) => e.target.style.background = colors.btn}
                                onClick={handleConfirm}
                            >
                                {state.confirmText}
                            </button>
                        </div>
                        <button className="confirm-close" onClick={handleCancel}>
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}
