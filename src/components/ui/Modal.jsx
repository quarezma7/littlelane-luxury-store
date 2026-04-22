import { useEffect, useCallback } from 'react';

const overlayStyle = {
  position: 'fixed', inset: 0,
  background: 'rgba(5,7,20,0.75)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 'var(--z-modal)',
  animation: 'fadeIn 0.2s ease',
  padding: '24px',
};

const boxStyle = {
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-glass)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-lg), 0 0 0 1px rgba(232,165,176,0.08)',
  animation: 'fadeSlideUp 0.3s cubic-bezier(0.34,1.2,0.64,1)',
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative',
};

export default function Modal({ isOpen, onClose, title, children, maxWidth = 560 }) {
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKey]);

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ ...boxStyle, width: '100%', maxWidth }}>
        {/* Header */}
        {title && (
          <div style={{
            padding: '20px 24px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-glass)',
            paddingBottom: '16px', marginBottom: '0',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              style={{
                background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)', width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', fontSize: '1rem',
                transition: 'all var(--transition-fast)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-glass)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >✕</button>
          </div>
        )}
        <div style={{ padding: '20px 24px 24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
