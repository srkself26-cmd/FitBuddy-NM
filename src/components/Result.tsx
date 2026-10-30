import { useState, type FormEvent } from 'react'
import type { UserProfile } from '../lib/supabase'
import { updateWorkoutPlan, updatePlanInDb } from '../lib/api'

interface ResultProps {
  profile: UserProfile
  workoutPlan: string
  nutritionTip: string
  updatedPlan: string | null
  message: string | null
  onBack: () => void
  onAdmin: () => void
}

export function Result({ profile, workoutPlan, nutritionTip, updatedPlan, message, onBack, onAdmin }: ResultProps) {
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentUpdatedPlan, setCurrentUpdatedPlan] = useState(updatedPlan)
  const [currentMessage, setCurrentMessage] = useState(message)
  const [error, setError] = useState<string | null>(null)

  const handleFeedback = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const updated = await updateWorkoutPlan(workoutPlan, feedback)
      await updatePlanInDb(profile.user_id, updated, feedback)
      setCurrentUpdatedPlan(updated)
      setCurrentMessage('Workout plan updated from feedback.')
      setFeedback('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const titleCase = (s: string) => s.replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div className="page-wrapper fade-in">
      {currentMessage && (
        <div className="alert alert-success">
          <div className="alert-icon">✅</div>
          <div>
            <div className="alert-title">Success</div>
            <div>{currentMessage}</div>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          <div className="alert-icon">⚠️</div>
          <div>
            <div className="alert-title">Error</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1>{profile.username}'s Fitness Plan</h1>
        <div className="result-meta">
          <span className="meta-chip">🎯 {titleCase(profile.goal)}</span>
          <span className="meta-chip">⚡ {titleCase(profile.intensity)} Intensity</span>
          <span className="meta-chip">🗓️ {profile.age} years old</span>
          <span className="meta-chip">⚖️ {profile.weight} kg</span>
        </div>
      </div>

      <div className="result-grid">
        <div>
          {workoutPlan && (
            <div className="section-block">
              <div className="section-block-header">
                <span className="section-block-icon">🏋️</span>
                <span className="section-block-title">7-Day Workout Plan</span>
              </div>
              <div className="section-block-body">
                <pre className="plan-content">{workoutPlan}</pre>
              </div>
            </div>
          )}

          {currentUpdatedPlan && (
            <div className="section-block">
              <div className="section-block-header">
                <span className="section-block-icon">🔄</span>
                <span className="section-block-title">Updated Plan</span>
                <span className="updated-badge">✦ Refined</span>
              </div>
              <div className="section-block-body">
                <pre className="plan-content">{currentUpdatedPlan}</pre>
              </div>
            </div>
          )}
        </div>

        <div className="right-column">
          {nutritionTip && (
            <div className="section-block">
              <div className="section-block-header">
                <span className="section-block-icon">🥗</span>
                <span className="section-block-title">Nutrition & Recovery Tip</span>
              </div>
              <div className="section-block-body">
                <p className="nutrition-text">{nutritionTip}</p>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <div className="card-header-icon">💬</div>
              <div>
                <div className="card-header-title">Refine With Feedback</div>
                <div className="card-header-subtitle">Tell us what to change</div>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleFeedback}>
                <input type="hidden" name="user_id" value={profile.user_id} />
                <div className="form-group">
                  <label className="form-label" htmlFor="feedback">Your Feedback</label>
                  <textarea
                    id="feedback"
                    className="form-control"
                    name="feedback"
                    rows={5}
                    placeholder="Example: Add more cardio, include rest days, make it less intense…"
                    required
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                  />
                </div>
                <div style={{ marginTop: '16px' }}>
                  <button
                    type="submit"
                    className={`btn btn-success btn-full ${loading ? 'btn-loading' : ''}`}
                    disabled={loading}
                  >
                    <span>🔄</span>
                    <span>{loading ? 'Updating your plan…' : 'Update My Plan'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="action-bar">
        <div className="action-bar-left">
          <button className="btn btn-secondary" onClick={onBack}>← Generate New Plan</button>
        </div>
        <div className="action-bar-right">
          <button className="btn btn-secondary" onClick={onAdmin}>👥 Admin View</button>
        </div>
      </div>
    </div>
  )
}
