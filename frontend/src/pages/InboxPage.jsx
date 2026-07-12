import { useState, useEffect } from 'react'
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle, Zap, Trash2 } from 'lucide-react'
import { notificationsService } from '../services/notifications'

export default function InboxPage() {
  const [filter, setFilter] = useState('all')
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const data = await notificationsService.getNotifications({ limit: 50 })
      setNotifications(data.data || [])
      setUnreadCount(data.unread_count || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await notificationsService.markAsRead(id)
      setNotifications(prev => prev.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) { console.error(err) }
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id) => {
    try {
      await notificationsService.deleteNotification(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (err) { console.error(err) }
  }

  const getIcon = (type) => {
    const icons = {
      task_created: { icon: <Zap size={16} color="#7c3aed" />, color: '#7c3aed' },
      task_updated: { icon: <Info size={16} color="#3b82f6" />, color: '#3b82f6' },
      task_completed: { icon: <CheckCircle size={16} color="#10b981" />, color: '#10b981' },
      comment_added: { icon: <Bell size={16} color="#f59e0b" />, color: '#f59e0b' },
      deadline: { icon: <AlertTriangle size={16} color="#ef4444" />, color: '#ef4444' },
    }
    return icons[type] || { icon: <Bell size={16} color="#6b7280" />, color: '#6b7280' }
  }

  const filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter(n => !n.is_read)
      : notifications.filter(n => n.type === filter)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ color: '#7c3aed' }}>Loading notifications...</div>
    </div>
  )

  return (
    <div style={{ padding: '32px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 4 }}>Inbox</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 8, padding: '10px 18px',
            color: '#a78bfa', fontSize: 14, fontWeight: 600, cursor: 'pointer'
          }}>
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'task_created', label: 'Tasks' },
          { key: 'comment_added', label: 'Comments' },
          { key: 'task_completed', label: 'Completed' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
            padding: '8px 16px', borderRadius: 8,
            background: filter === tab.key ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)',
            border: filter === tab.key ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.08)',
            color: filter === tab.key ? '#a78bfa' : '#9ca3af',
            fontSize: 13, cursor: 'pointer'
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{
        background: '#13131f', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, overflow: 'hidden'
      }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Bell size={40} color="#374151" style={{ marginBottom: 16 }} />
            <p style={{ color: '#6b7280', fontSize: 14 }}>No notifications yet</p>
            <p style={{ color: '#4b5563', fontSize: 12, marginTop: 8 }}>
              Create tasks and add comments to see notifications here!
            </p>
          </div>
        ) : (
          filtered.map((notif, i) => {
            const { icon, color } = getIcon(notif.type)
            return (
              <div
                key={notif.id}
                onClick={() => !notif.is_read && handleMarkRead(notif.id)}
                style={{
                  display: 'flex', gap: 16, padding: '20px 24px',
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  background: !notif.is_read ? 'rgba(124,58,237,0.05)' : 'transparent',
                  cursor: !notif.is_read ? 'pointer' : 'default',
                  transition: 'background 0.2s'
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: `${color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <p style={{
                      fontSize: 14, fontWeight: notif.is_read ? 400 : 600,
                      color: notif.is_read ? '#d1d5db' : 'white'
                    }}>
                      {notif.title}
                    </p>
                    <span style={{ fontSize: 12, color: '#4b5563', flexShrink: 0, marginLeft: 16 }}>
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
                    {notif.message}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {!notif.is_read && (
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#7c3aed', flexShrink: 0
                    }} />
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(notif.id) }}
                    style={{
                      background: 'none', border: 'none',
                      cursor: 'pointer', color: '#4b5563',
                      padding: 4, borderRadius: 4
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}