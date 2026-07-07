import { useEffect, useState } from 'react'
import { projectsService } from '../services/projects'
import useAppStore from '../store/appStore'
import { Plus, Folder, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

export default function ProjectsPage() {
  const { currentOrg } = useAppStore()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', description: '' })

  useEffect(() => {
    if (currentOrg) fetchProjects()
  }, [currentOrg])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = await projectsService.getProjects(currentOrg.id)
      setProjects(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await projectsService.createProject(currentOrg.id, newProject)
      setNewProject({ name: '', description: '' })
      setShowCreate(false)
      fetchProjects()
    } catch (err) {
      console.error(err)
    }
  }

  const statusColor = (status) => {
    const colors = {
      active: '#10b981',
      on_hold: '#f59e0b',
      completed: '#6b7280',
      archived: '#4b5563'
    }
    return colors[status] || '#6b7280'
  }

  const healthColor = (health) => {
    const colors = {
      stable: '#10b981',
      warning: '#f59e0b',
      critical: '#ef4444',
      perfect: '#7c3aed'
    }
    return colors[health] || '#6b7280'
  }

  if (!currentOrg) return (
    <div style={{ padding: 32, color: '#6b7280', textAlign: 'center', marginTop: 80 }}>
      <Folder size={40} color="#374151" style={{ marginBottom: 16 }} />
      <p>Select an organization first from Dashboard</p>
    </div>
  )

  return (
    <div style={{ padding: '32px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 4 }}>Projects</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>
            Manage and track high-priority initiatives.
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          border: 'none', borderRadius: 8, padding: '10px 18px',
          color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer'
        }}>
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'TOTAL PROJECTS', value: projects.length },
          { label: 'ACTIVE', value: projects.filter(p => p.status === 'active').length },
          { label: 'COMPLETED', value: projects.filter(p => p.status === 'completed').length },
          { label: 'ON HOLD', value: projects.filter(p => p.status === 'on_hold').length },
        ].map((stat, i) => (
          <div key={i} style={{
            background: '#13131f', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '20px 24px'
          }}>
            <p style={{ fontSize: 11, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
              {stat.label}
            </p>
            <p style={{ fontSize: 32, fontWeight: 700, color: 'white' }}>{stat.value}</p>
          </div>
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
              Create New Project
            </h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 6, display: 'block' }}>
                  Project Name
                </label>
                <input
                  value={newProject.name}
                  onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g. Core Engine Re-architecture"
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
                <label style={{ fontSize: 13, color: '#9ca3af', marginBottom: 6, display: 'block' }}>
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="What is this project about?"
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
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" onClick={() => setShowCreate(false)} style={{
                  flex: 1, padding: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: '#9ca3af',
                  fontSize: 14, cursor: 'pointer'
                }}>
                  Cancel
                </button>
                <button type="submit" style={{
                  flex: 1, padding: '10px',
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  border: 'none', borderRadius: 8,
                  color: 'white', fontSize: 14,
                  fontWeight: 600, cursor: 'pointer'
                }}>
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <div style={{ color: '#6b7280', textAlign: 'center', marginTop: 40 }}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <div style={{
          background: '#13131f', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: 40, textAlign: 'center'
        }}>
          <Folder size={40} color="#374151" style={{ marginBottom: 16 }} />
          <h3 style={{ color: 'white', fontSize: 18, marginBottom: 8 }}>No Projects Yet</h3>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Create your first project to get started!</p>
        </div>
      ) : (
        <div style={{
          background: '#13131f', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}>
            {['PROJECT NAME', 'STATUS', 'HEALTH', 'CREATED', 'LAST UPDATED'].map(h => (
              <span key={h} style={{ fontSize: 11, color: '#4b5563', letterSpacing: 1, textTransform: 'uppercase' }}>
                {h}
              </span>
            ))}
          </div>
          {projects.map((project, i) => (
            <div key={project.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              padding: '16px 20px', alignItems: 'center',
              borderBottom: i < projects.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(124,58,237,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Folder size={15} color="#7c3aed" />
                </div>
                <div>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>{project.name}</p>
                  <p style={{ color: '#6b7280', fontSize: 12 }}>{project.description?.slice(0, 40)}...</p>
                </div>
              </div>
              <span style={{
                display: 'inline-block', padding: '4px 10px',
                background: `${statusColor(project.status)}20`,
                color: statusColor(project.status),
                borderRadius: 6, fontSize: 12, fontWeight: 500,
                textTransform: 'uppercase'
              }}>
                {project.status?.replace('_', ' ')}
              </span>
              <span style={{ color: healthColor(project.health), fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>
                {project.health}
              </span>
              <span style={{ color: '#6b7280', fontSize: 13 }}>
                {new Date(project.created_at).toLocaleDateString()}
              </span>
              <span style={{ color: '#6b7280', fontSize: 13 }}>
                {new Date(project.updated_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}