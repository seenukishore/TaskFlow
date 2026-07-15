import { useEffect, useState } from 'react'
import { tasksService } from '../services/tasks'
import { projectsService } from '../services/projects'
import useAppStore from '../store/appStore'
import { Plus, Clock } from 'lucide-react'
import TaskDetailModal from '../components/tasks/TaskDetailModal'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const priorityColor = {
  low: '#10b981', medium: '#f59e0b',
  high: '#f97316', critical: '#ef4444'
}
const statusColor = {
  backlog: '#6b7280', todo: '#3b82f6',
  in_progress: '#f59e0b', in_review: '#a855f7', done: '#10b981'
}

function TaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      style={{
        ...style,
        background: '#1a1a2e',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 8, padding: 12, cursor: 'grab',
        marginBottom: 8
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: priorityColor[task.priority] || '#6b7280',
          textTransform: 'uppercase', letterSpacing: 0.5
        }}>
          {task.priority}
        </span>
      </div>
      <p style={{ color: 'white', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
        {task.title}
      </p>
      {task.ai_summary && (
        <p style={{ color: '#6b7280', fontSize: 11, fontStyle: 'italic', marginBottom: 6 }}>
          🤖 {task.ai_summary}
        </p>
      )}
      {task.due_date && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={11} color="#6b7280" />
          <span style={{ fontSize: 11, color: '#6b7280' }}>
            {new Date(task.due_date).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  )
}

function DroppableColumn({ column, tasks, onTaskClick }) {
  const { setNodeRef } = useSortable({ id: column.key })

  return (
    <div
      ref={setNodeRef}
      style={{
        background: '#13131f',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: 16, minHeight: 400
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor[column.key] }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', letterSpacing: 1 }}>
          {column.label}
        </span>
        <span style={{
          marginLeft: 'auto', fontSize: 12, color: '#6b7280',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 10, padding: '2px 8px'
        }}>
          {tasks.length}
        </span>
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}
      </SortableContext>
    </div>
  )
}

export default function TasksPage() {
  const { currentOrg } = useAppStore()
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', status: 'backlog' })
  const [selectedTask, setSelectedTask] = useState(null)
  const [activeTask, setActiveTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  )

  const columns = [
    { key: 'backlog', label: 'BACKLOG' },
    { key: 'todo', label: 'TODO' },
    { key: 'in_progress', label: 'IN PROGRESS' },
    { key: 'in_review', label: 'IN REVIEW' },
    { key: 'done', label: 'DONE' },
  ]

  useEffect(() => {
    if (currentOrg) fetchProjects()
  }, [currentOrg])

  useEffect(() => {
    if (selectedProject) fetchTasks()
  }, [selectedProject, searchQuery, filterStatus, filterPriority])

  const fetchProjects = async () => {
    try {
      const data = await projectsService.getProjects(currentOrg.id)
      setProjects(data.data || [])
      if (data.data?.length > 0) setSelectedProject(data.data[0])
    } catch (err) { console.error(err) }
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const params = {}
      if (searchQuery) params.search = searchQuery
      if (filterStatus) params.status = filterStatus
      if (filterPriority) params.priority = filterPriority
      const data = await tasksService.getTasks(currentOrg.id, selectedProject.id, params)
      setTasks(data.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!currentOrg) { alert('Select an organization first!'); return }
    if (!selectedProject) { alert('Select a project first!'); return }
    try {
      await tasksService.createTask(currentOrg.id, selectedProject.id, newTask)
      setNewTask({ title: '', description: '', priority: 'medium', status: 'backlog' })
      setShowCreate(false)
      fetchTasks()
    } catch (err) { console.error(err) }
  }

  const handleDragStart = (event) => {
    const task = tasks.find(t => t.id === event.active.id)
    setActiveTask(task)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeTask = tasks.find(t => t.id === active.id)
    if (!activeTask) return

    // Find which column was dropped on
    const targetColumn = columns.find(col => {
      const colTasks = tasks.filter(t => t.status === col.key)
      return col.key === over.id || colTasks.some(t => t.id === over.id)
    })

    if (!targetColumn || targetColumn.key === activeTask.status) return

    // Optimistic update
    setTasks(prev => prev.map(t =>
      t.id === activeTask.id ? { ...t, status: targetColumn.key } : t
    ))

    try {
      await tasksService.updateTask(
        currentOrg.id,
        selectedProject.id,
        activeTask.id,
        { status: targetColumn.key }
      )
    } catch (err) {
      console.error(err)
      fetchTasks() // Revert on error
    }
  }

  if (!currentOrg) return (
    <div style={{ padding: 32, color: '#6b7280', textAlign: 'center', marginTop: 80 }}>
      Select an organization first from Dashboard
    </div>
  )

  return (
    <div style={{ padding: '32px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 4 }}>Tasks</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Manage and track your team work.</p>
        </div>
        <button onClick={() => setShowCreate(true)} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          border: 'none', borderRadius: 8, padding: '10px 18px',
          color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer'
        }}>
          <Plus size={16} /> New Issue
        </button>
      </div>

      {/* Search + Filter Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, padding: '8px 14px', flex: 1
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: 'white', fontSize: 13, width: '100%'
            }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{
            padding: '8px 14px', background: '#1a1a2e',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, color: 'white', fontSize: 13, outline: 'none'
          }}
        >
          <option value="">All Status</option>
          <option value="backlog">Backlog</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="in_review">In Review</option>
          <option value="done">Done</option>
        </select>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          style={{
            padding: '8px 14px', background: '#1a1a2e',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, color: 'white', fontSize: 13, outline: 'none'
          }}
        >
          <option value="">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Project Selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto' }}>
        {projects.map(p => (
          <button key={p.id} onClick={() => setSelectedProject(p)} style={{
            padding: '8px 16px', borderRadius: 8,
            background: selectedProject?.id === p.id ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)',
            border: selectedProject?.id === p.id ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.08)',
            color: selectedProject?.id === p.id ? '#a78bfa' : '#9ca3af',
            fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap'
          }}>
            {p.name}
          </button>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div style={{
            background: '#13131f', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: 32, width: 480
          }}>
            <h2 style={{ color: 'white', fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
              Create New Issue
            </h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 6, display: 'block' }}>Title</label>
                <input
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Issue title..."
                  required
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, color: 'white', fontSize: 14,
                    outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 6, display: 'block' }}>Description</label>
                <textarea
                  value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Describe the issue..."
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, color: 'white', fontSize: 14,
                    outline: 'none', boxSizing: 'border-box', resize: 'none'
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 6, display: 'block' }}>Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px',
                      background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, color: 'white', fontSize: 14, outline: 'none'
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 6, display: 'block' }}>Status</label>
                  <select
                    value={newTask.status}
                    onChange={e => setNewTask({ ...newTask, status: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px',
                      background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, color: 'white', fontSize: 14, outline: 'none'
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
                <button type="button" onClick={() => setShowCreate(false)} style={{
                  flex: 1, padding: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: '#9ca3af', fontSize: 14, cursor: 'pointer'
                }}>Cancel</button>
                <button type="submit" style={{
                  flex: 1, padding: '10px',
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  border: 'none', borderRadius: 8,
                  color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer'
                }}>Create Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kanban Board with DnD */}
      {loading ? (
        <div style={{ color: '#6b7280', textAlign: 'center', marginTop: 40 }}>Loading tasks...</div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, minHeight: 400 }}>
            {columns.map(col => (
              <DroppableColumn
                key={col.key}
                column={col}
                tasks={tasks.filter(t => t.status === col.key)}
                onTaskClick={setSelectedTask}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <div style={{
                background: '#1a1a2e', border: '1px solid #7c3aed',
                borderRadius: 8, padding: 12, opacity: 0.9,
                boxShadow: '0 10px 30px rgba(124,58,237,0.3)'
              }}>
                <p style={{ color: 'white', fontSize: 13, fontWeight: 500 }}>
                  {activeTask.title}
                </p>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={() => { fetchTasks(); setSelectedTask(null) }}
        />
      )}
    </div>
  )
}