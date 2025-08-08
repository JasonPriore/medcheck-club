"use client"

import { useState } from "react"
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, Mail, Phone, CalendarIcon, CheckCircle2 } from 'lucide-react'

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
  status: 'valid' | 'expiring_soon' | 'expired'
}

interface CalendarViewProps {
  players: Player[]
  onVisitStatusChange?: (player: Player) => void
}

export function CalendarView({ players, onVisitStatusChange }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  const getPlayersForDate = (date: Date) => {
    // Create date string in local timezone to avoid off-by-one errors
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    return players.filter(player => player.medical_expiry_date === dateString)
  }

  const getDateStatus = (date: Date) => {
    const playersOnDate = getPlayersForDate(date)
    if (playersOnDate.length === 0) return null
    
    const hasExpired = playersOnDate.some(p => p.status === 'expired')
    const hasExpiringSoon = playersOnDate.some(p => p.status === 'expiring_soon')
    
    if (hasExpired) return 'expired'
    if (hasExpiringSoon) return 'expiring_soon'
    return 'valid'
  }

  const getDatePlayerCount = (date: Date) => {
    return getPlayersForDate(date).length
  }

  const modifiers = {
    expired: (date: Date) => getDateStatus(date) === 'expired',
    expiring_soon: (date: Date) => getDateStatus(date) === 'expiring_soon',
    valid: (date: Date) => getDateStatus(date) === 'valid',
    hasPlayers: (date: Date) => getPlayersForDate(date).length > 0
  }

  const modifiersStyles = {
    expired: { 
      backgroundColor: '#dc2626', 
      color: '#ffffff',
      fontWeight: 'bold',
      borderRadius: '8px',
      position: 'relative'
    },
    expiring_soon: { 
      backgroundColor: '#d97706', 
      color: '#ffffff',
      fontWeight: 'bold',
      borderRadius: '8px',
      position: 'relative'
    },
    valid: { 
      backgroundColor: '#16a34a', 
      color: '#ffffff',
      fontWeight: 'bold',
      borderRadius: '8px',
      position: 'relative'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'expired': return 'Scaduta'
      case 'expiring_soon': return 'In Scadenza'
      case 'valid': return 'Valida'
      default: return 'Sconosciuto'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired': return 'destructive'
      case 'expiring_soon': return 'secondary'
      case 'valid': return 'default'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'expired': return <AlertTriangle className="h-4 w-4" />
      case 'expiring_soon': return <Clock className="h-4 w-4" />
      case 'valid': return <CheckCircle className="h-4 w-4" />
      default: return null
    }
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to avoid timezone issues
    const expiry = new Date(expiryDate + 'T00:00:00') // Ensure consistent timezone
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry
  }

  const selectedDatePlayers = selectedDate ? getPlayersForDate(selectedDate) : []
  const isToday = selectedDate && selectedDate.toDateString() === new Date().toDateString()
  const isTomorrow = selectedDate && selectedDate.toDateString() === new Date(Date.now() + 86400000).toDateString()

  return (
    <div className="space-y-6">
      {/* Enhanced Calendar Card */}
      <Card className="bg-white border-gray-200 shadow-xl">
        <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl sm:text-2xl text-gray-800 flex items-center gap-2 sm:gap-3 flex-wrap">
                <CalendarIcon className="h-5 w-5 sm:h-7 sm:w-7 text-blue-600 flex-shrink-0" />
                <span className="truncate">Calendario Visite Mediche</span>
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-gray-600 mt-1 sm:mt-2">
                Visualizza le scadenze delle visite mediche per ogni giorno
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Container with Enhanced Styling */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-6 border border-gray-200">
            <div className="w-full max-w-sm mx-auto">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-lg border-0 text-gray-800 w-full"
                classNames={{
                  months: "text-gray-800 w-full",
                  month: "text-gray-800 w-full space-y-3",
                  caption: "text-gray-800 text-lg sm:text-xl mb-4 flex justify-center items-center relative px-8 sm:px-12",
                  caption_label: "text-lg sm:text-xl font-semibold text-center flex-1",
                  nav: "text-gray-800 flex items-center",
                  nav_button: "text-gray-800 hover:bg-gray-200 h-8 w-8 sm:h-10 sm:w-10 rounded-lg transition-all duration-200 border border-gray-300 hover:border-gray-400 flex items-center justify-center text-sm",
                  nav_button_previous: "absolute left-0",
                  nav_button_next: "absolute right-0",
                  table: "text-gray-800 w-full border-collapse",
                  head_row: "text-gray-600 mb-1",
                  head_cell: "text-gray-600 font-semibold text-xs sm:text-sm p-1 text-center w-[14.28%]",
                  row: "text-gray-800 w-full",
                  cell: "text-gray-800 text-xs sm:text-sm p-0.5 sm:p-1 relative text-center w-[14.28%]",
                  day: "h-8 w-8 sm:h-10 sm:w-10 text-xs sm:text-sm font-medium hover:bg-gray-200 rounded-md transition-all duration-200 flex flex-col items-center justify-center relative mx-auto border border-transparent hover:border-gray-300",
                  day_selected: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg ring-1 ring-blue-400 border-blue-600",
                  day_today: "bg-blue-100 text-blue-800 font-bold ring-1 ring-blue-300 border-blue-300",
                  day_outside: "text-gray-400 opacity-50",
                  day_disabled: "text-gray-300 opacity-30",
                  day_range_middle: "aria-selected:bg-gray-100",
                  day_hidden: "invisible"
                }}
                components={{
                  DayContent: ({ date }) => {
                    const playerCount = getDatePlayerCount(date)
                    const status = getDateStatus(date)
                    
                    return (
                      <div className="flex flex-col items-center justify-center h-full w-full relative">
                        <span className="text-xs font-medium leading-none">{date.getDate()}</span>
                        {playerCount > 0 && (
                          <div className={`
                            absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 rounded-full text-xs font-bold flex items-center justify-center text-white shadow-sm
                            ${status === 'expired' ? 'bg-red-500' : 
                              status === 'expiring_soon' ? 'bg-orange-500' : 'bg-green-500'}
                          `}>
                            <span className="text-xs leading-none">
                              {playerCount > 9 ? '9+' : playerCount}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  }
                }}
              />
            </div>
          </div>
          
          {/* Enhanced Legend */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-red-700 font-medium text-sm sm:text-base block">Visite Scadute</span>
                <p className="text-red-600 text-xs sm:text-sm">Richiedono attenzione immediata</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-orange-700 font-medium text-sm sm:text-base block">In Scadenza</span>
                <p className="text-orange-600 text-xs sm:text-sm">Entro 30 giorni</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-green-700 font-medium text-sm sm:text-base block">Visite Valide</span>
                <p className="text-green-600 text-xs sm:text-sm">Oltre 30 giorni</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Selected Date Details */}
      <Card className="bg-white border-gray-200 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-800 flex items-center gap-3">
                {isToday && <span className="text-blue-600">🔥</span>}
                {isTomorrow && <span className="text-orange-600">⚡</span>}
                {selectedDate ? (
                  <>
                    Visite del {selectedDate.toLocaleDateString('it-IT', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    {isToday && <Badge className="ml-3 bg-blue-600 text-white">Oggi</Badge>}
                    {isTomorrow && <Badge className="ml-3 bg-orange-600 text-white">Domani</Badge>}
                  </>
                ) : (
                  'Seleziona una Data'
                )}
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg mt-2">
                {selectedDatePlayers.length > 0 
                  ? `${selectedDatePlayers.length} giocatore${selectedDatePlayers.length > 1 ? 'i' : ''} con visite in scadenza`
                  : 'Nessuna visita in scadenza in questa data'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedDatePlayers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Nessuna Visita in Scadenza</h3>
              <p className="text-gray-600 text-lg">
                {selectedDate 
                  ? `Non ci sono visite mediche in scadenza il ${selectedDate.toLocaleDateString('it-IT')}`
                  : 'Seleziona una data dal calendario per vedere i dettagli'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {selectedDatePlayers.map((player, index) => (
                <div key={player.id} className="group">
                  <div className={`rounded-xl p-4 sm:p-6 border-2 hover:shadow-lg transition-all duration-300 ${
                    player.visit_completed 
                      ? 'bg-green-50 border-green-200 hover:border-green-300' 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                        <div className="relative flex-shrink-0">
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shadow-lg ${
                            player.visit_completed ? 'bg-green-600' : 'bg-blue-600'
                          }`}>
                            <span className="text-white font-bold text-base sm:text-xl">
                              {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          {player.visit_completed && (
                            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-800 text-lg sm:text-xl mb-1 flex items-start flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="truncate">{player.name}</span>
                            {player.visit_completed && (
                              <Badge className="bg-green-100 text-green-800 border-green-300 text-xs px-1.5 py-0.5 w-fit">
                                Completata
                              </Badge>
                            )}
                          </h4>
                          <p className="text-gray-600 text-sm sm:text-base font-medium truncate">{player.position}</p>
                          <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
                            <Badge 
                              variant={getStatusColor(player.status)}
                              className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm"
                            >
                              {React.cloneElement(getStatusIcon(player.status), { className: "h-3 w-3 sm:h-4 sm:w-4" })}
                              <span className="font-medium">
                                {getStatusText(player.status)}
                              </span>
                            </Badge>
                            <div className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
                              getDaysUntilExpiry(player.medical_expiry_date) < 0 ? 'bg-red-100 text-red-700' :
                              getDaysUntilExpiry(player.medical_expiry_date) <= 7 ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {getDaysUntilExpiry(player.medical_expiry_date) < 0 
                                ? `${Math.abs(getDaysUntilExpiry(player.medical_expiry_date))} giorni fa`
                                : getDaysUntilExpiry(player.medical_expiry_date) === 0 
                                ? 'Oggi'
                                : getDaysUntilExpiry(player.medical_expiry_date) === 1
                                ? 'Domani'
                                : `${getDaysUntilExpiry(player.medical_expiry_date)} giorni`
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex items-center text-gray-700 text-sm sm:text-base">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{player.email}</span>
                      </div>
                      <div className="flex items-center text-gray-700 text-sm sm:text-base">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 flex-shrink-0" />
                        <span>{player.phone}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200 mb-3 sm:mb-4">
                      <div>
                        <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Data Visita</p>
                        <p className="text-gray-800 font-semibold text-sm sm:text-base">
                          {new Date(player.medical_exam_date).toLocaleDateString('it-IT')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Data Scadenza</p>
                        <p className="text-gray-800 font-semibold text-sm sm:text-base">
                          {new Date(player.medical_expiry_date).toLocaleDateString('it-IT')}
                        </p>
                      </div>
                    </div>

                    {player.visit_completed && player.visit_completed_date && (
                      <div className="bg-green-100 border border-green-200 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                        <p className="text-green-800 font-medium text-xs sm:text-sm">
                          ✅ Visita completata il {new Date(player.visit_completed_date).toLocaleDateString('it-IT')}
                        </p>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-10 sm:h-auto text-xs sm:text-sm"
                        onClick={() => alert(`Promemoria inviato a ${player.name}`)}
                      >
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                        <span className="truncate">Invia Promemoria</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-10 sm:h-auto text-xs sm:text-sm"
                        onClick={() => window.open(`tel:${player.phone}`)}
                      >
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                        <span className="truncate">Chiama</span>
                      </Button>
                      {onVisitStatusChange && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onVisitStatusChange(player)}
                          className={`flex-1 border-2 h-10 sm:h-auto text-xs sm:text-sm ${
                            player.visit_completed 
                              ? 'border-green-300 text-green-700 hover:bg-green-50' 
                              : 'border-orange-300 text-orange-700 hover:bg-orange-50'
                          }`}
                        >
                          {player.visit_completed ? 
                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> : 
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                          }
                          <span className="truncate">
                            {player.visit_completed ? 'Completata' : 'In Attesa'}
                          </span>
                        </Button>
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
  )
}
