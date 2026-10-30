import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Home } from './components/Home'
import { Result } from './components/Result'
import { AdminView } from './components/AdminView'
import type { UserProfile } from './lib/supabase'

type Page = 'home' | 'result' | 'admin'

interface ResultState {
  profile: UserProfile
  workoutPlan: string
  nutritionTip: string
  updatedPlan: string | null
  message: string | null
}

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [result, setResult] = useState<ResultState | null>(null)

  const handlePlanGenerated = (
    profile: UserProfile,
    workoutPlan: string,
    nutritionTip: string,
    message: string,
  ) => {
    setResult({ profile, workoutPlan, nutritionTip, updatedPlan: null, message })
    setPage('result')
  }

  const handleNavigate = (target: 'home' | 'admin') => {
    setPage(target)
  }

  return (
    <>
      <Navbar activePage={page} onNavigate={handleNavigate} />
      {page === 'home' && <Home onPlanGenerated={handlePlanGenerated} />}
      {page === 'result' && result && (
        <Result
          profile={result.profile}
          workoutPlan={result.workoutPlan}
          nutritionTip={result.nutritionTip}
          updatedPlan={result.updatedPlan}
          message={result.message}
          onBack={() => setPage('home')}
          onAdmin={() => setPage('admin')}
        />
      )}
      {page === 'result' && !result && <Home onPlanGenerated={handlePlanGenerated} />}
      {page === 'admin' && <AdminView onBack={() => setPage('home')} />}
      <footer className="page-footer">
        FitBuddy &nbsp;·&nbsp; AI Fitness Plan Generator using Google Gemini &nbsp;·&nbsp; 2026
      </footer>
    </>
  )
}
