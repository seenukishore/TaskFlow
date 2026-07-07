import { useState } from 'react'
import useAuthStore from '../store/authStore'
import { User, Bell, Shield, Palette, Save } from 'lucide-react'
import api from '../services/api'

export default function SettingsPage() {
  const { user, fetchUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notifPrefs, setNotifPrefs] = useState({
    task_assignments: true,
    task_comments: true,
    mentions: true,
    deadline_reminders: false,
    project_updates: false,
    weekly_digest: true,
  })
  const [theme, setTheme] = useState('dark')

  const applyTheme = (selectedTheme) => {
    setTheme(selectedTheme)
    const root = document.documentElement
    if (selectedTheme === 'light') {
      root.style.setProperty('--bg-color', '#f8f9fa')
      root.style.setProperty('--text-color', '#1a1a2e')
      document.body.style.background = '#f8f9fa'
      document.body.style.color = '#1a1a2e'
    } else if (selectedTheme === 'dark') {
      root.style.setProperty('--bg-color', '#0a0a0f')
      root.style.setProperty('--text-color', '#ffffff')
      document.body.style.background = '#0a0a0f'
      document.body.style.color = '#ffffff'
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const bg = prefersDark ? '#0a0a0f' : '#f8f9fa'
      const text = prefersDark ? '#ffffff' : '#1a1a2e'
      root.style.setProperty('--bg-color', bg)
      root.style.setProperty('--text-color', text)
      document.body.style.background = bg
      document.body.style.color = text
    }
  }

  const toggleNotif = (key) => {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      await api.put('/users/me', { full_name: fullName })
      await fetchUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Save failed!')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { key: 'profile', label: 'Profile', icon: <User size={16} /> },
    { key: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { key: 'security', label: 'Security', icon: <Shield size={16} /> },
    { key: 'appearance', label: 'Appearance', icon: <Palette size={16} /> },
  ]

  return (
    <div style={{ padding: '32px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 4 }}>Settings</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Manage your account and preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        {/* Sidebar */}
        <div style={{
          background: '#13131f',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12,
          padding: 8,
          height: 'fit-content'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 8,
                marginBottom: 2,
                background: activeTab === tab.key ? 'rgba(124,58,237,0.15)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === tab.key ? '#a78bfa' : '#6b7280',
                fontSize: 14,
                textAlign: 'left'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          background: '#13131f',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12,
          padding: 32
        }}>
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 24 }}>
                Profile Settings
              </h2>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'white'
                }}>
                  {user?.full_name?.[0]?.toUpperCase() || 'K'}
                </div>
                <div>
                  <p style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                    {user?.full_name}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 8 }}>{user?.email}</p>
                  <p style={{ color: '#4b5563', fontSize: 12 }}>
                    Avatar upload coming soon (AWS S3)
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 8,
                  padding: '10px 16px',
                  marginBottom: 16,
                  color: '#f87171',
                  fontSize: 14
                }}>
                  {error}
                </div>
              )}

              {/* Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8, display: 'block' }}>
                    Full Name
                  </label>
                  <input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      color: 'white',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8, display: 'block' }}>
                    Email Address
                  </label>
                  <input
                    value={user?.email || ''}
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 8,
                      color: '#6b7280',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <p style={{ fontSize: 12, color: '#4b5563', marginTop: 4 }}>
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8, display: 'block' }}>
                    Role
                  </label>
                  <input
                    value={user?.role || 'team_member'}
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 8,
                      color: '#6b7280',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: saved ? '#10b981' : saving ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 24px',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    width: 'fit-content',
                    transition: 'background 0.3s'
                  }}
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 24 }}>
                Notification Preferences
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { key: 'task_assignments', label: 'Task assignments', desc: 'When a task is assigned to you' },
                  { key: 'task_comments', label: 'Task comments', desc: 'When someone comments on your task' },
                  { key: 'mentions', label: 'Mentions', desc: 'When you are mentioned in a comment' },
                  { key: 'deadline_reminders', label: 'Deadline reminders', desc: '24 hours before task due date' },
                  { key: 'project_updates', label: 'Project updates', desc: 'When project status changes' },
                  { key: 'weekly_digest', label: 'Weekly digest', desc: 'Weekly summary of your activity' },
                ].map((item) => (
                  <div
                    key={item.key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 16,
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.04)'
                    }}
                  >
                    <div>
                      <p style={{ color: 'white', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                        {item.label}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: 12 }}>{item.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleNotif(item.key)}
                      style={{
                        width: 44,
                        height: 24,
                        borderRadius: 12,
                        background: notifPrefs[item.key] ? '#7c3aed' : '#374151',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.3s'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: 4,
                        left: notifPrefs[item.key] ? 24 : 4,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: 'white',
                        transition: 'left 0.3s'
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 24 }}>
                Security Settings
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{
                  padding: 20,
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <h3 style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
                    Change Password
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                      <input
                        key={label}
                        type="password"
                        placeholder={label}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 8,
                          color: 'white',
                          fontSize: 14,
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    ))}
                    <button style={{
                      padding: '10px 20px',
                      width: 'fit-content',
                      background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                      border: 'none',
                      borderRadius: 8,
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}>
                      Update Password
                    </button>
                  </div>
                </div>
                <div style={{
                  padding: 20,
                  background: 'rgba(16,185,129,0.05)',
                  borderRadius: 10,
                  border: '1px solid rgba(16,185,129,0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                        AES-256 Encryption
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: 13 }}>Your data is encrypted at rest</p>
                    </div>
                    <span style={{ color: '#10b981', fontSize: 13, fontWeight: 600 }}>✓ Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 24 }}>
                Appearance
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 12 }}>Theme</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {[
                      { label: 'Dark', key: 'dark', bg: '#0a0a0f' },
                      { label: 'Light', key: 'light', bg: '#ffffff' },
                      { label: 'System', key: 'system', bg: 'linear-gradient(135deg, #0a0a0f, #ffffff)' },
                    ].map(t => (
                      <div
                        key={t.label}
                        onClick={() => applyTheme(t.key)}
                        style={{
                          padding: 16,
                          borderRadius: 10,
                          cursor: 'pointer',
                          border: theme === t.key ? '2px solid #7c3aed' : '2px solid rgba(255,255,255,0.08)',
                          background: 'rgba(255,255,255,0.02)',
                          width: 100,
                          textAlign: 'center',
                          transition: 'border 0.3s'
                        }}
                      >
                        <div style={{
                          width: '100%',
                          height: 48,
                          borderRadius: 6,
                          background: t.bg,
                          marginBottom: 8,
                          border: '1px solid rgba(255,255,255,0.1)'
                        }} />
                        <p style={{ color: theme === t.key ? '#a78bfa' : '#6b7280', fontSize: 13 }}>
                          {t.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 12 }}>Accent Color</p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'].map(color => (
                      <div
                        key={color}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: color,
                          cursor: 'pointer',
                          border: color === '#7c3aed' ? '3px solid white' : '3px solid transparent'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}