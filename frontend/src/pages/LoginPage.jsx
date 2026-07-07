import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { CheckSquare, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {}
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <CheckSquare size={22} color="white" />
        </div>
        <span style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>TaskFlow</span>
      </div>

      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 32 }}>
        Engineering speed for high-performance teams.
      </p>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 400,
        background: '#13131f',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: 32
      }}>
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 8, padding: '10px 16px', marginBottom: 20,
            color: '#f87171', fontSize: 14
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email */}
          <div>
            <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 6, display: 'block' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              style={{
                width: '100%', padding: '10px 14px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, color: 'white', fontSize: 14,
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 13, color: '#9ca3af' }}>Password</label>
              <a href="#" style={{ fontSize: 13, color: '#7c3aed', textDecoration: 'none' }}>Forgot?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '10px 40px 10px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: 'white', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: '#6b7280'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%', padding: '12px',
              background: isLoading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              border: 'none', borderRadius: 8,
              color: 'white', fontSize: 14, fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: 8
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6b7280' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 500 }}>
            Sign up
          </Link>
        </p>
      </div>

      {/* Security badges */}
      <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
        <span style={{ fontSize: 12, color: '#4b5563' }}>🔒 AES-256 ENCRYPTED</span>
        <span style={{ fontSize: 12, color: '#4b5563' }}>✓ SOC2 COMPLIANT</span>
      </div>
    </div>
  )
}