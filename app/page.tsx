"use client"

import { useState, useEffect } from "react"
import { LoginScreen } from "@/components/login-screen"
import { TeamSelection } from "@/components/team-selection"
import { Dashboard } from "@/components/dashboard"
import { initializeDemoData, getCurrentUser } from "@/lib/local-storage"

interface User {
  id: string
  email: string
}

interface Team {
  id: string
  name: string
  user_id: string
  created_at: string
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize demo data
    initializeDemoData()
    
    // Check if user is logged in
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
        <div className="text-center max-w-sm w-full">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
            <span className="text-white font-bold text-lg sm:text-2xl">MC</span>
          </div>
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto mb-4 sm:mb-6"></div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Caricamento MedCheck Club</h2>
          <p className="text-sm sm:text-base text-gray-600">Inizializzazione in corso...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen onLogin={setUser} />
  }

  if (!selectedTeam) {
    return <TeamSelection user={user} onTeamSelect={setSelectedTeam} onLogout={() => setUser(null)} />
  }

  return <Dashboard user={user} team={selectedTeam} onTeamChange={() => setSelectedTeam(null)} onLogout={() => setUser(null)} />
}
