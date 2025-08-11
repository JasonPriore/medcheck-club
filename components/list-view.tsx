"use client"

import { useState } from "react"
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Edit, Mail, Phone, Search, Trash2, CheckCircle2, Clock, Plus } from "lucide-react"
import { deletePlayer } from "@/lib/local-storage"

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
}

interface ListViewProps {
  players: Player[]
  onEditPlayer: (player: Player) => void
  onVisitStatusChange?: (player: Player) => void
  onRefresh: () => void
  onAddPlayer: () => void
}

export function ListView({ players, onEditPlayer, onVisitStatusChange, onRefresh, onAddPlayer }: ListViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [positionFilter, setPositionFilter] = useState<string>("all")
  const [visitFilter, setVisitFilter] = useState<string>("all")

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || player.status === statusFilter
    const matchesPosition = positionFilter === "all" || player.position === positionFilter
    const matchesVisit =
      visitFilter === "all" ||
      (visitFilter === "completed" && player.visit_completed) ||
      (visitFilter === "pending" && !player.visit_completed)

    return matchesSearch && matchesStatus && matchesPosition && matchesVisit
  })

  const handleDeletePlayer = async (playerId: string) => {
    if (confirm("Sei sicuro di voler eliminare questo giocatore?")) {
      try {
        await deletePlayer(playerId)
        onRefresh()
      } catch (error) {
        console.error("Error deleting player:", error)
      }
    }
  }

  const sendReminder = async (player: Player) => {
    alert(`Promemoria inviato a ${player.name} all'indirizzo ${player.email}`)
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

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry
  }

  return (
    <div className="space-y-6">
      <Button onClick={onAddPlayer} className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white">
        <Plus className="h-6 w-6 mr-3" />
        Aggiungi Giocatore
      </Button>

      <Card className="bg-white border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Lista Giocatori</CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Gestisci tutti i giocatori e lo stato delle loro visite mediche
          </CardDescription>

          {/* Filters */}
          <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                placeholder="Cerca giocatori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 sm:pl-12 h-10 sm:h-12 text-base sm:text-lg bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 sm:h-12 text-base sm:text-lg bg-gray-50 border-gray-300 text-gray-800">
                  <SelectValue placeholder="Filtra per stato" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="all" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Tutti gli Stati
                  </SelectItem>
                  <SelectItem value="valid" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Valide
                  </SelectItem>
                  <SelectItem value="expiring_soon" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    In Scadenza
                  </SelectItem>
                  <SelectItem value="expired" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Scadute
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="h-10 sm:h-12 text-base sm:text-lg bg-gray-50 border-gray-300 text-gray-800">
                  <SelectValue placeholder="Filtra per ruolo" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="all" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Tutti i Ruoli
                  </SelectItem>
                  <SelectItem value="Portiere" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Portiere
                  </SelectItem>
                  <SelectItem value="Difensore" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Difensore
                  </SelectItem>
                  <SelectItem value="Centrocampista" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Centrocampista
                  </SelectItem>
                  <SelectItem value="Attaccante" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Attaccante
                  </SelectItem>
                  <SelectItem value="Allenatore" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Allenatore
                  </SelectItem>
                  <SelectItem value="Staff" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Staff
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={visitFilter} onValueChange={setVisitFilter}>
                <SelectTrigger className="h-10 sm:h-12 text-base sm:text-lg bg-gray-50 border-gray-300 text-gray-800">
                  <SelectValue placeholder="Filtra per visita" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="all" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Tutte le Visite
                  </SelectItem>
                  <SelectItem value="completed" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Completate
                  </SelectItem>
                  <SelectItem value="pending" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    In Attesa
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Nessun giocatore trovato con i criteri selezionati</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  className={`rounded-lg p-3 sm:p-4 border-2 transition-all duration-200 ${
                    player.visit_completed
                      ? "bg-green-50 border-green-200 hover:border-green-300"
                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
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
                        <h4 className="font-medium text-gray-800 text-base sm:text-lg flex items-start flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="truncate">{player.name}</span>
                          {player.visit_completed && (
                            <Badge className="bg-green-100 text-green-800 border-green-300 text-xs px-1.5 py-0.5 w-fit">
                              Completata
                            </Badge>
                          )}
                        </h4>
                        <p className="text-gray-600 text-sm sm:text-base truncate">{player.position}</p>
                      </div>
                    </div>
                    <Badge
                      variant={getStatusColor(player.status)}
                      className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm flex-shrink-0"
                    >
                      {React.cloneElement(getStatusIcon(player.status), { className: "h-3 w-3 sm:h-4 sm:w-4" })}
                      <span className="font-medium hidden sm:inline">{getStatusText(player.status)}</span>
                    </Badge>
                  </div>

                  <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center text-gray-700 text-sm sm:text-base">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 flex-shrink-0" />
                      <span className="truncate">{player.email}</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm sm:text-base">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 flex-shrink-0" />
                      <span>{player.phone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Data Visita</p>
                      <p className="text-gray-800 font-medium">
                        {new Date(player.medical_exam_date).toLocaleDateString("it-IT")}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Data Scadenza</p>
                      <p className="text-gray-800 font-medium">
                        {new Date(player.medical_expiry_date).toLocaleDateString("it-IT")}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <p className="text-gray-500 text-xs sm:text-sm mb-1">Giorni alla Scadenza</p>
                    <p
                      className={`font-bold text-base sm:text-lg ${
                        getDaysUntilExpiry(player.medical_expiry_date) < 0
                          ? "text-red-600"
                          : getDaysUntilExpiry(player.medical_expiry_date) <= 30
                            ? "text-orange-600"
                            : "text-green-600"
                      }`}
                    >
                      {getDaysUntilExpiry(player.medical_expiry_date) < 0
                        ? `${Math.abs(getDaysUntilExpiry(player.medical_expiry_date))} giorni fa`
                        : `${getDaysUntilExpiry(player.medical_expiry_date)} giorni`}
                    </p>
                  </div>

                  {player.visit_completed && player.visit_completed_date && (
                    <div className="bg-green-100 border border-green-200 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                      <p className="text-green-800 font-medium text-xs sm:text-sm">
                        ✅ Visita completata il {new Date(player.visit_completed_date).toLocaleDateString("it-IT")}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditPlayer(player)}
                      className="h-10 sm:h-12 border-gray-300 text-gray-700 hover:bg-gray-100 text-xs sm:text-sm"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="truncate">Modifica</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendReminder(player)}
                      className="h-10 sm:h-12 bg-blue-600 border-blue-500 text-white hover:bg-blue-700 text-xs sm:text-sm"
                    >
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="truncate">Promemoria</span>
                    </Button>
                    {onVisitStatusChange && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onVisitStatusChange(player)}
                        className={`h-10 sm:h-12 border-2 text-xs sm:text-sm ${
                          player.visit_completed
                            ? "border-green-300 text-green-700 hover:bg-green-50"
                            : "border-orange-300 text-orange-700 hover:bg-orange-50"
                        }`}
                      >
                        {player.visit_completed ? (
                          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                        ) : (
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                        )}
                        <span className="truncate">{player.visit_completed ? "Completata" : "In Attesa"}</span>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePlayer(player.id)}
                      className="h-10 sm:h-12 bg-red-600 border-red-500 text-white hover:bg-red-700 text-xs sm:text-sm"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="truncate">Elimina</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
