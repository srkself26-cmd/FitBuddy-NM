import { useState, type FormEvent } from 'react'
import type { UserProfile, Intensity } from '../lib/supabase'
import { generateWorkoutPlan, saveUserToDb, savePlanToDb, testGeminiConnection } from '../lib/api'

interface HomeProps {
  onPlanGenerated: (profile: UserProfile, workoutPlan: string, nutritionTip: string, message: string) => void
}

const GOALS = [
  { value: 'weight loss', label: 'Weight Loss', icon: '⚖️' },
  { value: 'muscle gain', label: 'Muscle Gain', icon: '💪' },
  { value: 'flexibility', label: 'Flexibility & Mobility', icon: '🧘' },
  { value: 'general wellness', label: 'General Wellness', icon: '🌿' },
]

const INTENSITIES: { value: Intensity; label: string; icon: string }[] = [
  { value: 'low', label: 'Low', icon: '🟢' },
  { value: 'medium', label: 'Medium', icon: '🟡' },
  { value: 'high', label: 'High', icon: '🔴' },
]

export function Home({ onPlanGenerated }: HomeProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testState, setTestState] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle')
  const [testMessage, setTestMessage] = useState<string | null>(null)
  const [form, setForm] = useState<UserProfile>({
    username: '',
    user_id: '',
    age: 22,
    weight: 70,
    goal: '',
    intensity: 'medium',
  })

  const handleChange = (field: keyof UserProfile, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleTestConnection = async () => {
    setTestState('testing')
    setTestMessage(null)
    const { ok, message } = await testGeminiConnection()
    if (ok) {
      setTestState('success')
      setTestMessage('Gemini API key is connected and working correctly.')
    } else {
      setTestState('failed')
      setTestMessage(message)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { workoutPlan, nutritionTip } = await generateWorkoutPlan(form)
      await saveUserToDb(form)
      await savePlanToDb(form.user_id, workoutPlan, nutritionTip)
      onPlanGenerated(form, workoutPlan, nutritionTip, 'Plan generated successfully.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper narrow fade-in">
      <div className="hero-banner">
        <div className="hero-badge">✦ Powered by Google Gemini</div>
        <h1>Your Personal AI Fitness Coach</h1>
        <p>Get a customised 7-day workout plan and nutrition advice tailored to your body and goals — in seconds.</p>
        <div className="hero-test-connection">
          <button
            className={`btn btn-test ${testState === 'testing' ? 'btn-loading' : ''} ${testState === 'success' ? 'btn-test-success' : ''} ${testState === 'failed' ? 'btn-test-failed' : ''}`}
            type="button"
            onClick={handleTestConnection}
            disabled={testState === 'testing'}
          >
            <span>{testState === 'testing' ? 'Testing…' : testState === 'success' ? '✓ Connected' : testState === 'failed' ? '✕ Failed' : 'Test Gemini Connection'}</span>
          </button>
          {testState === 'success' && testMessage && (
            <div className="test-status test-status-success">{testMessage}</div>
          )}
          {testState === 'failed' && testMessage && (
            <div className="test-status test-status-error">{testMessage}</div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-header-icon">📋</div>
          <div>
            <div className="card-header-title">Create Your Fitness Profile</div>
            <div className="card-header-subtitle">Fill in your details to generate a personalised plan</div>
          </div>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-error">
              <div className="alert-icon">⚠️</div>
              <div>
                <div className="alert-title">Error</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="username">Full Name <span className="required">*</span></label>
                <input
                  id="username"
                  className="form-control"
                  name="username"
                  type="text"
                  placeholder="e.g. Rishikanth S"
                  required
                  autoComplete="name"
                  value={form.username}
                  onChange={e => handleChange('username', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="user_id">User ID <span className="required">*</span></label>
                <input
                  id="user_id"
                  className="form-control"
                  name="user_id"
                  type="text"
                  placeholder="e.g. user_001"
                  required
                  value={form.user_id}
                  onChange={e => handleChange('user_id', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="age">Age (years) <span className="required">*</span></label>
                <input
                  id="age"
                  className="form-control"
                  name="age"
                  type="number"
                  min="10"
                  max="100"
                  placeholder="e.g. 22"
                  required
                  value={form.age}
                  onChange={e => handleChange('age', Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="weight">Weight (kg) <span className="required">*</span></label>
                <input
                  id="weight"
                  className="form-control"
                  name="weight"
                  type="number"
                  step="0.1"
                  min="20"
                  max="300"
                  placeholder="e.g. 70.5"
                  required
                  value={form.weight}
                  onChange={e => handleChange('weight', Number(e.target.value))}
                />
              </div>

              <div className="form-group full">
                <label className="form-label" htmlFor="goal">Fitness Goal <span className="required">*</span></label>
                <select
                  id="goal"
                  className="form-control"
                  name="goal"
                  required
                  value={form.goal}
                  onChange={e => handleChange('goal', e.target.value)}
                >
                  <option value="" disabled>Select your primary goal…</option>
                  {GOALS.map(g => (
                    <option key={g.value} value={g.value}>{g.icon} {g.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full">
                <label className="form-label">Workout Intensity <span className="required">*</span></label>
                <div className="segment-group">
                  {INTENSITIES.map(i => (
                    <div key={i.value}>
                      <input
                        type="radio"
                        id={`int-${i.value}`}
                        name="intensity"
                        value={i.value}
                        checked={form.intensity === i.value}
                        onChange={() => handleChange('intensity', i.value)}
                      />
                      <label htmlFor={`int-${i.value}`}>{i.icon} {i.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '28px' }}>
              <button
                className={`btn btn-primary btn-lg btn-full ${loading ? 'btn-loading' : ''}`}
                type="submit"
                disabled={loading}
              >
                <span>✨</span>
                <span>{loading ? 'Generating your plan…' : 'Generate My Fitness Plan'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
