import { useEffect, useState } from 'react'
import { tasksService } from '../services/tasks'
import { projectsService } from '../services/projects'
import useAppStore from '../store/appStore'
import { Plus, Clock } from 'lucide-react'  // Removed unused imports
import TaskDetailModal from '../components/tasks/TaskDetailModal'

export default function TasksPage() {
  const { currentOrg } = useAppStore()
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium', 
    status: 'backlog' 
  })
  const [selectedTask, setSelectedTask] = useState(null)

  useEffect(() => {
    if (currentOrg) fetchProjects()
  }, [currentOrg])

  useEffect(() => {
    if (selectedProject) fetchTasks()
  }, [selectedProject])

  const fetchProjects = async () => {
    try {
      const data = await projectsService.getProjects(currentOrg.id)
      setProjects(data.data || [])
      if (data.data?.length > 0) setSelectedProject(data.data[0])
    } catch (err) { 
      console.error(err) 
    }
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await tasksService.getTasks(currentOrg.id, selectedProject.id)
      setTasks(data.data || [])
    } catch (err) { 
      console.error(err) 
    } finally { 
      setLoading(false) 
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      if (!currentOrg) {
        alert('Please select an organization first from Dashboard!')
        return
      }
      if (!selectedProject) {
        alert('Please select a project first!')
        return
      }
      await tasksService.createTask(currentOrg.id, selectedProject.id, newTask)
      setNewTask({ 
        title: '', 
        description: '', 
        priority: 'medium', 
        status: 'backlog' 
      })
      setShowCreate(false)
      fetchTasks()
    } catch (err) { 
      console.error(err) 
    }
  }

  const priorityColor = { 
    low: '#10b981', 
    medium: '#f59e0b', 
    high: '#f97316', 
    critical: '#ef4444' 
  }
  
  const statusColor = { 
    backlog: '#6b7280', 
    todo: '#3b82f6', 
    in_progress: '#f59e0b', 
    in_review: '#a855f7', 
    done: '#10b981' 
  }

  const columns = [
    { key: 'backlog', label: 'BACKLOG' },
    { key: 'todo', label: 'TODO' },
    { key: 'in_progress', label: 'IN PROGRESS' },
    { key: 'in_review', label: 'IN REVIEW' },
    { key: 'done', label: 'DONE' },
  ]

  if (!currentOrg) {
    return (
      <div style={{ 
        padding: 32, 
        color: '#6b7280', 
        textAlign: 'center', 
        marginTop: 80 
      }}>
        Select an organization first from Dashboard
      </div>
    )
  }

  return (
    <div style={{ padding: '32px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 24 
      }}>
        <div>
          <h1 style={{ 
            fontSize: 28, 
            fontWeight: 700, 
            color: 'white', 
            marginBottom: 4 
          }}>
            Tasks
          </h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>
            Manage and track your team's work.
          </p>
        </div>
        <button 
          onClick={() => setShowCreate(true)} 
          style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            border: 'none', 
            borderRadius: 8, 
            padding: '10px 18px',
            color: 'white', 
            fontSize: 14, 
            fontWeight: 600, 
            cursor: 'pointer'
          }}
        >
          <Plus size={16} /> New Issue
        </button>
      </div>

      {/* Project Selector */}
      <div style={{ 
        display: 'flex', 
        gap: 8, 
        marginBottom: 24, 
        overflowX: 'auto' 
      }}>
        {projects.map(p => (
          <button 
            key={p.id} 
            onClick={() => setSelectedProject(p)} 
            style={{
              padding: '8px 16px', 
              borderRadius: 8,
              background: selectedProject?.id === p.id 
                ? 'rgba(124,58,237,0.2)' 
                : 'rgba(255,255,255,0.05)',
              border: selectedProject?.id === p.id 
                ? '1px solid rgba(124,58,237,0.4)' 
                : '1px solid rgba(255,255,255,0.08)',
              color: selectedProject?.id === p.id 
                ? '#a78bfa' 
                : '#9ca3af',
              fontSize: 13, 
              cursor: 'pointer', 
              whiteSpace: 'nowrap'
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
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
            width: 480
          }}>
            <h2 style={{ 
              color: 'white', 
              fontSize: 18, 
              fontWeight: 600, 
              marginBottom: 24 
            }}>
              Create New Issue
            </h2>
            <form 
              onSubmit={handleCreate} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 16 
              }}
            >
              <div>
                <label style={{ 
                  fontSize: 13, 
                  color: '#9ca3af', 
                  marginBottom: 6, 
                  display: 'block' 
                }}>
                  Title
                </label>
                <input
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Issue title..."
                  required
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
                <textarea
                  value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Describe the issue..."
                  rows={3}
                  style={{
                    width: '100%', 
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, 
                    color: 'white', 
                    fontSize: 14,
                    outline: 'none', 
                    boxSizing: 'border-box', 
                    resize: 'none'
                  }}
                />
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 12 
              }}>
                <div>
                  <label style={{ 
                    fontSize: 13, 
                    color: '#9ca3af', 
                    marginBottom: 6, 
                    display: 'block' 
                  }}>
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                    style={{
                      width: '100%', 
                      padding: '10px 14px',
                      background: '#1a1a2e', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, 
                      color: 'white', 
                      fontSize: 14, 
                      outline: 'none'
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label style={{ 
                    fontSize: 13, 
                    color: '#9ca3af', 
                    marginBottom: 6, 
                    display: 'block' 
                  }}>
                    Status
                  </label>
                  <select
                    value={newTask.status}
                    onChange={e => setNewTask({ ...newTask, status: e.target.value })}
                    style={{
                      width: '100%', 
                      padding: '10px 14px',
                      background: '#1a1a2e', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, 
                      color: 'white', 
                      fontSize: 14, 
                      outline: 'none'
                    }}
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button 
                  type="button" 
                  onClick={() => setShowCreate(false)} 
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
                  type="submit" 
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
                  Create Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      {loading ? (
        <div style={{ 
          color: '#6b7280', 
          textAlign: 'center', 
          marginTop: 40 
        }}>
          Loading tasks...
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: 16, 
          minHeight: 400 
        }}>
          {columns.map(col => (
            <div 
              key={col.key} 
              style={{
                background: '#13131f', 
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12, 
                padding: 16
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                marginBottom: 16 
              }}>
                <div style={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  background: statusColor[col.key] 
                }} />
                <span style={{ 
                  fontSize: 12, 
                  fontWeight: 600, 
                  color: '#9ca3af', 
                  letterSpacing: 1 
                }}>
                  {col.label}
                </span>
                <span style={{
                  marginLeft: 'auto', 
                  fontSize: 12, 
                  color: '#6b7280',
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: 10,
                  padding: '2px 8px'
                }}>
                  {tasks.filter(t => t.status === col.key).length}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 8 
              }}>
                {tasks.filter(t => t.status === col.key).map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => setSelectedTask(task)} 
                    style={{
                      background: '#1a1a2e', 
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 8, 
                      padding: 12, 
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: 8 
                    }}>
                      <span style={{
                        fontSize: 11, 
                        fontWeight: 600,
                        color: priorityColor[task.priority] || '#6b7280',
                        textTransform: 'uppercase', 
                        letterSpacing: 0.5
                      }}>
                        {task.priority}
                      </span>
                    </div>
                    <p style={{ 
                      color: 'white', 
                      fontSize: 13, 
                      fontWeight: 500, 
                      marginBottom: 8 
                    }}>
                      {task.title}
                    </p>
                    {task.ai_summary && (
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: 11, 
                        fontStyle: 'italic' 
                      }}>
                        🤖 {task.ai_summary}
                      </p>
                    )}
                    {task.due_date && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 4, 
                        marginTop: 8 
                      }}>
                        <Clock size={11} color="#6b7280" />
                        <span style={{ fontSize: 11, color: '#6b7280' }}>
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={() => { 
            fetchTasks(); 
            setSelectedTask(null) 
          }}
        />
      )}
    </div>
  )
}