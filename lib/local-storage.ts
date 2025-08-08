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

interface Player {
  id: string
  name: string
  email: string
  phone: string
  position: string
  medical_exam_date: string
  medical_expiry_date: string
  team_id: string
  visit_completed?: boolean
  visit_completed_date?: string
}

// Demo data
const DEMO_USERS: User[] = [
  { id: 'demo-user-1', email: 'demo@medcheckclub.com' }
]

const DEMO_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'Juventus FC',
    user_id: 'demo-user-1',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'team-2',
    name: 'AC Milan',
    user_id: 'demo-user-1',
    created_at: '2024-01-02T00:00:00Z'
  }
]

// Helper function to get dates for calendar demo
const getDateString = (daysFromToday: number): string => {
  const date = new Date()
  date.setHours(0, 0, 0, 0) // Reset time to avoid timezone issues
  date.setDate(date.getDate() + daysFromToday)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getExamDateString = (daysFromToday: number): string => {
  const date = new Date()
  date.setHours(0, 0, 0, 0) // Reset time to avoid timezone issues
  date.setDate(date.getDate() + daysFromToday - 365) // 1 year before expiry
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const DEMO_PLAYERS: Player[] = [
  // Juventus FC Players
  {
    id: 'player-1',
    name: 'Marco Rossi',
    email: 'marco.rossi@email.com',
    phone: '+39 123 456 7890',
    position: 'Attaccante',
    medical_exam_date: getExamDateString(120),
    medical_expiry_date: getDateString(120), // Valid - expires in 4 months
    team_id: 'team-1'
  },
  {
    id: 'player-2',
    name: 'Luca Bianchi',
    email: 'luca.bianchi@email.com',
    phone: '+39 123 456 7891',
    position: 'Centrocampista',
    medical_exam_date: getExamDateString(90),
    medical_expiry_date: getDateString(90), // Valid - expires in 3 months
    team_id: 'team-1'
  },
  {
    id: 'player-3',
    name: 'Giuseppe Verdi',
    email: 'giuseppe.verdi@email.com',
    phone: '+39 123 456 7892',
    position: 'Portiere',
    medical_exam_date: getExamDateString(25),
    medical_expiry_date: getDateString(25), // Expiring soon - 25 days
    team_id: 'team-1'
  },
  {
    id: 'player-4',
    name: 'Alessandro Mancini',
    email: 'alessandro.mancini@email.com',
    phone: '+39 123 456 7893',
    position: 'Difensore',
    medical_exam_date: getExamDateString(15),
    medical_expiry_date: getDateString(15), // Expiring soon - 15 days
    team_id: 'team-1'
  },
  {
    id: 'player-5',
    name: 'Roberto Galli',
    email: 'roberto.galli@email.com',
    phone: '+39 123 456 7894',
    position: 'Centrocampista',
    medical_exam_date: getExamDateString(7),
    medical_expiry_date: getDateString(7), // Expiring soon - 7 days
    team_id: 'team-1'
  },
  {
    id: 'player-6',
    name: 'Stefano Conti',
    email: 'stefano.conti@email.com',
    phone: '+39 123 456 7895',
    position: 'Attaccante',
    medical_exam_date: getExamDateString(3),
    medical_expiry_date: getDateString(3), // Expiring soon - 3 days
    team_id: 'team-1'
  },
  {
    id: 'player-7',
    name: 'Matteo Ferrari',
    email: 'matteo.ferrari@email.com',
    phone: '+39 123 456 7896',
    position: 'Difensore',
    medical_exam_date: getExamDateString(0),
    medical_expiry_date: getDateString(0), // Expires today
    team_id: 'team-1'
  },
  {
    id: 'player-8',
    name: 'Davide Romano',
    email: 'davide.romano@email.com',
    phone: '+39 123 456 7897',
    position: 'Centrocampista',
    medical_exam_date: getExamDateString(-5),
    medical_expiry_date: getDateString(-5), // Expired 5 days ago
    team_id: 'team-1',
    visit_completed: true,
    visit_completed_date: getDateString(-3)
  },
  {
    id: 'player-9',
    name: 'Simone Ricci',
    email: 'simone.ricci@email.com',
    phone: '+39 123 456 7898',
    position: 'Allenatore',
    medical_exam_date: getExamDateString(-15),
    medical_expiry_date: getDateString(-15), // Expired 15 days ago
    team_id: 'team-1'
  },
  {
    id: 'player-10',
    name: 'Antonio Moretti',
    email: 'antonio.moretti@email.com',
    phone: '+39 123 456 7899',
    position: 'Staff',
    medical_exam_date: getExamDateString(60),
    medical_expiry_date: getDateString(60), // Valid - expires in 2 months
    team_id: 'team-1'
  },

  // AC Milan Players
  {
    id: 'player-11',
    name: 'Andrea Pirlo',
    email: 'andrea.pirlo@email.com',
    phone: '+39 123 456 7900',
    position: 'Centrocampista',
    medical_exam_date: getExamDateString(45),
    medical_expiry_date: getDateString(45), // Valid - expires in 45 days
    team_id: 'team-2'
  },
  {
    id: 'player-12',
    name: 'Francesco Totti',
    email: 'francesco.totti@email.com',
    phone: '+39 123 456 7901',
    position: 'Attaccante',
    medical_exam_date: getExamDateString(-10),
    medical_expiry_date: getDateString(-10), // Expired 10 days ago
    team_id: 'team-2'
  },
  {
    id: 'player-13',
    name: 'Paolo Maldini',
    email: 'paolo.maldini@email.com',
    phone: '+39 123 456 7902',
    position: 'Difensore',
    medical_exam_date: getExamDateString(20),
    medical_expiry_date: getDateString(20), // Expiring soon - 20 days
    team_id: 'team-2'
  },
  {
    id: 'player-14',
    name: 'Gianluigi Buffon',
    email: 'gianluigi.buffon@email.com',
    phone: '+39 123 456 7903',
    position: 'Portiere',
    medical_exam_date: getExamDateString(10),
    medical_expiry_date: getDateString(10), // Expiring soon - 10 days
    team_id: 'team-2'
  },
  {
    id: 'player-15',
    name: 'Franco Baresi',
    email: 'franco.baresi@email.com',
    phone: '+39 123 456 7904',
    position: 'Difensore',
    medical_exam_date: getExamDateString(1),
    medical_expiry_date: getDateString(1), // Expiring tomorrow
    team_id: 'team-2'
  },
  {
    id: 'player-16',
    name: 'Roberto Baggio',
    email: 'roberto.baggio@email.com',
    phone: '+39 123 456 7905',
    position: 'Attaccante',
    medical_exam_date: getExamDateString(30),
    medical_expiry_date: getDateString(30), // Expiring in exactly 30 days
    team_id: 'team-2'
  },
  {
    id: 'player-17',
    name: 'Fabio Cannavaro',
    email: 'fabio.cannavaro@email.com',
    phone: '+39 123 456 7906',
    position: 'Difensore',
    medical_exam_date: getExamDateString(180),
    medical_expiry_date: getDateString(180), // Valid - expires in 6 months
    team_id: 'team-2'
  },
  {
    id: 'player-18',
    name: 'Gianluca Vialli',
    email: 'gianluca.vialli@email.com',
    phone: '+39 123 456 7907',
    position: 'Attaccante',
    medical_exam_date: getExamDateString(-3),
    medical_expiry_date: getDateString(-3), // Expired 3 days ago
    team_id: 'team-2',
    visit_completed: true,
    visit_completed_date: getDateString(-1)
  },
  {
    id: 'player-19',
    name: 'Massimo Ambrosini',
    email: 'massimo.ambrosini@email.com',
    phone: '+39 123 456 7908',
    position: 'Centrocampista',
    medical_exam_date: getExamDateString(14),
    medical_expiry_date: getDateString(14), // Expiring soon - 14 days
    team_id: 'team-2'
  },
  {
    id: 'player-20',
    name: 'Carlo Ancelotti',
    email: 'carlo.ancelotti@email.com',
    phone: '+39 123 456 7909',
    position: 'Allenatore',
    medical_exam_date: getExamDateString(75),
    medical_expiry_date: getDateString(75), // Valid - expires in 75 days
    team_id: 'team-2'
  },
  {
    id: 'player-21',
    name: 'Lorenzo Insigne',
    email: 'lorenzo.insigne@email.com',
    phone: '+39 123 456 7910',
    position: 'Attaccante',
    medical_exam_date: getExamDateString(1),
    medical_expiry_date: getDateString(1), // Expires tomorrow
    team_id: 'team-1'
  },
  {
    id: 'player-22',
    name: 'Ciro Immobile',
    email: 'ciro.immobile@email.com',
    phone: '+39 123 456 7911',
    position: 'Attaccante',
    medical_exam_date: getExamDateString(1),
    medical_expiry_date: getDateString(1), // Expires tomorrow
    team_id: 'team-2'
  },
  {
    id: 'player-23',
    name: 'Federico Chiesa',
    email: 'federico.chiesa@email.com',
    phone: '+39 123 456 7912',
    position: 'Centrocampista',
    medical_exam_date: getExamDateString(2),
    medical_expiry_date: getDateString(2), // Expires in 2 days
    team_id: 'team-1'
  },
  {
    id: 'player-24',
    name: 'Nicolo Barella',
    email: 'nicolo.barella@email.com',
    phone: '+39 123 456 7913',
    position: 'Centrocampista',
    medical_exam_date: getExamDateString(4),
    medical_expiry_date: getDateString(4), // Expires in 4 days
    team_id: 'team-2'
  },
  {
    id: 'player-25',
    name: 'Marco Verratti',
    email: 'marco.verratti@email.com',
    phone: '+39 123 456 7914',
    position: 'Centrocampista',
    medical_exam_date: getExamDateString(5),
    medical_expiry_date: getDateString(5), // Expires in 5 days
    team_id: 'team-1'
  },
  {
    id: 'player-26',
    name: 'Alessandro Bastoni',
    email: 'alessandro.bastoni@email.com',
    phone: '+39 123 456 7915',
    position: 'Difensore',
    medical_exam_date: getExamDateString(6),
    medical_expiry_date: getDateString(6), // Expires in 6 days
    team_id: 'team-2'
  }
]

// Initialize demo data if not exists
export function initializeDemoData() {
  if (!localStorage.getItem('medcheck_users')) {
    localStorage.setItem('medcheck_users', JSON.stringify(DEMO_USERS))
  }
  if (!localStorage.getItem('medcheck_teams')) {
    localStorage.setItem('medcheck_teams', JSON.stringify(DEMO_TEAMS))
  }
  if (!localStorage.getItem('medcheck_players')) {
    localStorage.setItem('medcheck_players', JSON.stringify(DEMO_PLAYERS))
  }
}

// Auth functions
export function signIn(email: string, password: string): Promise<{ user: User | null, error: string | null }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('medcheck_users') || '[]')
      const user = users.find((u: User) => u.email === email)
      
      if (user && password.length >= 6) {
        localStorage.setItem('medcheck_current_user', JSON.stringify(user))
        resolve({ user, error: null })
      } else if (!user) {
        resolve({ user: null, error: 'Email non trovato' })
      } else {
        resolve({ user: null, error: 'Password deve essere almeno 6 caratteri' })
      }
    }, 1000)
  })
}

export function signUp(email: string, password: string): Promise<{ user: User | null, error: string | null }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (password.length < 6) {
        resolve({ user: null, error: 'Password deve essere almeno 6 caratteri' })
        return
      }

      const users = JSON.parse(localStorage.getItem('medcheck_users') || '[]')
      const existingUser = users.find((u: User) => u.email === email)
      
      if (existingUser) {
        resolve({ user: null, error: 'Email già registrata' })
      } else {
        const newUser: User = {
          id: `user-${Date.now()}`,
          email
        }
        users.push(newUser)
        localStorage.setItem('medcheck_users', JSON.stringify(users))
        localStorage.setItem('medcheck_current_user', JSON.stringify(newUser))
        resolve({ user: newUser, error: null })
      }
    }, 1000)
  })
}

export function signOut(): Promise<void> {
  return new Promise((resolve) => {
    localStorage.removeItem('medcheck_current_user')
    resolve()
  })
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('medcheck_current_user')
  return userStr ? JSON.parse(userStr) : null
}

// Teams functions
export function getTeams(userId: string): Promise<Team[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const teams = JSON.parse(localStorage.getItem('medcheck_teams') || '[]')
      const userTeams = teams.filter((t: Team) => t.user_id === userId)
      resolve(userTeams)
    }, 500)
  })
}

export function createTeam(name: string, userId: string): Promise<{ team: Team | null, error: string | null }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const teams = JSON.parse(localStorage.getItem('medcheck_teams') || '[]')
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name,
        user_id: userId,
        created_at: new Date().toISOString()
      }
      teams.push(newTeam)
      localStorage.setItem('medcheck_teams', JSON.stringify(teams))
      resolve({ team: newTeam, error: null })
    }, 500)
  })
}

export function updateTeam(teamId: string, name: string): Promise<{ error: string | null }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const teams = JSON.parse(localStorage.getItem('medcheck_teams') || '[]')
      const teamIndex = teams.findIndex((t: Team) => t.id === teamId)
      if (teamIndex !== -1) {
        teams[teamIndex].name = name
        localStorage.setItem('medcheck_teams', JSON.stringify(teams))
      }
      resolve({ error: null })
    }, 500)
  })
}

export function deleteTeam(teamId: string): Promise<{ error: string | null }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Delete team
      const teams = JSON.parse(localStorage.getItem('medcheck_teams') || '[]')
      const filteredTeams = teams.filter((t: Team) => t.id !== teamId)
      localStorage.setItem('medcheck_teams', JSON.stringify(filteredTeams))
      
      // Delete all players in team
      const players = JSON.parse(localStorage.getItem('medcheck_players') || '[]')
      const filteredPlayers = players.filter((p: Player) => p.team_id !== teamId)
      localStorage.setItem('medcheck_players', JSON.stringify(filteredPlayers))
      
      resolve({ error: null })
    }, 500)
  })
}

// Players functions
export function getPlayers(teamId: string): Promise<Player[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const players = JSON.parse(localStorage.getItem('medcheck_players') || '[]')
      const teamPlayers = players.filter((p: Player) => p.team_id === teamId)
      resolve(teamPlayers)
    }, 500)
  })
}

export function createPlayer(playerData: Omit<Player, 'id'>): Promise<{ player: Player | null, error: string | null }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const players = JSON.parse(localStorage.getItem('medcheck_players') || '[]')
      const newPlayer: Player = {
        ...playerData,
        id: `player-${Date.now()}`
      }
      players.push(newPlayer)
      localStorage.setItem('medcheck_players', JSON.stringify(players))
      resolve({ player: newPlayer, error: null })
    }, 500)
  })
}

export function updatePlayer(playerId: string, playerData: Partial<Player>): Promise<{ error: string | null }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const players = JSON.parse(localStorage.getItem('medcheck_players') || '[]')
      const playerIndex = players.findIndex((p: Player) => p.id === playerId)
      if (playerIndex !== -1) {
        players[playerIndex] = { ...players[playerIndex], ...playerData }
        localStorage.setItem('medcheck_players', JSON.stringify(players))
      }
      resolve({ error: null })
    }, 500)
  })
}

export function deletePlayer(playerId: string): Promise<{ error: string | null }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const players = JSON.parse(localStorage.getItem('medcheck_players') || '[]')
      const filteredPlayers = players.filter((p: Player) => p.id !== playerId)
      localStorage.setItem('medcheck_players', JSON.stringify(filteredPlayers))
      resolve({ error: null })
    }, 500)
  })
}

// Mark visit as completed
export function markVisitCompleted(playerId: string): Promise<{ error: string | null }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const players = JSON.parse(localStorage.getItem('medcheck_players') || '[]')
      const playerIndex = players.findIndex((p: Player) => p.id === playerId)
      if (playerIndex !== -1) {
        players[playerIndex].visit_completed = true
        players[playerIndex].visit_completed_date = new Date().toISOString().split('T')[0]
        localStorage.setItem('medcheck_players', JSON.stringify(players))
      }
      resolve({ error: null })
    }, 500)
  })
}

// Mark visit as incomplete
export function markVisitIncomplete(playerId: string): Promise<{ error: string | null }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const players = JSON.parse(localStorage.getItem('medcheck_players') || '[]')
      const playerIndex = players.findIndex((p: Player) => p.id === playerId)
      if (playerIndex !== -1) {
        players[playerIndex].visit_completed = false
        delete players[playerIndex].visit_completed_date
        localStorage.setItem('medcheck_players', JSON.stringify(players))
      }
      resolve({ error: null })
    }, 500)
  })
}

// Notifications
export function getExpiringPlayers(): Promise<Player[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const players = JSON.parse(localStorage.getItem('medcheck_players') || '[]')
      const today = new Date()
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      const expiringPlayers = players.filter((player: Player) => {
        const expiryDate = new Date(player.medical_expiry_date)
        return expiryDate <= thirtyDaysFromNow
      })
      
      resolve(expiringPlayers)
    }, 500)
  })
}
