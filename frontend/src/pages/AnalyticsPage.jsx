import { useState, useEffect } from 'react'
import { analyticsService } from '../services/projects'
import { projectsService } from '../services/projects'
import useAppStore from '../store/appStore'
import { TrendingUp, Clock, CheckCircle, AlertTriangle, BarChart2, Zap, Folder } from 'lucide-react'

export default function AnalyticsPage() {
  const { currentOrg } = useAppStore()
  const [analytics, setAnalytics] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentOrg) fetchData()
  }, [currentOrg])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [analyticsData, projectsData] = await Promise.all([
        analyticsService.getAnalytics(currentOrg.id),
        projectsService.getProjects(currentOrg.id)
      ])
      setAnalytics(analyticsData)
      setProjects(projectsData.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!currentOrg) return (
    <div style={{ padding: 32, color: '#6b7280', textAlign: 'center', marginTop: 80 }}>
      Select an organization first from Dashboard
    </div>
  )

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ color: '#7c3aed' }}>Loading analytics...</div>
    </div>
  )

  const metrics = [
    {
      label: 'TOTAL TASKS',
      value: analytics?.tasks.total || 0,
      unit: 'tasks',
      change: `${analytics?.tasks.in_progress || 0} in progress`,
      icon: <Zap size={20} />,
      color: '#7c3aed'
    },
    {
      label: 'ACTIVE ISSUES',
      value: analytics?.metrics.active_issues || 0,
      unit: '',
      change: `${analytics?.tasks.done || 0} completed`,
      icon: <AlertTriangle size={20} />,
      color: '#f59e0b'
    },
    {
      label: 'COMPLETION RATE',
      value: `${analytics?.metrics.completion_rate || 0}%`,
      unit: '',
      change: analytics?.metrics.completion_rate >= 50 ? 'On track' : 'Needs attention',
      icon: <CheckCircle size={20} />,
      color: analytics?.metrics.completion_rate >= 50 ? '#10b981' : '#ef4444'
    },
    {
      label: 'TOTAL PROJECTS',
      value: analytics?.projects.total || 0,
      unit: '',
      change: `${analytics?.projects.active || 0} active`,
      icon: <Folder size={20} />,
      color: '#10b981'
    },
  ]

  const statusStats = [
    { label: 'Backlog', count: analytics?.tasks.backlog || 0, color: '#6b7280' },
    { label: 'Todo', count: analytics?.tasks.todo || 0, color: '#3b82f6' },
    { label: 'In Progress', count: analytics?.tasks.in_progress || 0, color: '#f59e0b' },
    { label: 'In Review', count: analytics?.tasks.in_review || 0, color: '#a855f7' },
    { label: 'Done', count: analytics?.tasks.done || 0, color: '#10b981' },
  ]

  const priorityStats = [
    { label: 'Critical', count: analytics?.priority.critical || 0, color: '#ef4444' },
    { label: 'High', count: analytics?.priority.high || 0, color: '#f97316' },
    { label: 'Medium', count: analytics?.priority.medium || 0, color: '#f59e0b' },
    { label: 'Low', count: analytics?.priority.low || 0, color: '#10b981' },
  ]

  const totalTasks = analytics?.tasks.total || 0

  return (
    <div style={{ padding: '32px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 4 }}>Analytics</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>
          Real-time performance metrics for {currentOrg?.name}.
        </p>
      </div>

      {/* Metric Cards - Real Data */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{
            background: '#13131f', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '20px 24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' }}>
                {m.label}
              </span>
              <span style={{ color: m.color }}>{m.icon}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: 'white' }}>{m.value}</span>
              {m.unit && <span style={{ fontSize: 13, color: '#6b7280' }}>{m.unit}</span>}
            </div>
            <span style={{ fontSize: 12, color: m.color }}>{m.change}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Task Status */}
        <div style={{
          background: '#13131f', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: 24
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 20 }}>
            Task Status Breakdown
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {statusStats.map((s, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#d1d5db' }}>{s.label}</span>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>{s.count} tasks</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                  <div style={{
                    height: '100%', borderRadius: 3, background: s.color,
                    width: totalTasks > 0 ? `${(s.count / totalTasks) * 100}%` : '0%',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div style={{
          background: '#13131f', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: 24
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 20 }}>
            Priority Distribution
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {priorityStats.map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#d1d5db' }}>{p.label}</span>
                  <span style={{ fontSize: 13, color: p.color, fontWeight: 600 }}>{p.count}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                  <div style={{
                    height: '100%', borderRadius: 3, background: p.color,
                    width: totalTasks > 0 ? `${(p.count / totalTasks) * 100}%` : '0%',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Overview - Real Data */}
      <div style={{
        background: '#13131f', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: 24
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 20 }}>
          Projects Overview
        </h2>
        {projects.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', padding: 24 }}>
            No projects yet - create your first project!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {projects.map(proj => (
              <div key={proj.id} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: 16, background: 'rgba(255,255,255,0.02)',
                borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)'
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(124,58,237,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <BarChart2 size={18} color="#7c3aed" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                    {proj.name}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: 12 }}>{proj.description || 'No description'}</p>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 12, padding: '4px 10px', borderRadius: 6, fontWeight: 600,
                    background: proj.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.15)',
                    color: proj.status === 'active' ? '#10b981' : '#6b7280',
                    textTransform: 'uppercase'
                  }}>
                    {proj.status}
                  </span>
                  <span style={{
                    fontSize: 12, padding: '4px 10px', borderRadius: 6,
                    background: 'rgba(124,58,237,0.15)', color: '#a78bfa'
                  }}>
                    {proj.health}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}