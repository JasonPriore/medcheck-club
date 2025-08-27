'use client'

import { useState, useEffect } from 'react'
import { 
  Package, 
  Plus, 
  Settings, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  DollarSign,
  Edit,
  Copy,
  Archive,
  Eye,
  ArrowLeft,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Clock,
  Version,
  History,
  X
} from 'lucide-react'
import Link from 'next/link'
import { 
  SubscriptionPlanTemplate, 
  SubscriptionPlanVersion, 
  PlanAnalytics,
  PlanCreationData 
} from '@/lib/backoffice-types'
import { PlanEditForm } from '@/components/backoffice/plan-edit-form'
import { PlanCreationForm } from '@/components/backoffice/plan-creation-form'
import { PlanVersionHistory } from '@/components/backoffice/plan-version-history'

export default function BackofficePlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlanTemplate[]>([])
  const [analytics, setAnalytics] = useState<PlanAnalytics[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanTemplate | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Simula caricamento dati
    setTimeout(() => {
      const mockPlans: SubscriptionPlanTemplate[] = [
        {
          id: '1',
          name: 'base',
          display_name: 'Base',
          description: 'Piano ideale per piccole società sportive',
          base_price: 80,
          teams_limit: 2,
          players_limit: 50,
          features: ['2 squadre', '50 giocatori', 'Supporto email', 'Dashboard base'],
          is_active: true,
          custom_pricing_enabled: false,
          versions: [
            {
              id: 'v1',
              plan_id: '1',
              version: '1.0',
              display_name: 'Base v1.0',
              description: 'Versione iniziale del piano Base',
              base_price: 80,
              teams_limit: 2,
              players_limit: 50,
              features: ['2 squadre', '50 giocatori', 'Supporto email', 'Dashboard base'],
              is_active: true,
              custom_pricing_enabled: false,
              created_at: '2024-01-01',
              created_by: 'admin',
              is_current: true
            },
            {
              id: 'v2',
              plan_id: '1',
              version: '1.1',
              display_name: 'Base v1.1',
              description: 'Versione aggiornata con nuove funzionalità',
              base_price: 85,
              teams_limit: 2,
              players_limit: 55,
              features: ['2 squadre', '55 giocatori', 'Supporto email', 'Dashboard base', 'Report base'],
              is_active: true,
              custom_pricing_enabled: false,
              created_at: '2024-06-01',
              created_by: 'admin',
              is_current: false
            }
          ],
          current_version: '1.0',
          total_clients: 12,
          monthly_revenue: 960,
          created_at: '2024-01-01',
          updated_at: '2024-06-01'
        },
        {
          id: '2',
          name: 'plus',
          display_name: 'Plus',
          description: 'Piano completo per società sportive di medie dimensioni',
          base_price: 200,
          teams_limit: 5,
          players_limit: 100,
          features: ['5 squadre', '100 giocatori', 'Supporto prioritario', 'Dashboard avanzata', 'Report personalizzati'],
          is_active: true,
          custom_pricing_enabled: false,
          versions: [
            {
              id: 'v3',
              plan_id: '2',
              version: '1.0',
              display_name: 'Plus v1.0',
              description: 'Versione iniziale del piano Plus',
              base_price: 200,
              teams_limit: 5,
              players_limit: 100,
              features: ['5 squadre', '100 giocatori', 'Supporto prioritario', 'Dashboard avanzata', 'Report personalizzati'],
              is_active: true,
              custom_pricing_enabled: false,
              created_at: '2024-01-01',
              created_by: 'admin',
              is_current: true
            }
          ],
          current_version: '1.0',
          total_clients: 8,
          monthly_revenue: 1600,
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        },
        {
          id: '3',
          name: 'custom',
          display_name: 'Custom',
          description: 'Piano personalizzato per grandi società e federazioni',
          base_price: 0,
          teams_limit: 0,
          players_limit: 0,
          features: ['Limiti personalizzabili', 'Prezzo su misura', 'Supporto dedicato', 'Dashboard enterprise', 'API access'],
          is_active: true,
          custom_pricing_enabled: true,
          versions: [
            {
              id: 'v4',
              plan_id: '3',
              version: '1.0',
              display_name: 'Custom v1.0',
              description: 'Versione iniziale del piano Custom',
              base_price: 0,
              teams_limit: 0,
              players_limit: 0,
              features: ['Limiti personalizzabili', 'Prezzo su misura', 'Supporto dedicato', 'Dashboard enterprise', 'API access'],
              is_active: true,
              custom_pricing_enabled: true,
              created_at: '2024-01-01',
              created_by: 'admin',
              is_current: true
            }
          ],
          current_version: '1.0',
          total_clients: 4,
          monthly_revenue: 1400,
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        }
      ]

      const mockAnalytics: PlanAnalytics[] = [
        {
          plan_id: '1',
          plan_name: 'Base',
          total_clients: 12,
          active_clients: 11,
          monthly_revenue: 960,
          churn_rate: 8.3,
          growth_rate: 15.4,
          average_contract_value: 80,
          client_distribution: { new: 2, active: 11, churned: 1 },
          revenue_trend: [
            { month: 'Gen', revenue: 800, clients: 10 },
            { month: 'Feb', revenue: 840, clients: 10 },
            { month: 'Mar', revenue: 880, clients: 11 },
            { month: 'Apr', revenue: 920, clients: 11 },
            { month: 'Mag', revenue: 960, clients: 12 },
            { month: 'Giu', revenue: 960, clients: 12 }
          ]
        },
        {
          plan_id: '2',
          plan_name: 'Plus',
          total_clients: 8,
          active_clients: 8,
          monthly_revenue: 1600,
          churn_rate: 0,
          growth_rate: 25.0,
          average_contract_value: 200,
          client_distribution: { new: 2, active: 8, churned: 0 },
          revenue_trend: [
            { month: 'Gen', revenue: 1200, clients: 6 },
            { month: 'Feb', revenue: 1400, clients: 7 },
            { month: 'Mar', revenue: 1600, clients: 8 },
            { month: 'Apr', revenue: 1600, clients: 8 },
            { month: 'Mag', revenue: 1600, clients: 8 },
            { month: 'Giu', revenue: 1600, clients: 8 }
          ]
        },
        {
          plan_id: '3',
          plan_name: 'Custom',
          total_clients: 4,
          active_clients: 4,
          monthly_revenue: 1400,
          churn_rate: 0,
          growth_rate: 33.3,
          average_contract_value: 350,
          client_distribution: { new: 1, active: 4, churned: 0 },
          revenue_trend: [
            { month: 'Gen', revenue: 1050, clients: 3 },
            { month: 'Feb', revenue: 1400, clients: 4 },
            { month: 'Mar', revenue: 1400, clients: 4 },
            { month: 'Apr', revenue: 1400, clients: 4 },
            { month: 'Mag', revenue: 1400, clients: 4 },
            { month: 'Giu', revenue: 1400, clients: 4 }
          ]
        }
      ]
      
      setPlans(mockPlans)
      setAnalytics(mockAnalytics)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleCreatePlan = (planData: PlanCreationData) => {
    // Simula creazione piano
    const newPlan: SubscriptionPlanTemplate = {
      id: Date.now().toString(),
      ...planData,
      versions: [{
        id: `v${Date.now()}`,
        plan_id: Date.now().toString(),
        version: '1.0',
        display_name: `${planData.display_name} v1.0`,
        description: planData.description,
        base_price: planData.base_price,
        teams_limit: planData.teams_limit,
        players_limit: planData.players_limit,
        features: planData.features,
        is_active: planData.is_active,
        custom_pricing_enabled: planData.custom_pricing_enabled,
        created_at: new Date().toISOString(),
        created_by: 'admin',
        is_current: true
      }],
      current_version: '1.0',
      total_clients: 0,
      monthly_revenue: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    setPlans(prev => [...prev, newPlan])
    setShowCreateModal(false)
    alert(`Piano ${planData.display_name} creato con successo!`)
  }

  const handleEditPlan = async (planId: string, planData: Partial<SubscriptionPlanTemplate>) => {
    setIsSubmitting(true)
    
    // Simula aggiornamento piano
    setTimeout(() => {
      setPlans(prev => prev.map(plan => 
        plan.id === planId 
          ? { ...plan, ...planData, updated_at: new Date().toISOString() }
          : plan
      ))
      
      setShowEditModal(false)
      setSelectedPlan(null)
      setIsSubmitting(false)
      
      // Mostra conferma
      alert('Piano aggiornato con successo!')
    }, 1000)
  }

  const createNewVersion = (planId: string) => {
    const plan = plans.find(p => p.id === planId)
    if (!plan) return

    const currentVersion = plan.versions.find(v => v.is_current)
    if (!currentVersion) return

    const newVersion: SubscriptionPlanVersion = {
      ...currentVersion,
      id: `v${Date.now()}`,
      version: `${parseFloat(currentVersion.version) + 0.1}`.slice(0, 3),
      display_name: `${plan.display_name} v${(parseFloat(currentVersion.version) + 0.1).toFixed(1)}`,
      created_at: new Date().toISOString(),
      is_current: true
    }

    // Aggiorna versioni esistenti
    const updatedVersions = plan.versions.map(v => ({ ...v, is_current: false }))
    updatedVersions.push(newVersion)

    setPlans(prev => prev.map(p => 
      p.id === planId 
        ? { 
            ...p, 
            versions: updatedVersions,
            current_version: newVersion.version,
            updated_at: new Date().toISOString()
          }
        : p
    ))

    alert(`Nuova versione ${newVersion.version} creata per il piano ${plan.display_name}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/backoffice/dashboard"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestione Piani Abbonamento</h1>
              <p className="text-gray-600">Configura e gestisci i piani di abbonamento della piattaforma</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nuovo Piano
            </button>
            <button className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Statistiche Rapide */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Piani Totali</p>
                <p className="text-3xl font-bold text-gray-900">{plans.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Piani Attivi</p>
                <p className="text-3xl font-bold text-gray-900">
                  {plans.filter(p => p.is_active).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clienti Totali</p>
                <p className="text-3xl font-bold text-gray-900">
                  {plans.reduce((sum, p) => sum + p.total_clients, 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ricavi Mensili</p>
                <p className="text-3xl font-bold text-gray-900">
                  €{plans.reduce((sum, p) => sum + p.monthly_revenue, 0).toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Grafici Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuzione Clienti per Piano */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuzione Clienti per Piano</h3>
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <PieChart className="h-12 w-12 mx-auto mb-2" />
                <p>Grafico distribuzione clienti</p>
                <p className="text-sm">Integrazione con Recharts</p>
              </div>
            </div>
          </div>

          {/* Trend Ricavi per Piano */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Ricavi per Piano</h3>
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Grafico trend ricavi mensili</p>
                <p className="text-sm">Integrazione con Recharts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista Piani */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Piani Abbonamento ({plans.length})
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white">
                  {/* Header Piano */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{plan.display_name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">v{plan.current_version}</span>
                          {plan.is_active ? (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Attivo</span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Inattivo</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Descrizione */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.description}</p>

                  {/* Prezzo */}
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      €{plan.base_price}
                      <span className="text-sm font-normal text-gray-500">/anno</span>
                    </div>
                  </div>

                  {/* Limiti */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{plan.teams_limit}</div>
                      <div className="text-xs text-gray-500">Squadre</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{plan.players_limit}</div>
                      <div className="text-xs text-gray-500">Giocatori</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Funzionalità:</h5>
                    <div className="space-y-1">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                      {plan.features.length > 3 && (
                        <div className="text-xs text-gray-500">+{plan.features.length - 3} altre</div>
                      )}
                    </div>
                  </div>

                  {/* Statistiche */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500">Clienti</div>
                        <div className="font-semibold text-gray-900">{plan.total_clients}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Ricavi/mese</div>
                        <div className="font-semibold text-gray-900">€{plan.monthly_revenue}</div>
                      </div>
                    </div>
                  </div>

                  {/* Informazioni Versione */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-700 font-medium">Versione Corrente</span>
                      <span className="text-blue-800 font-semibold">v{plan.current_version}</span>
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      {plan.versions.length} versione{plan.versions.length !== 1 ? 'i' : ''} totali
                    </div>
                  </div>

                  {/* Azioni - Layout Migliorato */}
                  <div className="space-y-3">
                    {/* Pulsante Modifica Principale */}
                    <button 
                      onClick={() => {
                        setSelectedPlan(plan)
                        setShowEditModal(true)
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Modifica Piano
                    </button>
                    
                    {/* Azioni Secondarie */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => createNewVersion(plan.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        title="Crea nuova versione"
                      >
                        <Copy className="h-4 w-4" />
                        Nuova Versione
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedPlan(plan)
                          setShowVersionHistory(true)
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        title="Storico versioni"
                      >
                        <History className="h-4 w-4" />
                        Storico
                      </button>
                    </div>
                  </div>

                  {/* Avviso Versioni */}
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-yellow-800">
                      <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                      <span className="leading-tight">Modifiche solo per nuovi contratti</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Creazione Piano */}
      <PlanCreationForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePlan}
        isLoading={isSubmitting}
      />

      {/* Form Modifica Piano */}
      <PlanEditForm
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedPlan(null)
        }}
        onSubmit={handleEditPlan}
        plan={selectedPlan}
        isLoading={isSubmitting}
      />

      {/* Storico Versioni */}
      <PlanVersionHistory
        isOpen={showVersionHistory}
        onClose={() => {
          setShowVersionHistory(false)
          setSelectedPlan(null)
        }}
        plan={selectedPlan}
        onCreateNewVersion={createNewVersion}
      />
    </div>
  )
}
