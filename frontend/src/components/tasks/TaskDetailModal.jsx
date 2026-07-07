import { useState, useEffect } from 'react'
import { tasksService } from '../../services/tasks'
import useAppStore from '../../store/appStore'
import {
  X, AlertTriangle, Clock, CheckCircle,
  MessageSquare, Send, Zap, User
} from 'lucide-react'

export default function TaskDetailModal({ task, onClose, onUpdate }) {
  const { currentOrg } = useAppStore()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [status, setStatus] = useState(task?.status || 'backlog')
  const [priority, setPriority] = useState(task?.priority || 'medium')
  const [loading, setLoading] = useState(false)
  const [commentLoading, setCommentLoading] = useState(false)

  useEffect(() => {
    if (task) fetchComments()
  }, [task])

  const fetchComments = async () => {
    try {
      const data = await tasksService.getComments(currentOrg.id, task.project_id, task.id)
      setComments(data.data || [])
    } catch (err) { console.error(err) }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true)
      await tasksService.updateTask(currentOrg.id, task.project_id, task.id, { status: newStatus })
      setStatus(newStatus)
      onUpdate && onUpdate()
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handlePriorityChange = async (newPriority) => {
    try {
      setLoading(true)
      await tasksService.updateTask(currentOrg.id, task.project_id, task.id, { priority: newPriority })
      setPriority(newPriority)
      onUpdate && onUpdate()
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleComment = async () => {
    if (!newComment.trim()) return
    try {
      setCommentLoading(true)
      await tasksService.createComment(currentOrg.id, task.project_id, task.id, { content: newComment })
      setNewComment('')
      fetchComments()
    } catch (err) { console.error(err) }
    finally { setCommentLoading(false) }
  }

  const priorityColors = { low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' }
  const statusColors = { backlog: '#6b7280', todo: '#3b82f6', in_progress: '#f59e0b', in_review: '#a855f7', done: '#10b981' }

  if (!task) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: 24
    }}>
      <div style={{
        background: '#13131f', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, width: '100%', maxWidth: 860,
        maxHeight: '90vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '24px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ flex: 1, marginRight: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: 1,
                color: priorityColors[priority], textTransform: 'uppercase',
                background: `${priorityColors[priority]}20`,
                padding: '3px 10px', borderRadius: 6
              }}>
                {priority}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: 1,
                color: statusColors[status], textTransform: 'uppercase',
                background: `${statusColors[status]}20`,
                padding: '3px 10px', borderRadius: 6
              }}>
                {status?.replace('_', ' ')}
              </span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 4 }}>
              {task.title}
            </h2>
            <p style={{ fontSize: 13, color: '#6b7280' }}>
              Created {new Date(task.created_at).toLocaleDateString()}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: 8, cursor: 'pointer', color: '#6b7280'
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left - Main Content */}
          <div style={{ flex: 1, padding: 24, overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Description */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                Description
              </h3>
              <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.7 }}>
                {task.description || 'No description provided.'}
              </p>
            </div>

            {/* AI Summary */}
            {task.ai_summary && (
              <div style={{
                background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: 10, padding: 16, marginBottom: 24
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Zap size={14} color="#a78bfa" />
                  <span style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                    AI Summary
                  </span>
                </div>
                <p style={{ color: '#c4b5fd', fontSize: 13, lineHeight: 1.6 }}>{task.ai_summary}</p>
              </div>
            )}

            {/* AI Priority */}
            {task.ai_priority && task.ai_priority !== priority && (
              <div style={{
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 10, padding: 16, marginBottom: 24
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={14} color="#f59e0b" />
                  <span style={{ fontSize: 13, color: '#fcd34d' }}>
                    AI suggests <strong>{task.ai_priority}</strong> priority for this task
                  </span>
                </div>
              </div>
            )}

            {/* Comments */}
            <div>
              <h3 style={{ fontSize: 13, color: '#6b7280', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
                Comments ({comments.length})
              </h3>

              {comments.length === 0 ? (
                <p style={{ color: '#4b5563', fontSize: 13, marginBottom: 16 }}>No comments yet. Be the first!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                  {comments.map(comment => (
                    <div key={comment.id} style={{
                      display: 'flex', gap: 10,
                      padding: 14, background: 'rgba(255,255,255,0.03)',
                      borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)'
                    }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: 'white'
                      }}>
                        <User size={14} />
                      </div>
                      <div>
                        <p style={{ color: '#6b7280', fontSize: 11, marginBottom: 4 }}>
                          {new Date(comment.created_at).toLocaleDateString()}
                        </p>
                        <p style={{ color: '#d1d5db', fontSize: 13, lineHeight: 1.5 }}>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleComment()}
                  placeholder="Add a comment..."
                  style={{
                    flex: 1, padding: '10px 14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, color: 'white', fontSize: 13,
                    outline: 'none'
                  }}
                />
                <button onClick={handleComment} disabled={commentLoading || !newComment.trim()} style={{
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  border: 'none', borderRadius: 8, padding: '10px 16px',
                  color: 'white', cursor: 'pointer', opacity: commentLoading ? 0.5 : 1
                }}>
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Right - Sidebar */}
          <div style={{ width: 220, padding: 24, overflowY: 'auto' }}>
            {/* Status */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                Status
              </label>
              <select
                value={status}
                onChange={e => handleStatusChange(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px',
                  background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: 'white', fontSize: 13, outline: 'none'
                }}
              >
                {['backlog', 'todo', 'in_progress', 'in_review', 'done'].map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={e => handlePriorityChange(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px',
                  background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: 'white', fontSize: 13, outline: 'none'
                }}
              >
                {['low', 'medium', 'high', 'critical'].map(p => (
                  <option key={p} value={p}>{p.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* AI Priority Badge */}
            {task.ai_priority && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  AI Priority
                </label>
                <span style={{
                  display: 'inline-block', padding: '4px 12px', borderRadius: 6,
                  background: `${priorityColors[task.ai_priority]}20`,
                  color: priorityColors[task.ai_priority],
                  fontSize: 12, fontWeight: 600, textTransform: 'uppercase'
                }}>
                  🤖 {task.ai_priority}
                </span>
              </div>
            )}

            {/* Story Points */}
            {task.story_points && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Story Points
                </label>
                <span style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>
                  {task.story_points}
                </span>
              </div>
            )}

            {/* Due Date */}
            {task.due_date && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Due Date
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} color="#6b7280" />
                  <span style={{ color: '#d1d5db', fontSize: 13 }}>
                    {new Date(task.due_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {/* Mark Complete */}
            <button
              onClick={() => handleStatusChange('done')}
              disabled={status === 'done'}
              style={{
                width: '100%', padding: '10px',
                background: status === 'done' ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                border: status === 'done' ? '1px solid rgba(16,185,129,0.4)' : 'none',
                borderRadius: 8, color: status === 'done' ? '#10b981' : 'white',
                fontSize: 13, fontWeight: 600, cursor: status === 'done' ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
            >
              <CheckCircle size={15} />
              {status === 'done' ? 'Completed!' : 'Mark as Complete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}