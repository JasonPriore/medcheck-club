"use client"

import { useState, useEffect } from "react"
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, AlertTriangle, CheckCircle, List, Home, ArrowLeft, LogOut, CheckCircle2, Clock } from "lucide-react"
import { PlayerDialog } from "@/components/player-dialog"
import { CalendarView } from "@/components/calendar-view"
import { ListView } from "@/components/list-view"
import { VisitStatusDialog } from "@/components/visit-status-dialog"
import { getPlayers, signOut, markVisitCompleted, markVisitIncomplete, updatePlayer } from "@/lib/local-storage"

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
  status: "valid" | "expiring_soon" | "expired"
  medical_certificate?: string
  medical_certificate_name?: string
  medical_certificate_type?: string
}

interface DashboardProps {
  user: User
  team: Team
  onTeamChange: () => void
  onLogout: () => void
}

export function Dashboard({ user, team, onTeamChange, onLogout }: DashboardProps) {
  const [players, setPlayers] = useState<Player[]>([])
  const [activeTab, setActiveTab] = useState<"home" | "list">("home")
  const [isPlayerDialogOpen, setIsPlayerDialogOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isVisitStatusDialogOpen, setIsVisitStatusDialogOpen] = useState(false)
  const [visitStatusPlayer, setVisitStatusPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlayers()
  }, [team.id])

  const fetchPlayers = async () => {
    try {
      const teamPlayers = await getPlayers(team.id)
      const playersWithStatus = teamPlayers.map((player) => ({
        ...player,
        status: getPlayerStatus(player.medical_expiry_date),
      }))
      setPlayers(playersWithStatus)
    } catch (error) {
      console.error("Error fetching players:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPlayerStatus = (expiryDate: string): "valid" | "expiring_soon" | "expired" => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return "expired"
    if (daysUntilExpiry <= 30) return "expiring_soon"
    return "valid"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "expired":
        return "destructive"
      case "expiring_soon":
        return "secondary"
      case "valid":
        return "default"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "expired":
        return <AlertTriangle className="h-5 w-5" />
      case "expiring_soon":
        return <AlertTriangle className="h-5 w-5" />
      case "valid":
        return <CheckCircle className="h-5 w-5" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "expired":
        return "Scaduta"
      case "expiring_soon":
        return "In Scadenza"
      case "valid":
        return "Valida"
      default:
        return "Sconosciuto"
    }
  }

  const validPlayers = players.filter((p) => p.status === "valid").length
  const expiringSoonPlayers = players.filter((p) => p.status === "expiring_soon").length
  const expiredPlayers = players.filter((p) => p.status === "expired").length
  const completedVisits = players.filter((p) => p.visit_completed).length

  const handlePlayerSaved = () => {
    fetchPlayers()
    setIsPlayerDialogOpen(false)
    setSelectedPlayer(null)
  }

  const handleLogout = async () => {
    await signOut()
    onLogout()
  }

  const handleMarkCompleted = async (playerId: string) => {
    try {
      await markVisitCompleted(playerId)
      fetchPlayers()
    } catch (error) {
      console.error("Error marking visit as completed:", error)
    }
  }

  const handleMarkIncomplete = async (playerId: string) => {
    try {
      await markVisitIncomplete(playerId)
      fetchPlayers()
    } catch (error) {
      console.error("Error marking visit as incomplete:", error)
    }
  }

  const openVisitStatusDialog = (player: Player) => {
    setVisitStatusPlayer(player)
    setIsVisitStatusDialogOpen(true)
  }

  const handleUpdatePlayer = async (
    playerId: string,
    updates: Partial<Player>
  ) => {
    try {
      await updatePlayer(playerId, updates)
      // Update currently open dialog player immediately for responsive UI
      setVisitStatusPlayer((prev) => (prev && prev.id === playerId ? { ...prev, ...updates } : prev))
      // Refresh lists
      fetchPlayers()
    } catch (error) {
      console.error("Error updating player:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
        <div className="text-center max-w-sm w-full">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
            <span className="text-white font-bold text-lg sm:text-2xl">MC</span>
          </div>
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto mb-4 sm:mb-6"></div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Caricamento Giocatori</h2>
          <p className="text-sm sm:text-base text-gray-600">Recupero dati della squadra...</p>
        </div>
      </div>
    )
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
              <p className="text-xs sm:text-sm text-gray-600 truncate">{team.name}</p>
            </div>
          </div>
          <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onTeamChange}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 w-8 sm:h-10 sm:w-10 p-0 bg-transparent"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 w-8 sm:h-10 sm:w-10 p-0 bg-transparent"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        {activeTab === "home" && (
          <div className="p-4 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                  <CardTitle className="text-sm sm:text-lg text-gray-700 flex items-center flex-wrap gap-1 sm:gap-2">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="truncate">Totale</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-800">{players.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-lg">
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                  <CardTitle className="text-sm sm:text-lg text-gray-700 flex items-center flex-wrap gap-1 sm:gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                    <span className="truncate">Completate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">{completedVisits}</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-lg">
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                  <CardTitle className="text-sm sm:text-lg text-gray-700 flex items-center flex-wrap gap-1 sm:gap-2">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
                    <span className="truncate">In Scadenza</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">{expiringSoonPlayers}</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-lg">
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                  <CardTitle className="text-sm sm:text-lg text-gray-700 flex items-center flex-wrap gap-1 sm:gap-2">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                    <span className="truncate">Scadute</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold text-red-600">{expiredPlayers}</div>
                </CardContent>
              </Card>
            </div>

            <CalendarView players={players} onVisitStatusChange={openVisitStatusDialog} />

            {/* Recent Players */}
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Giocatori Recenti</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Panoramica dello stato delle visite mediche
                </CardDescription>
              </CardHeader>
              <CardContent>
                {players.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-medium text-gray-800 mb-3">Nessun giocatore</h3>
                    <p className="text-gray-600 text-lg mb-6">
                      Inizia aggiungendo il primo giocatore nella sezione Lista Giocatori
                    </p>
                    <Button
                      onClick={() => setActiveTab("list")}
                      className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <List className="h-5 w-5 mr-2" />
                      Vai alla Lista Giocatori
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {players.slice(0, 5).map((player) => (
                      <div
                        key={player.id}
                        className={`rounded-lg p-3 sm:p-4 border-2 transition-all duration-200 ${
                          player.visit_completed
                            ? "bg-green-50 border-green-200 hover:border-green-300"
                            : "bg-gray-50 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 sm:gap-4">
                          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                            <div className="relative flex-shrink-0">
                              <div
                                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                                  player.visit_completed ? "bg-green-600" : "bg-blue-600"
                                }`}
                              >
                                <span className="text-white font-bold text-sm sm:text-lg">
                                  {player.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </span>
                              </div>
                              {player.visit_completed && (
                                <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <CheckCircle2 className="h-2.5 w-2.5 sm:h-4 sm:w-4 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-gray-800 text-base sm:text-lg flex items-center gap-1 sm:gap-2 flex-wrap">
                                <span className="truncate">{player.name}</span>
                                {player.visit_completed && (
                                  <Badge className="bg-green-100 text-green-800 border-green-300 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                                    Completata
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-gray-600 text-sm sm:text-base truncate">{player.position}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            <Badge
                              variant={getStatusColor(player.status)}
                              className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm"
                            >
                              {React.cloneElement(getStatusIcon(player.status), { className: "h-3 w-3 sm:h-4 sm:w-4" })}
                              <span className="font-medium hidden sm:inline">{getStatusText(player.status)}</span>
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openVisitStatusDialog(player)}
                              className={`border-2 h-8 w-8 p-0 ${
                                player.visit_completed
                                  ? "border-green-300 text-green-700 hover:bg-green-50"
                                  : "border-orange-300 text-orange-700 hover:bg-orange-50"
                              }`}
                            >
                              {player.visit_completed ? (
                                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              ) : (
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                            <p className="text-gray-700 text-sm sm:text-base">
                              Scade: {new Date(player.medical_expiry_date).toLocaleDateString("it-IT")}
                            </p>
                            {player.visit_completed && player.visit_completed_date && (
                              <p className="text-green-700 text-xs sm:text-sm font-medium">
                                Completata: {new Date(player.visit_completed_date).toLocaleDateString("it-IT")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "list" && (
          <div className="p-4">
            <ListView
              players={players}
              onEditPlayer={(player) => {
                setSelectedPlayer(player)
                setIsPlayerDialogOpen(true)
              }}
              onVisitStatusChange={openVisitStatusDialog}
              onRefresh={fetchPlayers}
              onAddPlayer={() => setIsPlayerDialogOpen(true)}
            />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg safe-area-pb">
        <div className="grid grid-cols-2 h-16 sm:h-20 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 px-2 ${
              activeTab === "home" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Home className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium truncate">Home</span>
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 px-2 ${
              activeTab === "list" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <List className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium truncate">Lista Giocatori</span>
          </button>
        </div>
      </div>

      <PlayerDialog
        isOpen={isPlayerDialogOpen}
        onClose={() => {
          setIsPlayerDialogOpen(false)
          setSelectedPlayer(null)
        }}
        onSave={handlePlayerSaved}
        player={selectedPlayer}
        teamId={team.id}
      />

      <VisitStatusDialog
        isOpen={isVisitStatusDialogOpen}
        onClose={() => {
          setIsVisitStatusDialogOpen(false)
          setVisitStatusPlayer(null)
        }}
        player={visitStatusPlayer}
        onUpdatePlayer={handleUpdatePlayer}
      />
    </div>
  )
}
