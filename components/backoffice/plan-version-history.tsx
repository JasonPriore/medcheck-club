'use client'

import { useState } from 'react'
import { 
  Package, 
  History, 
  X, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Copy,
  Eye,
  Calendar,
  User,
  ArrowRight,
  Tag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SubscriptionPlanTemplate, SubscriptionPlanVersion } from '@/lib/backoffice-types'

interface PlanVersionHistoryProps {
  isOpen: boolean
  onClose: () => void
  plan: SubscriptionPlanTemplate | null
  onCreateNewVersion: (planId: string) => void
}

export function PlanVersionHistory({ isOpen, onClose, plan, onCreateNewVersion }: PlanVersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<SubscriptionPlanVersion | null>(null)

  if (!isOpen || !plan) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getVersionStatus = (version: SubscriptionPlanVersion) => {
    if (version.is_current) {
      return {
        label: 'Versione Corrente',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
      }
    } else if (version.is_active) {
      return {
        label: 'Versione Attiva',
        color: 'bg-blue-100 text-blue-800',
        icon: Clock
      }
    } else {
      return {
        label: 'Versione Inattiva',
        color: 'bg-gray-100 text-gray-800',
        icon: AlertTriangle
      }
    }
  }

  const getVersionChanges = (currentVersion: SubscriptionPlanVersion, previousVersion?: SubscriptionPlanVersion) => {
    if (!previousVersion) {
      return ['Versione iniziale del piano']
    }

    const changes = []
    
    if (currentVersion.base_price !== previousVersion.base_price) {
      const change = currentVersion.base_price > previousVersion.base_price ? 'aumentato' : 'diminuito'
      changes.push(`Prezzo ${change} da €${previousVersion.base_price} a €${currentVersion.base_price}`)
    }
    
    if (currentVersion.teams_limit !== previousVersion.teams_limit) {
      const change = currentVersion.teams_limit > previousVersion.teams_limit ? 'aumentato' : 'diminuito'
      changes.push(`Limite squadre ${change} da ${previousVersion.teams_limit} a ${currentVersion.teams_limit}`)
    }
    
    if (currentVersion.players_limit !== previousVersion.players_limit) {
      const change = currentVersion.players_limit > previousVersion.players_limit ? 'aumentato' : 'diminuito'
      changes.push(`Limite giocatori ${change} da ${previousVersion.players_limit} a ${currentVersion.players_limit}`)
    }
    
    if (currentVersion.features.length !== previousVersion.features.length) {
      const change = currentVersion.features.length > previousVersion.features.length ? 'aggiunte' : 'rimosse'
      changes.push(`${Math.abs(currentVersion.features.length - previousVersion.features.length)} funzionalità ${change}`)
    }
    
    if (currentVersion.custom_pricing_enabled !== previousVersion.custom_pricing_enabled) {
      const change = currentVersion.custom_pricing_enabled ? 'abilitati' : 'disabilitati'
      changes.push(`Prezzi personalizzabili ${change}`)
    }
    
    if (changes.length === 0) {
      changes.push('Modifiche minori o aggiornamenti interni')
    }
    
    return changes
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <History className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Storico Versioni Piano</h2>
                <p className="text-gray-600">{plan.display_name} - Cronologia completa delle modifiche</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => onCreateNewVersion(plan.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Crea Nuova Versione
              </Button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Informazioni Piano */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">Piano:</span>
                <span className="ml-2 font-semibold text-blue-800">{plan.display_name}</span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Versione Corrente:</span>
                <span className="ml-2 font-semibold text-blue-800">{plan.current_version}</span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Clienti Totali:</span>
                <span className="ml-2 font-semibold text-blue-800">{plan.total_clients}</span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Ricavi Mensili:</span>
                <span className="ml-2 font-semibold text-blue-800">€{plan.monthly_revenue}</span>
              </div>
            </div>
          </div>

          {/* Timeline Versioni */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <History className="h-5 w-5 text-purple-600" />
              Timeline Versioni ({plan.versions.length})
            </h3>
            
            <div className="relative">
              {/* Linea temporale verticale */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-6">
                {plan.versions
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((version, index) => {
                    const status = getVersionStatus(version)
                    const StatusIcon = status.icon
                    const previousVersion = index < plan.versions.length - 1 ? plan.versions[index + 1] : undefined
                    const changes = getVersionChanges(version, previousVersion)
                    
                    return (
                      <div key={version.id} className="relative">
                        {/* Punto timeline */}
                        <div className={`absolute left-6 w-3 h-3 rounded-full border-2 border-white ${
                          version.is_current ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        
                        {/* Card versione */}
                        <div className={`ml-12 p-4 rounded-xl border-2 ${
                          version.is_current 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 bg-white'
                        } hover:shadow-md transition-all duration-200`}>
                          
                          {/* Header versione */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                <StatusIcon className="h-3 w-3 inline mr-1" />
                                {status.label}
                              </div>
                              <span className="text-lg font-bold text-gray-900">
                                {version.display_name}
                              </span>
                              <span className="text-sm text-gray-500">({version.version})</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => setSelectedVersion(version)}
                                variant="outline"
                                size="sm"
                                className="border-blue-300 text-blue-700 hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Dettagli
                              </Button>
                            </div>
                          </div>
                          
                          {/* Informazioni versione */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                            <div>
                              <span className="text-gray-600">Prezzo:</span>
                              <span className="ml-2 font-medium">€{version.base_price}/anno</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Limiti:</span>
                              <span className="ml-2 font-medium">{version.teams_limit} squadre, {version.players_limit} giocatori</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Funzionalità:</span>
                              <span className="ml-2 font-medium">{version.features.length}</span>
                            </div>
                          </div>
                          
                          {/* Modifiche dalla versione precedente */}
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <ArrowRight className="h-4 w-4 text-gray-500" />
                              Modifiche dalla versione precedente:
                            </h4>
                            <ul className="space-y-1">
                              {changes.map((change, changeIndex) => (
                                <li key={changeIndex} className="text-sm text-gray-600 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                  {change}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Footer versione */}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(version.created_at)}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {version.created_by}
                              </span>
                            </div>
                            
                            {version.notes && (
                              <span className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                Note disponibili
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Dettagli Versione */}
        {selectedVersion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Dettagli {selectedVersion.display_name}
                </h3>
                <button
                  onClick={() => setSelectedVersion(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Descrizione</h4>
                  <p className="text-gray-600 text-sm">{selectedVersion.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Funzionalità</h4>
                  <ul className="space-y-1">
                    {selectedVersion.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {selectedVersion.notes && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Note</h4>
                    <p className="text-gray-600 text-sm">{selectedVersion.notes}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Prezzi Personalizzabili:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      selectedVersion.custom_pricing_enabled 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedVersion.custom_pricing_enabled ? 'Sì' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Stato:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      selectedVersion.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedVersion.is_active ? 'Attivo' : 'Inattivo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
