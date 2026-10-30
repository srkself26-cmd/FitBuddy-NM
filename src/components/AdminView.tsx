import { useEffect, useState } from 'react'
import { getAllUsersWithPlans } from '../lib/api'
import type { FitBuddyUser, FitBuddyPlan } from '../lib/supabase'

interface AdminViewProps {
  onBack: () => void
}

export function AdminView({ onBack }: AdminViewProps) {
  const [users, setUsers] = useState<FitBuddyUser[]>([])
  const [plansByUser, setPlansByUser] = useState<Record<string, FitBuddyPlan>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { users, plansByUser } = await getAllUsersWithPlans()
        if (!cancelled) {
          setUsers(users)
          setPlansByUser(plansByUser)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load data.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const updatedCount = Object.values(plansByUser).filter(p => p.updated_plan).length

  const titleCase = (s: string) => s.replace(/\b\w/g, c => c.toUpperCase())

  const intensityIcon = (i: string) => i === 'low' ? '🟢' : i === 'medium' ? '🟡' : '🔴'

  return (
    <div className="page-wrapper fade-in">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>All registered users and their AI-generated fitness plans</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <div className="alert-icon">⚠️</div>
          <div>
            <div className="alert-title">Error</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <p>Loading…</p>
        </div>
      ) : (
        <>
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon blue">👥</div>
              <div>
                <div className="stat-value">{users.length}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">✅</div>
              <div>
                <div className="stat-value">{Object.keys(plansByUser).length}</div>
                <div className="stat-label">Plans Generated</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">🔄</div>
              <div>
                <div className="stat-value">{updatedCount}</div>
                <div className="stat-label">Plans Updated</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-header-icon">📊</div>
              <div>
                <div className="card-header-title">User Records</div>
                <div className="card-header-subtitle">All users registered in the system</div>
              </div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {users.length > 0 ? (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>User</th>
                        <th>Age</th>
                        <th>Weight</th>
                        <th>Goal</th>
                        <th>Intensity</th>
                        <th>Plan Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, idx) => {
                        const plan = plansByUser[user.user_id]
                        return (
                          <tr key={user.id}>
                            <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{idx + 1}</td>
                            <td>
                              <div className="user-cell-name">{user.username}</div>
                              <div className="user-cell-id">{user.user_id}</div>
                            </td>
                            <td>{user.age} yrs</td>
                            <td>{user.weight} kg</td>
                            <td>{titleCase(user.goal)}</td>
                            <td>
                              {intensityIcon(user.intensity)} {titleCase(user.intensity)}
                            </td>
                            <td>
                              {plan ? (
                                plan.updated_plan ? (
                                  <span className="status-badge updated">🔄 Updated</span>
                                ) : (
                                  <span className="status-badge active">✅ Active</span>
                                )
                              ) : (
                                <span className="status-badge none">— No Plan</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <p>No users have generated plans yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="action-bar">
            <div className="action-bar-left">
              <button className="btn btn-primary" onClick={onBack}>✨ Generate New Plan</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
