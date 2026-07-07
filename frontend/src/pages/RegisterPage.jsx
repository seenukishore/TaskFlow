import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { CheckSquare, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { register, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    try {
      await register(email, fullName, password)
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
        Create your account to get started.
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
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 8, padding: '10px 16px', marginBottom: 20,
            color: '#f87171', fontSize: 14
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Full Name */}
          <div>
            <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 6, display: 'block' }}>
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="John Doe"
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
            <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 6, display: 'block' }}>
              Password
            </label>
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
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6b7280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}