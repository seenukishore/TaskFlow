import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import useAppStore from '../../store/appStore'
import { Search, Bell, Filter, SlidersHorizontal, Plus } from 'lucide-react'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { currentOrg } = useAppStore()
  const [activeTab, setActiveTab] = useState('List')

  const getTabs = () => {
    const path = location.pathname
    if (path === '/projects' || path === '/tasks') return ['List', 'Board', 'Calendar']
    return []
  }

  return (
    <div style={{
      height: 56, background: '#0f0f1a',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16, flexShrink: 0,
    }}>
      {/* Title + Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flex: 1 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>
          {currentOrg ? currentOrg.name : 'TaskFlow'}
        </span>

        {getTabs().length > 0 && (
          <div style={{ display: 'flex', gap: 4 }}>
            {getTabs().map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '6px 14px', borderRadius: 6,
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: activeTab === tab ? 'white' : '#6b7280',
                fontSize: 14, fontWeight: activeTab === tab ? 500 : 400,
                borderBottom: activeTab === tab ? '2px solid #7c3aed' : '2px solid transparent',
              }}>
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8, padding: '6px 12px', width: 220,
      }}>
        <Search size={14} color="#6b7280" />
        <input
          placeholder="Search..."
          onChange={e => {
            const val = e.target.value
            if (val.length > 2) {
              window.dispatchEvent(new CustomEvent('global-search', { detail: val }))
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') navigate('/tasks')
          }}
          style={{
            background: 'none', border: 'none',
            outline: 'none', color: 'white',
            fontSize: 13, width: '100%',
          }}
        />
        <span style={{
          fontSize: 11, color: '#4b5563',
          background: 'rgba(255,255,255,0.05)',
          padding: '2px 6px', borderRadius: 4,
        }}>
          ⌘K
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Filter */}
        <button
          onClick={() => navigate('/projects')}
          title="Filter Projects"
          style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#6b7280'
          }}>
          <Filter size={15} />
        </button>

        {/* Analytics */}
        <button
          onClick={() => navigate('/analytics')}
          title="Analytics"
          style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#6b7280'
          }}>
          <SlidersHorizontal size={15} />
        </button>

        {/* New Issue */}
        <button
          onClick={() => navigate('/tasks')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            border: 'none', borderRadius: 8, padding: '7px 14px',
            color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
          <Plus size={14} /> New Issue
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate('/inbox')}
          style={{
            background: 'none', border: 'none',
            cursor: 'pointer', color: '#6b7280',
            position: 'relative', padding: 6,
          }}>
          <Bell size={18} />
        </button>

        {/* Profile */}
        <div
          onClick={() => navigate('/settings')}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer',
          }}>
          {user?.full_name?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </div>
  )
}