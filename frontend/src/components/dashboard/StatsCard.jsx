export default function StatsCard({ label, value, unit, change, icon, color }) {
  return (
    <div style={{
      background: '#13131f',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
      padding: '20px 24px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
      }}>
        <span style={{
          fontSize: 11, color: '#6b7280',
          letterSpacing: 1, textTransform: 'uppercase'
        }}>
          {label}
        </span>
        <span style={{ color: color }}>{icon}</span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 6, marginBottom: 8
      }}>
        <span style={{
          fontSize: 32, fontWeight: 700, color: 'white'
        }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 13, color: '#6b7280' }}>
            {unit}
          </span>
        )}
      </div>

      <span style={{ fontSize: 12, color: color }}>
        {change}
      </span>
    </div>
  )
}