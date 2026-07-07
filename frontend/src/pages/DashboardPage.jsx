import { useEffect, useState } from 'react'
import { organizationsService, analyticsService } from '../services/projects'
import useAuthStore from '../store/authStore'
import useAppStore from '../store/appStore'
import { Zap, CheckSquare, AlertCircle, Folder, CheckCircle } from 'lucide-react'
import StatsCard from '../components/dashboard/StatsCard'
import useAnalytics from '../hooks/useAnalytics'
import useProjects from '../hooks/useProjects'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { currentOrg, setCurrentOrg } = useAppStore()
  const [orgs, setOrgs] = useState([])
  const { analytics } = useAnalytics(currentOrg?.id)
  const { projects: orgProjects } = useProjects(currentOrg?.id)
  const [loading, setLoading] = useState(true)
  const [showCreateOrg, setShowCreateOrg] = useState(false)
  const [newOrg, setNewOrg] = useState({ 
    name: '', 
    slug: '', 
    description: '' 
  })

  useEffect(() => {
    fetchOrgs()
  }, [])

  const fetchOrgs = async () => {
    try {
      const data = await organizationsService.getOrganizations()
      setOrgs(data.data || [])
      if (data.data?.length > 0 && !currentOrg) {
        setCurrentOrg(data.data[0])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const stats = analytics ? [
    {
      label: 'TOTAL TASKS',
      value: analytics.tasks.total,
      unit: 'tasks',
      change: `${analytics.tasks.in_progress} in progress`,
      icon: <Zap size={18} />,
      color: '#10b981'
    },
    {
      label: 'ACTIVE ISSUES',
      value: analytics.metrics.active_issues,
      unit: '',
      change: `${analytics.tasks.done} completed`,
      icon: <AlertCircle size={18} />,
      color: '#f59e0b'
    },
    {
      label: 'COMPLETION RATE',
      value: `${analytics.metrics.completion_rate}%`,
      unit: '',
      change: analytics.metrics.completion_rate >= 50 ? 'On track' : 'Needs attention',
      icon: <CheckCircle size={18} />,
      color: analytics.metrics.completion_rate >= 50 ? '#10b981' : '#ef4444'
    },
    {
      label: 'TOTAL PROJECTS',
      value: analytics.projects.total,
      unit: '',
      change: `${analytics.projects.active} active`,
      icon: <Folder size={18} />,
      color: '#7c3aed'
    },
  ] : []

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%' 
      }}>
        <div style={{ color: '#7c3aed', fontSize: 16 }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ 
          fontSize: 28, 
          fontWeight: 700, 
          color: 'white', 
          marginBottom: 4 
        }}>
          Engineering Dashboard
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>
          Monitoring performance and team delivery for {currentOrg?.name || 'your organization'}.
        </p>
      </div>

      {/* Real Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: 16, 
        marginBottom: 32 
      }}>
        {stats.map((stat, i) => (
          <StatsCard
            key={i}
            label={stat.label}
            value={stat.value}
            unit={stat.unit}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Priority Breakdown - Real Data */}
      {analytics && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: 24, 
          marginBottom: 24 
        }}>
          <div style={{
            background: '#13131f', 
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, 
            padding: 24
          }}>
            <h2 style={{ 
              fontSize: 16, 
              fontWeight: 600, 
              color: 'white', 
              marginBottom: 20 
            }}>
              Task Priority Overview
            </h2>
            {[
              { label: 'Critical', count: analytics.priority.critical, color: '#ef4444' },
              { label: 'High', count: analytics.priority.high, color: '#f97316' },
              { label: 'Medium', count: analytics.priority.medium, color: '#f59e0b' },
              { label: 'Low', count: analytics.priority.low, color: '#10b981' },
            ].map((p, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: 6 
                }}>
                  <span style={{ fontSize: 13, color: '#d1d5db' }}>{p.label}</span>
                  <span style={{ fontSize: 13, color: p.color, fontWeight: 600 }}>
                    {p.count}
                  </span>
                </div>
                <div style={{ 
                  height: 6, 
                  background: 'rgba(255,255,255,0.06)', 
                  borderRadius: 3 
                }}>
                  <div style={{
                    height: '100%', 
                    borderRadius: 3, 
                    background: p.color,
                    width: analytics.tasks.total > 0 
                      ? `${(p.count / analytics.tasks.total) * 100}%` 
                      : '0%',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#13131f', 
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, 
            padding: 24
          }}>
            <h2 style={{ 
              fontSize: 16, 
              fontWeight: 600, 
              color: 'white', 
              marginBottom: 20 
            }}>
              Task Status Overview
            </h2>
            {[
              { label: 'Backlog', count: analytics.tasks.backlog, color: '#6b7280' },
              { label: 'Todo', count: analytics.tasks.todo, color: '#3b82f6' },
              { label: 'In Progress', count: analytics.tasks.in_progress, color: '#f59e0b' },
              { label: 'In Review', count: analytics.tasks.in_review, color: '#a855f7' },
              { label: 'Done', count: analytics.tasks.done, color: '#10b981' },
            ].map((s, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: 6 
                }}>
                  <span style={{ fontSize: 13, color: '#d1d5db' }}>{s.label}</span>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>
                    {s.count} tasks
                  </span>
                </div>
                <div style={{ 
                  height: 6, 
                  background: 'rgba(255,255,255,0.06)', 
                  borderRadius: 3 
                }}>
                  <div style={{
                    height: '100%', 
                    borderRadius: 3, 
                    background: s.color,
                    width: analytics.tasks.total > 0 
                      ? `${(s.count / analytics.tasks.total) * 100}%` 
                      : '0%',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Organizations */}
      <div style={{
        background: '#13131f', 
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, 
        padding: 24
      }}>
        <h2 style={{ 
          fontSize: 16, 
          fontWeight: 600, 
          color: 'white', 
          marginBottom: 16 
        }}>
          Your Organizations
        </h2>
        {orgs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <CheckSquare size={40} color="#7c3aed" style={{ marginBottom: 16 }} />
            <h3 style={{ color: 'white', fontSize: 18, marginBottom: 8 }}>
              No Organization Yet
            </h3>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
              Create your first organization to get started!
            </p>
            <button
              onClick={() => setShowCreateOrg(true)}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                border: 'none', 
                borderRadius: 8, 
                padding: '12px 24px',
                color: 'white', 
                fontSize: 14, 
                fontWeight: 600, 
                cursor: 'pointer',
                margin: '0 auto'
              }}
            >
              + Create Organization
            </button>
          </div>
        ) : (
          orgs.map(org => (
            <div 
              key={org.id} 
              onClick={() => setCurrentOrg(org)}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: 12,
                padding: '12px 16px', 
                borderRadius: 8, 
                marginBottom: 8,
                background: currentOrg?.id === org.id 
                  ? 'rgba(124,58,237,0.15)' 
                  : 'transparent',
                border: currentOrg?.id === org.id 
                  ? '1px solid rgba(124,58,237,0.3)' 
                  : '1px solid transparent',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: 36, 
                height: 36, 
                borderRadius: 8,
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: 14, 
                fontWeight: 700, 
                color: 'white'
              }}>
                {org.name[0].toUpperCase()}
              </div>
              <div>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>
                  {org.name}
                </p>
                <p style={{ color: '#6b7280', fontSize: 12 }}>
                  {org.slug}
                </p>
              </div>
              {currentOrg?.id === org.id && (
                <span style={{
                  marginLeft: 'auto', 
                  fontSize: 11,
                  background: 'rgba(124,58,237,0.2)', 
                  color: '#a78bfa',
                  padding: '3px 10px', 
                  borderRadius: 10
                }}>
                  Active
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Org Modal */}
      {showCreateOrg && (
        <div style={{
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50
        }}>
          <div style={{
            background: '#13131f', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, 
            padding: 32, 
            width: 440
          }}>
            <h2 style={{ 
              color: 'white', 
              fontSize: 18, 
              fontWeight: 600, 
              marginBottom: 24 
            }}>
              Create Organization
            </h2>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 16 
            }}>
              <div>
                <label style={{ 
                  fontSize: 13, 
                  color: '#9ca3af', 
                  marginBottom: 6, 
                  display: 'block' 
                }}>
                  Organization Name
                </label>
                <input
                  value={newOrg.name}
                  onChange={e => setNewOrg({ 
                    ...newOrg, 
                    name: e.target.value, 
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-') 
                  })}
                  placeholder="e.g. Kishore Engineering"
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
                <label style={{ 
                  fontSize: 13, 
                  color: '#9ca3af', 
                  marginBottom: 6, 
                  display: 'block' 
                }}>
                  Slug (auto-generated)
                </label>
                <input
                  value={newOrg.slug}
                  onChange={e => setNewOrg({ ...newOrg, slug: e.target.value })}
                  placeholder="kishore-engineering"
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
                <label style={{ 
                  fontSize: 13, 
                  color: '#9ca3af', 
                  marginBottom: 6, 
                  display: 'block' 
                }}>
                  Description
                </label>
                <input
                  value={newOrg.description}
                  onChange={e => setNewOrg({ ...newOrg, description: e.target.value })}
                  placeholder="What does your organization do?"
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
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button 
                  onClick={() => setShowCreateOrg(false)} 
                  style={{
                    flex: 1, 
                    padding: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, 
                    color: '#9ca3af', 
                    fontSize: 14, 
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    try {
                      const { organizationsService } = await import('../services/projects')
                      await organizationsService.createOrganization(newOrg)
                      setShowCreateOrg(false)
                      setNewOrg({ name: '', slug: '', description: '' })
                      fetchOrgs()
                    } catch (err) { 
                      console.error(err) 
                    }
                  }} 
                  style={{
                    flex: 1, 
                    padding: '10px',
                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    border: 'none', 
                    borderRadius: 8,
                    color: 'white', 
                    fontSize: 14, 
                    fontWeight: 600, 
                    cursor: 'pointer'
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}