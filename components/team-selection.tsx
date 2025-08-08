"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getTeams, createTeam, updateTeam, deleteTeam, signOut } from "@/lib/local-storage"
import { Plus, Users, LogOut, Edit, Trash2 } from 'lucide-react'

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

interface TeamSelectionProps {
  user: User
  onTeamSelect: (team: Team) => void
  onLogout: () => void
}

export function TeamSelection({ user, onTeamSelect, onLogout }: TeamSelectionProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const userTeams = await getTeams(user.id)
      setTeams(userTeams)
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingTeam) {
        await updateTeam(editingTeam.id, teamName)
      } else {
        await createTeam(teamName, user.id)
      }

      setIsDialogOpen(false)
      setTeamName('')
      setEditingTeam(null)
      fetchTeams()
    } catch (error) {
      console.error('Error saving team:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTeam = async (teamId: string) => {
    if (confirm('Sei sicuro di voler eliminare questa squadra? Tutti i giocatori associati verranno eliminati.')) {
      try {
        await deleteTeam(teamId)
        fetchTeams()
      } catch (error) {
        console.error('Error deleting team:', error)
      }
    }
  }

  const handleLogout = async () => {
    await signOut()
    onLogout()
  }

  const openEditDialog = (team: Team) => {
    setEditingTeam(team)
    setTeamName(team.name)
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingTeam(null)
    setTeamName('')
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-base">MC</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">MedCheck Club</h1>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 w-8 sm:h-10 sm:w-10 p-0 flex-shrink-0"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Le Tue Squadre</h2>
          <p className="text-gray-600 text-lg">Seleziona una squadra per gestire i giocatori</p>
        </div>

        {/* Create Team Button */}
        <Button
          onClick={openCreateDialog}
          className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-6 w-6 mr-3" />
          Crea Nuova Squadra
        </Button>

        {/* Teams List */}
        {teams.length === 0 ? (
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-medium text-gray-800 mb-3">Nessuna squadra</h3>
              <p className="text-gray-600 text-lg mb-6">Crea la tua prima squadra per iniziare</p>
              <Button
                onClick={openCreateDialog}
                className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-5 w-5 mr-2" />
                Crea Squadra
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {teams.map((team) => (
              <Card key={team.id} className="bg-white border-gray-200 shadow-lg">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-medium text-gray-800 truncate">{team.name}</h3>
                        <p className="text-sm sm:text-base text-gray-600">
                          Creata il {new Date(team.created_at).toLocaleDateString('it-IT')}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(team)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 w-8 sm:h-10 sm:w-10 p-0"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTeam(team.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50 h-8 w-8 sm:h-10 sm:w-10 p-0"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={() => onTeamSelect(team)}
                    className="w-full h-10 sm:h-12 text-base sm:text-lg bg-green-600 hover:bg-green-700 text-white"
                  >
                    Seleziona Squadra
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Team Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-800">
              {editingTeam ? 'Modifica Squadra' : 'Crea Nuova Squadra'}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-lg">
              {editingTeam ? 'Modifica il nome della squadra.' : 'Inserisci il nome della nuova squadra.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTeam}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="team-name" className="text-lg text-gray-700">
                  Nome Squadra
                </Label>
                <Input
                  id="team-name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="h-12 text-lg bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"
                  placeholder="Es. Juventus FC"
                  required
                />
              </div>
            </div>
            <DialogFooter className="space-y-3 sm:space-y-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="h-12 text-lg border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Salvataggio...' : (editingTeam ? 'Aggiorna' : 'Crea Squadra')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
