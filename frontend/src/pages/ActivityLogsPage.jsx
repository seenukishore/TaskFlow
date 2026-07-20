import { useState, useEffect } from 'react'
import useAppStore from '../store/appStore'
import api from '../services/api'
import { Activity, User, Folder, CheckSquare, MessageSquare, Paperclip } from 'lucide-react'

export default function ActivityLogsPage() {
  const { currentOrg } = useAppStore()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  useEffect(() => {
    if (currentOrg) fetchLogs()
  }, [currentOrg, page])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/activity-logs/${currentOrg.id}`, {
        params: { page, limit }
      })
      setLogs(res.data.data || [])
      setTotal(res.data.total || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (entityType) => {
    const icons = {
      task: <CheckSquare size={14} color="#7c3aed" />,
      project: <Folder size={14} color="#3b82f6" />,
      organization: <User size={14} color="#10b981" />,
      comment: <MessageSquare size={14} color="#f59e0b" />,
      attachment: <Paperclip size={14} color="#ec4899" />,
    }
    return icons[entityType] || <Activity size={14} color="#6b7280" />
  }

  const getActionColor = (action) => {
    const colors = {
      created: '#10b981',
      updated: '#f59e0b',
      deleted: '#ef4444',
      commented: '#3b82f6',
    }
    return colors[action] || '#6b7280'
  }

  if (!currentOrg) return (
    <div style={{ padding: 32, color: '#6b7280', textAlign: 'center', marginTop: 80 }}>
      Select an organization first from Dashboard
    </div>
  )

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ color: '#7c3aed' }}>Loading activity logs...</div>
    </div>
  )

  return (
    <div style={{ padding: '32px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 4 }}>
          Activity Logs
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>
          Track all actions in {currentOrg?.name}. Total: {total} activities.
        </p>
      </div>

      {/* Logs */}
      <div style={{
        background: '#13131f', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, overflow: 'hidden'
      }}>
        {logs.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Activity size={40} color="#374151" style={{ marginBottom: 16 }} />
            <p style={{ color: '#6b7280', fontSize: 14 }}>No activity logs yet</p>
            <p style={{ color: '#4b5563', fontSize: 12, marginTop: 8 }}>
              Start creating projects and tasks to see activity here!
            </p>
          </div>
        ) : (
          <>
            {logs.map((log, i) => (
              <div key={log.id} style={{
                display: 'flex', gap: 16, padding: '16px 24px',
                borderBottom: i < logs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                alignItems: 'flex-start'
              }}>
                {/* Icon */}
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 2
                }}>
                  {getIcon(log.entity_type)}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: getActionColor(log.action),
                      textTransform: 'uppercase', letterSpacing: 0.5,
                      background: `${getActionColor(log.action)}20`,
                      padding: '2px 8px', borderRadius: 4
                    }}>
                      {log.action}
                    </span>
                    <span style={{ fontSize: 12, color: '#4b5563', textTransform: 'capitalize' }}>
                      {log.entity_type}
                    </span>
                  </div>
                  <p style={{ color: '#d1d5db', fontSize: 14, marginBottom: 4 }}>
                    {log.description}
                  </p>
                  {log.old_value && log.new_value && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{
                        fontSize: 11, color: '#ef4444',
                        background: 'rgba(239,68,68,0.1)',
                        padding: '2px 8px', borderRadius: 4
                      }}>
                        {JSON.stringify(log.old_value).slice(0, 30)}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: 11 }}>→</span>
                      <span style={{
                        fontSize: 11, color: '#10b981',
                        background: 'rgba(16,185,129,0.1)',
                        padding: '2px 8px', borderRadius: 4
                      }}>
                        {JSON.stringify(log.new_value).slice(0, 30)}
                      </span>
                    </div>
                  )}
                  <p style={{ color: '#4b5563', fontSize: 12 }}>
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.04)'
            }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>
                Showing {logs.length} of {total} activities
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: '6px 14px', borderRadius: 8,
                    background: page === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: page === 1 ? '#4b5563' : '#9ca3af',
                    fontSize: 13, cursor: page === 1 ? 'not-allowed' : 'pointer'
                  }}>
                  Previous
                </button>
                <span style={{
                  padding: '6px 14px', borderRadius: 8,
                  background: 'rgba(124,58,237,0.2)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  color: '#a78bfa', fontSize: 13
                }}>
                  {page}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={logs.length < limit}
                  style={{
                    padding: '6px 14px', borderRadius: 8,
                    background: logs.length < limit ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: logs.length < limit ? '#4b5563' : '#9ca3af',
                    fontSize: 13, cursor: logs.length < limit ? 'not-allowed' : 'pointer'
                  }}>
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}