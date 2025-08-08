"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertTriangle, Calendar, User, Mail, Phone, MapPin, X } from 'lucide-react'
import * as React from 'react'

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

interface VisitStatusDialogProps {
  isOpen: boolean
  onClose: () => void
  player: Player | null
  onMarkCompleted: (playerId: string) => void
  onMarkIncomplete: (playerId: string) => void
}

export function VisitStatusDialog({ 
  isOpen, 
  onClose, 
  player, 
  onMarkCompleted, 
  onMarkIncomplete 
}: VisitStatusDialogProps) {
  const [loading, setLoading] = useState(false)

  if (!player) return null

  const handleMarkCompleted = async () => {
    setLoading(true)
    try {
      await onMarkCompleted(player.id)
      onClose()
    } catch (error) {
      console.error('Error marking visit as completed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkIncomplete = async () => {
    setLoading(true)
    try {
      await onMarkIncomplete(player.id)
      onClose()
    } catch (error) {
      console.error('Error marking visit as incomplete:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'expired': return <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
      case 'expiring_soon': return <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
      case 'valid': return <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired': return 'bg-red-100 text-red-800 border-red-300'
      case 'expiring_soon': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'valid': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
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

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(expiryDate + 'T00:00:00')
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry
  }

  const daysUntilExpiry = getDaysUntilExpiry(player.medical_expiry_date)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl p-0 gap-0">
        {/* Header with Close Button */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          
          <div className="flex items-center gap-3 sm:gap-4 pr-8 sm:pr-12">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-lg sm:text-2xl">
                  {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              {player.visit_completed && (
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold truncate">{player.name}</h2>
              <p className="text-blue-100 text-sm sm:text-base opacity-90">{player.position}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Player Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Email</span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">{player.email}</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Telefono</span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-gray-800">{player.phone}</p>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                <span>Stato Visita Medica</span>
              </h3>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className={`inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 ${getStatusColor(player.status)}`}>
                  {React.cloneElement(getStatusIcon(player.status), { className: "h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" })}
                  <span className="font-semibold text-sm sm:text-base">{getStatusText(player.status)}</span>
                </div>
                
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Giorni alla scadenza</p>
                  <p className={`text-lg sm:text-xl font-bold ${
                    daysUntilExpiry < 0 ? 'text-red-600' :
                    daysUntilExpiry <= 7 ? 'text-orange-600' :
                    daysUntilExpiry <= 30 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {daysUntilExpiry < 0 
                      ? `${Math.abs(daysUntilExpiry)} giorni fa`
                      : daysUntilExpiry === 0 
                      ? 'Oggi'
                      : daysUntilExpiry === 1
                      ? 'Domani'
                      : `${daysUntilExpiry} giorni`
                    }
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1 sm:mb-2">Data Visita</p>
                  <p className="text-sm sm:text-base font-bold text-blue-800">
                    {new Date(player.medical_exam_date).toLocaleDateString('it-IT', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <p className="text-xs sm:text-sm font-medium text-purple-600 mb-1 sm:mb-2">Data Scadenza</p>
                  <p className="text-sm sm:text-base font-bold text-purple-800">
                    {new Date(player.medical_expiry_date).toLocaleDateString('it-IT', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Current Status Display */}
              {player.visit_completed ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-green-800 font-bold text-base sm:text-lg">✅ Visita Completata</h4>
                      <p className="text-green-700 text-sm sm:text-base">
                        Completata il {player.visit_completed_date ? 
                          new Date(player.visit_completed_date).toLocaleDateString('it-IT', {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          }) : 
                          'Data non disponibile'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-3 sm:p-4">
                    <p className="text-green-800 text-xs sm:text-sm font-medium">
                      💡 <strong>Vuoi annullare il completamento?</strong> Puoi sempre modificare questo stato se necessario.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-orange-800 font-bold text-base sm:text-lg">⏳ Visita in Attesa</h4>
                      <p className="text-orange-700 text-sm sm:text-base">
                        La visita medica non è ancora stata completata
                      </p>
                    </div>
                  </div>
                  <div className="bg-orange-100 rounded-lg p-3 sm:p-4">
                    <p className="text-orange-800 text-xs sm:text-sm font-medium">
                      🎯 <strong>Pronto a confermare?</strong> Segna come completata quando la visita è stata effettuata.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
            <h4 className="text-blue-800 font-semibold mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
              <span>🚀</span>
              <span>Azioni Rapide</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-10 sm:h-12 border-blue-300 text-blue-700 hover:bg-blue-100 text-xs sm:text-sm"
                onClick={() => window.open(`mailto:${player.email}`)}
              >
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="truncate">Invia Email</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-10 sm:h-12 border-blue-300 text-blue-700 hover:bg-blue-100 text-xs sm:text-sm"
                onClick={() => window.open(`tel:${player.phone}`)}
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="truncate">Chiama</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-b-2xl border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 h-12 sm:h-14 text-base sm:text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-medium"
            >
              Annulla
            </Button>
            
            {player.visit_completed ? (
              <Button 
                onClick={handleMarkIncomplete}
                disabled={loading}
                className="flex-1 h-12 sm:h-14 text-base sm:text-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Aggiornamento...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span>Segna come Non Completata</span>
                  </div>
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleMarkCompleted}
                disabled={loading}
                className="flex-1 h-12 sm:h-14 text-base sm:text-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Aggiornamento...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span>Segna come Completata</span>
                  </div>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
