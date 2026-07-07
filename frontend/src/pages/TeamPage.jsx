import { useState, useEffect } from 'react'
import { organizationsService, analyticsService } from '../services/projects'
import useAppStore from '../store/appStore'
import { Users, UserPlus, Shield, Clock, CheckCircle } from 'lucide-react'

export default function TeamPage() {
  const { currentOrg } = useAppStore()
  const [members, setMembers] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)
  const [showInvite, setShowInvite] = useState(false)
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [newTeam, setNewTeam] = useState({ name: '', description: '' })

  useEffect(() => {
    if (currentOrg) fetchData()
  }, [currentOrg])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [teamsData, analyticsData] = await Promise.all([
        organizationsService.getTeams(currentOrg.id),
        analyticsService.getAnalytics(currentOrg.id)
      ])
      setTeams(teamsData || [])
      setAnalytics(analyticsData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async (e) => {
    e.preventDefault()
    try {
      await organizationsService.createTeam(currentOrg.id, newTeam)
      setNewTeam({ name: '', description: '' })
      setShowCreateTeam(false)
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const stats = [
    { label: 'TOTAL MEMBERS', value: analytics?.members?.total || 1, change: 'In your org', icon: <Users size={20} />, color: '#7c3aed' },
    { 
      label: 'TEAMS', 
      value: teams.length, 
      change: 'Active teams', 
      icon: <CheckCircle size={20} />, 
      color: '#10b981' 
    },
    { 
      label: 'PENDING INVITES', 
      value: 0, 
      change: 'No pending invites', 
      icon: <Clock size={20} />, 
      color: '#f59e0b' 
    },
    { 
      label: 'ADMINS', 
      value: 1, 
      change: 'Org admin', 
      icon: <Shield size={20} />, 
      color: '#ef4444' 
    },
  ]

  if (!currentOrg) {
    return (
      <div style={{ padding: 32, color: '#6b7280', textAlign: 'center', marginTop: 80 }}>
        Select an organization first from Dashboard
      </div>
    )
  }

  return (
    <div style={{ padding: '32px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 4 }}>
            Team Members
          </h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>
            Manage your team members, roles, and access permissions.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={() => setShowCreateTeam(true)} 
            style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: 8, 
              padding: '10px 18px',
              color: '#a78bfa', 
              fontSize: 14, 
              fontWeight: 600, 
              cursor: 'pointer'
            }}
          >
            <Users size={16} /> Create Team
          </button>
          <button 
            onClick={() => setShowInvite(true)} 
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
            <UserPlus size={16} /> Invite Member
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: 16, 
        marginBottom: 32 
      }}>
        {stats.map((s, i) => (
          <div 
            key={i} 
            style={{
              background: '#13131f', 
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, 
              padding: '20px 24px'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: 12 
            }}>
              <span style={{ 
                fontSize: 11, 
                color: '#6b7280', 
                letterSpacing: 1, 
                textTransform: 'uppercase' 
              }}>
                {s.label}
              </span>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <p style={{ 
              fontSize: 32, 
              fontWeight: 700, 
              color: 'white', 
              marginBottom: 4 
            }}>
              {s.value}
            </p>
            <p style={{ fontSize: 12, color: '#6b7280' }}>{s.change}</p>
          </div>
        ))}
      </div>

      {/* Teams Section */}
      {teams.length > 0 && (
        <div style={{
          background: '#13131f', 
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, 
          padding: 24, 
          marginBottom: 24
        }}>
          <h2 style={{ 
            fontSize: 16, 
            fontWeight: 600, 
            color: 'white', 
            marginBottom: 16 
          }}>
            Teams
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: 12 
          }}>
            {teams.map(team => (
              <div 
                key={team.id} 
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10, 
                  padding: 16
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 10, 
                  marginBottom: 8 
                }}>
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
                    {team.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>
                      {team.name}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: 12 }}>Team</p>
                  </div>
                </div>
                {team.description && (
                  <p style={{ color: '#6b7280', fontSize: 12 }}>
                    {team.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members Table */}
      <div style={{
        background: '#13131f', 
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, 
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          padding: '12px 20px', 
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          {['MEMBER', 'STATUS', 'ROLE', 'LAST ACTIVE'].map(h => (
            <span 
              key={h} 
              style={{ 
                fontSize: 11, 
                color: '#4b5563', 
                letterSpacing: 1, 
                textTransform: 'uppercase' 
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Current user row */}
        <div style={{
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          padding: '16px 20px', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, 
              height: 36, 
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 14, 
              fontWeight: 700, 
              color: 'white'
            }}>
              K
            </div>
            <div>
              <p style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>
                Kishore Kumar
              </p>
              <p style={{ color: '#6b7280', fontSize: 12 }}>
                kishore@taskflow.com
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              background: '#10b981' 
            }} />
            <span style={{ color: '#10b981', fontSize: 13 }}>Online</span>
          </div>
          <span style={{
            fontSize: 12, 
            padding: '4px 10px', 
            borderRadius: 6,
            background: 'rgba(124,58,237,0.15)', 
            color: '#a78bfa',
            fontWeight: 500, 
            display: 'inline-block'
          }}>
            Org Admin
          </span>
          <span style={{ color: '#6b7280', fontSize: 13 }}>Just now</span>
        </div>

        {members.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <Users size={32} color="#374151" style={{ marginBottom: 12 }} />
            <p style={{ color: '#6b7280', fontSize: 14 }}>
              Invite team members to collaborate
            </p>
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateTeam && (
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
              Create New Team
            </h2>
            <form onSubmit={handleCreateTeam} style={{ 
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
                  Team Name
                </label>
                <input
                  value={newTeam.name}
                  onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                  placeholder="e.g. Engineering Team"
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
                  value={newTeam.description}
                  onChange={e => setNewTeam({ ...newTeam, description: e.target.value })}
                  placeholder="What does this team work on?"
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
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button 
                  type="button" 
                  onClick={() => setShowCreateTeam(false)} 
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
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
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
              marginBottom: 8 
            }}>
              Invite Team Member
            </h2>
            <p style={{ 
              color: '#6b7280', 
              fontSize: 14, 
              marginBottom: 24 
            }}>
              Send an invitation to join your organization.
            </p>
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
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="colleague@company.com"
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
                  Role
                </label>
                <select style={{
                  width: '100%', 
                  padding: '10px 14px',
                  background: '#1a1a2e', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, 
                  color: 'white', 
                  fontSize: 14, 
                  outline: 'none'
                }}>
                  <option value="team_member">Team Member</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="org_admin">Org Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button 
                  onClick={() => setShowInvite(false)} 
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
                  onClick={() => setShowInvite(false)} 
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
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}