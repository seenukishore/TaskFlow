export default function Badge({ label, color, bg }) {
  const colors = {
    critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
    high: { color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
    medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    low: { color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    active: { color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    on_hold: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    completed: { color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
    backlog: { color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
    todo: { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
    in_progress: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    in_review: { color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
    done: { color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    stable: { color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    warning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    critical_health: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  }

  const style = colors[label?.toLowerCase()] || { color: color || '#6b7280', bg: bg || 'rgba(107,114,128,0.15)' }

  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      color: style.color,
      background: style.bg,
    }}>
      {label?.replace('_', ' ')}
    </span>
  )
}