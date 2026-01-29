import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    return (
        <button className={`btn btn-${variant} ${className}`} {...props}>
            {children}
        </button>
    );
};

// Simple in-app confirmation dialog
export const ConfirmDialog = ({ visible, title = 'Confirm', message, onConfirm, onCancel }) => {
    if (!visible) return null;
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 10000
        }}>
            <div style={{ background: 'white', color: '#111827', padding: '1.5rem', borderRadius: '12px', width: 'min(520px, 90%)' }}>
                <h3 style={{ marginTop: 0 }}>{title}</h3>
                <p style={{ color: '#374151' }}>{message}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                    <button onClick={onCancel} className="btn btn-outline">Cancel</button>
                    <button onClick={onConfirm} className="btn btn-danger">Confirm</button>
                </div>
            </div>
        </div>
    );
};
export const Input = ({ label, error, ...props }) => {
    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>{label}</label>}
            <input {...props} />
            {error && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</span>}
        </div>
    );
};

export const Card = ({ title, children, className = '', headerAction }) => {
    return (
        <div className={`card ${className}`}>
            {(title || headerAction) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    {title && <h2 style={{ fontSize: '1.25rem' }}>{title}</h2>}
                    {headerAction}
                </div>
            )}
            {children}
        </div>
    );
};

export const Table = ({ headers, children, emptyMessage = "No data found" }) => {
    return (
        <div style={{ overflowX: 'auto', borderRadius: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', textAlign: 'left' }}>
                <thead>
                    <tr>
                        {headers.map((h, i) => (
                            <th key={i} style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {React.Children.count(children) === 0 ? (
                        <tr>
                            <td colSpan={headers.length} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--glass-bg)', borderRadius: '16px' }}>{emptyMessage}</td>
                        </tr>
                    ) : children}
                </tbody>
            </table>
        </div>
    );
};
export const Skeleton = ({ width = '100%', height = '20px', borderRadius = '8px', marginBottom = '0' }) => (
    <div
        className="skeleton"
        style={{ width, height, borderRadius, marginBottom }}
    />
);

export const CardSkeleton = () => (
    <div className="card" style={{ padding: '2rem' }}>
        <Skeleton width="40%" height="24px" marginBottom="1.5rem" />
        <Skeleton width="100%" height="60px" />
    </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
    <div style={{ background: 'var(--glass-bg)', padding: '1rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', padding: '0 1rem' }}>
            {Array(cols).fill(0).map((_, i) => (
                <Skeleton key={i} width={`${100 / cols}%`} height="15px" />
            ))}
        </div>
        {Array(rows).fill(0).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '8px', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
                {Array(cols).fill(0).map((_, j) => (
                    <Skeleton key={j} width={`${100 / cols}%`} height="20px" />
                ))}
            </div>
        ))}
    </div>
);

export const CalendarSkeleton = () => (
    <div style={{ color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <Skeleton width="120px" height="20px" />
            <Skeleton width="80px" height="20px" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {Array(35).fill(0).map((_, i) => (
                <Skeleton key={i} width="100%" height="40px" borderRadius="10px" />
            ))}
        </div>
    </div>
);

export const Toast = ({ message, type = 'success', onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div style={{
            position: 'fixed',
            bottom: '2.5rem',
            right: '2.5rem',
            padding: '1rem 1.5rem',
            background: type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }} className="fade-in">
            <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: type === 'success' ? '#10b981' : '#ef4444',
                boxShadow: `0 0 10px ${type === 'success' ? '#10b981' : '#ef4444'}`
            }}></div>
            <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '0 0.5rem',
                    lineHeight: 1
                }}
            >×</button>
        </div>
    );
};
