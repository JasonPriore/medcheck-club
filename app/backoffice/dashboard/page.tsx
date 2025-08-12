'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Settings,
  BarChart3,
  UserPlus,
  FileText,
  ArrowLeft,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { Client, PlatformStats, DashboardMetrics, ClientOnboarding } from '@/lib/backoffice-types'
import { ClientOnboardingForm } from '@/components/backoffice/client-onboarding-form'

export default function BackofficeDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    clients: { total: 0, active: 0, new_this_month: 0, churned_this_month: 0 },
    revenue: { total: 0, this_month: 0, this_year: 0, growth_rate: 0 },
    usage: { total_teams: 0, total_players: 0, average_teams_per_client: 0, average_players_per_client: 0 }
  })
  const [recentClients, setRecentClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Simula caricamento dati
    setTimeout(() => {
      setMetrics({
        clients: { total: 24, active: 22, new_this_month: 3, churned_this_month: 1 },
        revenue: { total: 45600, this_month: 4200, this_year: 45600, growth_rate: 12.5 },
        usage: { total_teams: 89, total_players: 1247, average_teams_per_client: 3.7, average_players_per_client: 51.9 }
      })
      
      setRecentClients([
        {
          id: '1',
          email: 'info@calciotrento.it',
          organization_name: 'Calcio Trento FC',
          subscription_plan: 'plus',
          subscription_start_date: '2024-01-01',
          subscription_end_date: '2024-12-31',
          subscription_price: 200,
          status: 'active',
          created_at: '2024-01-15',
          last_login: '2024-01-20'
        },
        {
          id: '2',
          email: 'admin@asdbolzano.it',
          organization_name: 'ASD Bolzano',
          subscription_plan: 'base',
          subscription_start_date: '2024-01-01',
          subscription_end_date: '2024-12-31',
          subscription_price: 80,
          status: 'active',
          created_at: '2024-01-10',
          last_login: '2024-01-18'
        }
      ])
      
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleAddClient = async (clientData: ClientOnboarding) => {
    setIsSubmitting(true)
    
    // Simula creazione cliente
    setTimeout(() => {
      const newClient: Client = {
        id: Date.now().toString(),
        email: clientData.email,
        organization_name: clientData.organization_name,
        subscription_plan: clientData.subscription_plan,
        subscription_start_date: new Date().toISOString().split('T')[0],
        subscription_end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        subscription_price: clientData.subscription_price,
        status: 'active',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        contact_person: clientData.contact_person,
        phone: clientData.phone,
        address: clientData.address,
        vat_number: clientData.vat_number,
        notes: clientData.notes,
        custom_limits: clientData.custom_limits
      }
      
      setRecentClients(prev => [newClient, ...prev.slice(0, 1)])
      setMetrics(prev => ({
        ...prev,
        clients: {
          ...prev.clients,
          total: prev.clients.total + 1,
          new_this_month: prev.clients.new_this_month + 1
        },
        revenue: {
          ...prev.revenue,
          total: prev.revenue.total + clientData.subscription_price,
          this_month: prev.revenue.this_month + clientData.subscription_price
        }
      }))
      
      setShowAddClientModal(false)
      setIsSubmitting(false)
      
      // Mostra conferma
      alert(`Cliente ${clientData.organization_name} creato con successo!`)
    }, 1500)
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
              href="/backoffice"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Amministrativa</h1>
              <p className="text-gray-600">Panoramica completa della piattaforma MedCheck</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAddClientModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nuovo Cliente
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Settings className="h-4 w-4" />
              Impostazioni
            </button>
            <button className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Metriche Principali */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clienti Totali</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.clients.total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+{metrics.clients.new_this_month}</span>
              <span className="text-gray-500 ml-1">questo mese</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ricavi Totali</p>
                <p className="text-3xl font-bold text-gray-900">€{metrics.revenue.total.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+{metrics.revenue.growth_rate}%</span>
              <span className="text-gray-500 ml-1">vs mese scorso</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Squadre Totali</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.usage.total_teams}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">{metrics.usage.average_teams_per_client.toFixed(1)} per cliente</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Giocatori Totali</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.usage.total_players.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">{metrics.usage.average_players_per_client.toFixed(1)} per cliente</span>
            </div>
          </div>
        </div>

        {/* Grafico Ricavi e Clienti Recenti */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grafico Ricavi */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Andamento Ricavi</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Grafico ricavi mensili</p>
                <p className="text-sm">Integrazione con Recharts</p>
              </div>
            </div>
          </div>

          {/* Clienti Recenti */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Clienti Recenti</h3>
              <Link 
                href="/backoffice/clients"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Vedi tutti
              </Link>
            </div>
            <div className="space-y-3">
              {recentClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client.organization_name}</p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      client.subscription_plan === 'plus' ? 'bg-purple-100 text-purple-800' :
                      client.subscription_plan === 'custom' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {client.subscription_plan.toUpperCase()}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Azioni Rapide */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Azioni Rapide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setShowAddClientModal(true)}
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <UserPlus className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-blue-900">Nuovo Cliente</p>
                <p className="text-sm text-blue-700">Onboarding e configurazione</p>
              </div>
            </button>
            
            <Link 
              href="/backoffice/insights"
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
            >
              <FileText className="h-6 w-6 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-green-900">Analytics</p>
                <p className="text-sm text-green-700">Report ricavi e metriche</p>
              </div>
            </Link>
            
            <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <Settings className="h-6 w-6 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-purple-900">Gestisci Piani</p>
                <p className="text-sm text-purple-700">Configura abbonamenti</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Form Aggiungi Cliente */}
      <ClientOnboardingForm
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        onSubmit={handleAddClient}
        isLoading={isSubmitting}
      />
    </div>
  )
}
