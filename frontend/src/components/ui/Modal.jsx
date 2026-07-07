import { X } from 'lucide-react'

export default function Modal({ title, onClose, children, width = 480 }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50, padding: 24
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#13131f',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, padding: 32,
        width: '100%', maxWidth: width,
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 24
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'white' }}>
            {title}
          </h2>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: 8,
            cursor: 'pointer', color: '#6b7280'
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}