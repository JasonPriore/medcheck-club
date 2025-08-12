"use client"

import { useState } from "react"
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, Mail, Phone, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'

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

  // New function to get colored dots for each date
  const getDateDots = (date: Date) => {
    const playersOnDate = getPlayersForDate(date)
    if (playersOnDate.length === 0) return []
    
    const dots = []
    const hasExpired = playersOnDate.some(p => p.status === 'expired' && !p.visit_completed)
    const hasCompleted = playersOnDate.some(p => p.visit_completed)
    const hasExpiringSoon = playersOnDate.some(p => p.status === 'expiring_soon' && !p.visit_completed)
    
    // Past/expired visits (red dot) - only if NOT completed
    if (hasExpired) {
      dots.push({ color: 'red', count: playersOnDate.filter(p => p.status === 'expired' && !p.visit_completed).length })
    }
    
    // Completed visits (green dot) - always show if completed
    if (hasCompleted) {
      dots.push({ color: 'green', count: playersOnDate.filter(p => p.visit_completed).length })
    }
    
    // Future expiring soon (orange dot) - only if no expired visits and not completed
    if (!hasExpired && hasExpiringSoon) {
      dots.push({ color: 'orange', count: playersOnDate.filter(p => p.status === 'expiring_soon' && !p.visit_completed).length })
    }
    
    return dots
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
      case "expired":
        return <AlertTriangle className="h-4 w-4" />
      case "expiring_soon":
        return <Clock className="h-4 w-4" />
      case "valid":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(expiryDate + 'T00:00:00')
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry
  }

  const selectedDatePlayers = selectedDate ? getPlayersForDate(selectedDate) : []
  const isToday = selectedDate && selectedDate.toDateString() === new Date().toDateString()
  const isTomorrow = selectedDate && selectedDate.toDateString() === new Date(Date.now() + 86400000).toDateString()

  return (
    <div className="space-y-8">
      {/* Minimal Calendar Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-light text-gray-900 tracking-tight">
          Calendario Visite
        </h1>
        <p className="text-gray-600 text-lg">
          Gestisci le scadenze delle visite mediche
        </p>
      </div>

      {/* Enhanced Calendar Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
        <CardContent className="p-8">
          {/* Calendar Container */}
          <div className="max-w-md mx-auto">
            {/* Custom Calendar Header */}
            <div className="flex items-center justify-center relative px-12 py-2 mb-4">
              <button
                onClick={() => {
                  const prevMonth = new Date(currentMonth)
                  prevMonth.setMonth(prevMonth.getMonth() - 1)
                  setCurrentMonth(prevMonth)
                }}
                className="absolute left-0 h-8 w-8 rounded-full border-0 bg-white shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <h2 className="text-xl font-medium text-gray-900">
                {currentMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
              </h2>
              
              <button
                onClick={() => {
                  const nextMonth = new Date(currentMonth)
                  nextMonth.setMonth(nextMonth.getMonth() + 1)
                  setCurrentMonth(nextMonth)
                }}
                className="absolute right-0 h-8 w-8 rounded-full border-0 bg-white shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-gray-900"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Custom Calendar Grid */}
            <div className="w-full">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day) => (
                  <div key={day} className="text-gray-500 font-medium text-sm p-2 text-center">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {(() => {
                  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
                  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
                  const startDate = new Date(firstDay)
                  startDate.setDate(startDate.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1))
                  
                  const days = []
                  for (let i = 0; i < 42; i++) {
                    const date = new Date(startDate)
                    date.setDate(startDate.getDate() + i)
                    
                    const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
                    const isToday = date.toDateString() === new Date().toDateString()
                    const dots = getDateDots(date)
                    
                    days.push(
                      <button
                        key={i}
                        onClick={() => setSelectedDate(date)}
                        className={`
                          h-10 w-10 text-sm font-medium rounded-full transition-all duration-200 flex flex-col items-center justify-center relative mx-auto border-0
                          ${isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
                          ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' : ''}
                          ${!isSelected && isToday ? 'bg-blue-100 text-blue-900 font-semibold ring-2 ring-blue-200' : ''}
                          ${!isSelected && !isToday && isCurrentMonth ? 'hover:bg-gray-100 hover:shadow-sm' : ''}
                        `}
                      >
                        <span className="text-sm font-medium leading-none">{date.getDate()}</span>
                        
                        {/* Colored dots for visit status */}
                        {dots.length > 0 && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {dots.map((dot, index) => (
                              <div
                                key={index}
                                className={`w-2 h-2 rounded-full shadow-sm ${
                                  dot.color === 'red' ? 'bg-red-500' :
                                  dot.color === 'green' ? 'bg-green-500' :
                                  dot.color === 'orange' ? 'bg-orange-500' : 'bg-gray-500'
                                }`}
                                title={`${dot.count} visita${dot.count > 1 ? 'e' : ''} ${
                                  dot.color === 'red' ? 'scadute' :
                                  dot.color === 'green' ? 'completate' :
                                  dot.color === 'orange' ? 'in scadenza' : ''
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    )
                  }
                  return days
                })()}
              </div>
            </div>
          </div>
          
          {/* Enhanced Legend */}
          <div className="mt-8 flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Visite Scadute</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600">In Scadenza</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Completate</span>
              </div>
            </div>
          </div>
          
          {/* Legend Explanation */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              I pallini sotto ogni data indicano lo stato delle visite: rosso (scadute), arancione (in scadenza), verde (completate)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-light text-gray-900">
                  {isToday && <span className="text-blue-600 mr-2">🔥</span>}
                  {isTomorrow && <span className="text-orange-600 mr-2">⚡</span>}
                  {selectedDate.toLocaleDateString('it-IT', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  {selectedDatePlayers.length > 0 
                    ? `${selectedDatePlayers.length} giocatore${selectedDatePlayers.length > 1 ? 'i' : ''} con visite in scadenza`
                    : 'Nessuna visita in scadenza in questa data'
                  }
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {isToday && <Badge className="bg-blue-100 text-blue-800 border-blue-200">Oggi</Badge>}
                {isTomorrow && <Badge className="bg-orange-100 text-orange-800 border-orange-200">Domani</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedDatePlayers.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Nessuna Visita in Scadenza</h3>
                <p className="text-gray-600">
                  {selectedDate 
                    ? `Non ci sono visite mediche in scadenza il ${selectedDate.toLocaleDateString('it-IT')}`
                    : 'Seleziona una data dal calendario per vedere i dettagli'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDatePlayers.map((player) => (
                  <div key={player.id} className="group">
                    <div className={`rounded-2xl p-6 border-0 hover:shadow-lg transition-all duration-300 ${
                      player.visit_completed 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm' 
                        : 'bg-gradient-to-r from-gray-50 to-slate-50 shadow-sm'
                    }`}>
                      <div className="flex items-start justify-between mb-4 gap-4">
                        <div className="flex items-center space-x-4 min-w-0 flex-1">
                          <div className="relative flex-shrink-0">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                              player.visit_completed ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                            }`}>
                              <span className="text-white font-bold text-xl">
                                {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            {player.visit_completed && (
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <CheckCircle2 className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900 text-xl break-words leading-tight">{player.name}</h4>
                              {player.visit_completed && (
                                <Badge className="bg-green-100 text-green-800 border-green-300 text-xs px-2 py-1 flex-shrink-0">
                                  Completata
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 font-medium mb-3 break-words">{player.position}</p>
                            <div className="flex items-center gap-3 flex-wrap">
                              <Badge 
                                variant={getStatusColor(player.status)}
                                className="flex items-center gap-2 px-3 py-1 flex-shrink-0"
                              >
                                {React.cloneElement(getStatusIcon(player.status), { className: "h-4 w-4" })}
                                <span className="font-medium">
                                  {getStatusText(player.status)}
                                </span>
                              </Badge>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${
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
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-gray-700 min-w-0">
                          <Mail className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                          <span className="truncate text-sm">{player.email}</span>
                        </div>
                        <div className="flex items-center text-gray-700 min-w-0">
                          <Phone className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                          <span className="text-sm break-words">{player.phone}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 mb-4">
                        <div>
                          <p className="text-gray-500 text-xs font-medium mb-1">Data Visita</p>
                          <p className="text-gray-800 font-semibold text-sm">
                            {new Date(player.medical_exam_date).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-medium mb-1">Data Scadenza</p>
                          <p className="text-gray-800 font-semibold text-sm">
                            {new Date(player.medical_expiry_date).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                      </div>

                      {player.visit_completed && player.visit_completed_date && (
                        <div className="bg-green-100 border border-green-200 rounded-xl p-3 mb-4">
                          <p className="text-green-800 font-medium text-sm">
                            ✅ Visita completata il {new Date(player.visit_completed_date).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-11 shadow-sm min-w-0"
                          onClick={() => alert(`Promemoria inviato a ${player.name}`)}
                        >
                          <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Invia Promemoria</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-11 min-w-0"
                          onClick={() => window.open(`tel:${player.phone}`)}
                        >
                          <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Chiama</span>
                        </Button>
                        {onVisitStatusChange && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onVisitStatusChange(player)}
                            className={`flex-1 h-11 min-w-0 ${
                              player.visit_completed 
                                ? 'border-green-300 text-green-700 hover:bg-green-50' 
                                : 'border-orange-300 text-orange-700 hover:bg-orange-50'
                            }`}
                          >
                            {player.visit_completed ? 
                              <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" /> : 
                              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
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
      )}
    </div>
  )
}
