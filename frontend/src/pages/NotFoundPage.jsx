import { Link } from 'react-router-dom'
import { CheckSquare, Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px', textAlign: 'center'
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: 14,
        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24
      }}>
        <CheckSquare size={30} color="white" />
      </div>

      <h1 style={{ fontSize: 72, fontWeight: 800, color: '#7c3aed', marginBottom: 8 }}>404</h1>
      <h2 style={{ fontSize: 24, fontWeight: 600, color: 'white', marginBottom: 12 }}>Page Not Found</h2>
      <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 32, maxWidth: 400 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link to="/dashboard" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
        color: 'white', padding: '12px 24px',
        borderRadius: 8, textDecoration: 'none',
        fontSize: 14, fontWeight: 600
      }}>
        <Home size={16} />
        Back to Dashboard
      </Link>
    </div>
  )
}