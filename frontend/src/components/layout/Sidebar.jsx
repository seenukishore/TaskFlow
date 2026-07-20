import { Link, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import useAppStore from '../../store/appStore'
import {
  CheckSquare, Search, Inbox, ListTodo,
  Folder, Users, BarChart2, Settings,
  Plus, HelpCircle, User, LogOut, Activity
} from 'lucide-react'

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { currentOrg } = useAppStore()

  const navItems = [
    { icon: <Search size={18} />, label: 'Search', path: '/dashboard' },
    { icon: <Inbox size={18} />, label: 'Inbox', path: '/inbox' },
    { icon: <ListTodo size={18} />, label: 'My Tasks', path: '/tasks' },
    { icon: <Folder size={18} />, label: 'Projects', path: '/projects' },
    { icon: <Users size={18} />, label: 'Team', path: '/team' },
    { icon: <BarChart2 size={18} />, label: 'Analytics', path: '/analytics' },
    { icon: <Activity size={18} />, label: 'Activity', path: '/activity' },
    { icon: <Settings size={18} />, label: 'Settings', path: '/settings' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div style={{
      width: 240, minHeight: '100vh',
      background: '#0f0f1a',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 0'
    }}>
      {/* Logo + Org */}
      <div style={{ padding: '0 16px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <CheckSquare size={16} color="white" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>TaskFlow</span>
        </div>
        {currentOrg && (
          <p style={{ fontSize: 11, color: '#6b7280', paddingLeft: 42, textTransform: 'uppercase', letterSpacing: 1 }}>
            {currentOrg.name}
          </p>
        )}
      </div>

      {/* Nav Items */}
      <div style={{ flex: 1, padding: '0 8px' }}>
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8, marginBottom: 2,
              background: isActive(item.path) ? 'rgba(124,58,237,0.15)' : 'transparent',
              color: isActive(item.path) ? '#a78bfa' : '#6b7280',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
              onMouseEnter={e => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.color = '#d1d5db'
                }
              }}
              onMouseLeave={e => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              {item.icon}
              <span style={{ fontSize: 14, fontWeight: isActive(item.path) ? 500 : 400 }}>
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* New Issue Button */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <button style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8,
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          border: 'none', borderRadius: 8, padding: '10px',
          color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer'
        }}>
          <Plus size={16} /> New Issue
        </button>
      </div>

      {/* Bottom */}
      <div style={{ padding: '0 8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 12px', borderRadius: 8,
          color: '#6b7280', cursor: 'pointer'
        }}>
          <HelpCircle size={18} />
          <span style={{ fontSize: 14 }}>Support</span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 12px', borderRadius: 8, marginBottom: 8,
          color: '#6b7280', cursor: 'pointer'
        }}>
          <User size={18} />
          <span style={{ fontSize: 14 }}>
            {user?.full_name || 'Account'}
          </span>
        </div>
        <div
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 8,
            color: '#ef4444', cursor: 'pointer'
          }}>
          <LogOut size={18} />
          <span style={{ fontSize: 14 }}>Logout</span>
        </div>
      </div>
    </div>
  )
}