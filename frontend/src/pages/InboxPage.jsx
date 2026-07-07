import { useState, useEffect } from 'react'
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle, Zap } from 'lucide-react'
import { tasksService } from '../services/tasks'
import { projectsService } from '../services/projects'
import useAppStore from '../store/appStore'

export default function InboxPage() {
  const { currentOrg } = useAppStore()
  const [filter, setFilter] = useState('all')
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentOrg) fetchRealNotifications()
  }, [currentOrg])

  const fetchRealNotifications = async () => {
    try {
      setLoading(true)
      const projectsData = await projectsService.getProjects(currentOrg.id)
      const projects = projectsData.data || []

      let realNotifications = []

      for (const proj of projects) {
        const tasksData = await tasksService.getTasks(currentOrg.id, proj.id, { limit: 50 })
        const tasks = tasksData.data || []

        tasks.forEach(task => {
          // Task created notification
          realNotifications.push({
            id: `task-created-${task.id}`,
            type: 'task_assigned',
            read: false,
            title: 'Task created',
            message: `"${task.title}" was created in ${proj.name}`,
            time: new Date(task.created_at).toLocaleDateString(),
            icon: 'task',
            color: '#7c3aed'
          })

          // Critical task notification
          if (task.priority === 'critical') {
            realNotifications.push({
              id: `task-critical-${task.id}`,
              type: 'deadline',
              read: false,
              title: 'Critical priority task',
              message: `"${task.title}" is marked as CRITICAL priority. Immediate attention required!`,
              time: new Date(task.created_at).toLocaleDateString(),
              icon: 'deadline',
              color: '#ef4444'
            })
          }

          // AI summary notification
          if (task.ai_summary) {
            realNotifications.push({
              id: `task-ai-${task.id}`,
              type: 'comment',
              read: true,
              title: 'AI analyzed your task',
              message: `AI Summary for "${task.title}": ${task.ai_summary}`,
              time: new Date(task.created_at).toLocaleDateString(),
              icon: 'comment',
              color: '#3b82f6'
            })
          }

          // Done task notification
          if (task.status === 'done') {
            realNotifications.push({
              id: `task-done-${task.id}`,
              type: 'task_completed',
              read: true,
              title: 'Task completed',
              message: `"${task.title}" has been marked as Done in ${proj.name}`,
              time: new Date(task.updated_at).toLocaleDateString(),
              icon: 'done',
              color: '#10b981'
            })
          }
        })

        // Project notification
        realNotifications.push({
          id: `project-${proj.id}`,
          type: 'project_update',
          read: true,
          title: 'Project created',
          message: `Project "${proj.name}" is ${proj.status} with ${proj.health} health`,
          time: new Date(proj.created_at).toLocaleDateString(),
          icon: 'project',
          color: '#10b981'
        })
      }

      setNotifications(realNotifications)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (type, color) => {
    const icons = {
      task: <Zap size={16} color={color} />,
      comment: <Bell size={16} color={color} />,
      project: <CheckCircle size={16} color={color} />,
      mention: <Info size={16} color={color} />,
      deadline: <AlertTriangle size={16} color={color} />,
      done: <CheckCheck size={16} color={color} />,
    }
    return icons[type] || <Bell size={16} color={color} />
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter)

  const unreadCount = notifications.filter(n => !n.read).length

  if (!currentOrg) return (
    <div style={{ padding: 32, color: '#6b7280', textAlign: 'center', marginTop: 80 }}>
      Select an organization first from Dashboard
    </div>
  )

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
          <button onClick={markAllRead} style={{
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
          { key: 'task_assigned', label: 'Tasks' },
          { key: 'comment', label: 'AI Analysis' },
          { key: 'deadline', label: 'Critical' },
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
            <p style={{ color: '#6b7280', fontSize: 14 }}>No notifications</p>
          </div>
        ) : (
          filtered.map((notif, i) => (
            <div
              key={notif.id}
              onClick={() => markRead(notif.id)}
              style={{
                display: 'flex', gap: 16, padding: '20px 24px',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                background: !notif.read ? 'rgba(124,58,237,0.05)' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: `${notif.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {getIcon(notif.icon, notif.color)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <p style={{
                    fontSize: 14, fontWeight: notif.read ? 400 : 600,
                    color: notif.read ? '#d1d5db' : 'white'
                  }}>
                    {notif.title}
                  </p>
                  <span style={{ fontSize: 12, color: '#4b5563', flexShrink: 0, marginLeft: 16 }}>
                    {notif.time}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#7c3aed', flexShrink: 0, marginTop: 6
                }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}