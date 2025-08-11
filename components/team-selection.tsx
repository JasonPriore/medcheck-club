"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getTeams, createTeam, updateTeam, deleteTeam, signOut, canAddTeam, SUBSCRIPTION_LIMITS } from "@/lib/local-storage"
import { Plus, Users, LogOut, Edit, Trash2, Settings, ArrowLeft, Info } from 'lucide-react'
import { SettingsDialog } from "@/components/settings-dialog"

interface User {
  id: string
  email: string
  organization_name?: string
  organization_logo?: string
  subscription_plan: "base" | "plus" | "custom"
  subscription_start_date: string
  subscription_end_date: string
  subscription_price: number
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
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)

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

  const openCreateDialog = async () => {
    // Check team limits before opening dialog
    const limits = await canAddTeam(user.id)
    if (!limits.canAdd) {
      alert(`Hai raggiunto il limite massimo di squadre per il tuo piano (${limits.maxTeams}). Aggiorna il piano per aggiungere più squadre.`)
      return
    }
    setEditingTeam(null)
    setTeamName('')
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Selezione Squadra
              </h1>
              <p className="text-sm text-gray-600">
                Scegli una squadra esistente o creane una nuova
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Settings button - always visible */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSettingsDialogOpen(true)}
              className="p-2 hover:bg-gray-100"
            >
              <Settings className="h-5 w-5" />
            </Button>
            
            {/* Logout button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Existing Teams */}
        {teams.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Squadre Esistenti</h2>
            <div className="grid gap-3 sm:gap-4">
              {teams.map((team) => (
                <Card
                  key={team.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onTeamSelect(team)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-600">
                        Creata il {new Date(team.created_at).toLocaleDateString("it-IT")}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Seleziona
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Create New Team */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Crea Nuova Squadra</h2>
            <Button
              onClick={openCreateDialog}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuova Squadra
            </Button>
          </div>
          
          {/* Team Limits Info */}
          <Card className="p-4 bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Limiti Piano Abbonamento</span>
            </div>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex justify-between">
                <span>Squadre attuali:</span>
                <span className="font-medium">{teams.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Limite massimo:</span>
                <span className="font-medium">
                  {SUBSCRIPTION_LIMITS[user.subscription_plan as keyof typeof SUBSCRIPTION_LIMITS]?.teams || SUBSCRIPTION_LIMITS.base.teams}
                </span>
              </div>
            </div>
          </Card>
        </div>
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
              
              {/* Subscription Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Limiti del piano</span>
                </div>
                <div className="text-sm text-blue-700">
                  <div className="flex justify-between">
                    <span>Squadre attuali:</span>
                    <span className="font-medium">{teams.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Limite massimo:</span>
                    <span className="font-medium">
                      {SUBSCRIPTION_LIMITS[user.subscription_plan as keyof typeof SUBSCRIPTION_LIMITS]?.teams || SUBSCRIPTION_LIMITS.base.teams}
                    </span>
                  </div>
                </div>
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

      <SettingsDialog
        user={user}
        isOpen={isSettingsDialogOpen}
        onClose={() => setIsSettingsDialogOpen(false)}
        onUpdate={() => {
          // Refresh user data if needed
          window.location.reload()
        }}
      />
    </div>
  )
}
