'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Settings, 
  BarChart3, 
  LogOut,
  Package,
  Tag
} from 'lucide-react'
import Link from 'next/link'
import { 
  PlatformStats, 
  Client, 
  ClientOnboarding 
} from '@/lib/backoffice-types'
import { ClientOnboardingForm } from '@/components/backoffice/client-onboarding-form'

export default function BackofficeDashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [topClients, setTopClients] = useState<Client[]>([])
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Simula caricamento dati
    setTimeout(() => {
      setStats({
        total_clients: 24,
        total_revenue_gross: 47520,
        total_revenue_net: 38016,
        total_teams: 156,
        total_players: 2847,
        active_subscriptions: 24,
        monthly_recurring_revenue: 3960,
        average_revenue_per_client: 1980
      })

      setTopClients([
        {
          id: '1',
          email: 'info@calciomilano.it',
          organization_name: 'ASD Calcio Milano',
          subscription_plan: 'plus',
          subscription_version: '1.0',
          subscription_start_date: '2024-01-01',
          subscription_end_date: '2024-12-31',
          subscription_price: 200,
          status: 'active',
          created_at: '2024-01-15',
          last_login: '2024-01-20',
          contact_person: 'Marco Rossi'
        },
        {
          id: '2',
          email: 'direzione@polisportivaroma.it',
          organization_name: 'Polisportiva Roma',
          subscription_plan: 'custom',
          subscription_version: '1.0',
          subscription_start_date: '2024-02-01',
          subscription_end_date: '2025-01-31',
          subscription_price: 350,
          status: 'active',
          created_at: '2024-02-20',
          last_login: '2024-02-25',
          contact_person: 'Giulia Bianchi'
        },
        {
          id: '3',
          email: 'segreteria@centrosportivonapoli.it',
          organization_name: 'Centro Sportivo Napoli',
          subscription_plan: 'base',
          subscription_version: '1.1',
          subscription_start_date: '2024-03-01',
          subscription_end_date: '2025-02-28',
          subscription_price: 85,
          status: 'active',
          created_at: '2024-03-10',
          last_login: '2024-03-15',
          contact_person: 'Antonio Verdi'
        },
        {
          id: '4',
          email: 'presidente@fedsporttorino.it',
          organization_name: 'Federazione Sportiva Torino',
          subscription_plan: 'custom',
          subscription_version: '1.0',
          subscription_start_date: '2024-01-01',
          subscription_end_date: '2024-12-31',
          subscription_price: 450,
          status: 'active',
          created_at: '2024-01-05',
          last_login: '2024-01-10',
          contact_person: 'Elena Neri'
        },
        {
          id: '5',
          email: 'direttore@clubatleticofirenze.it',
          organization_name: 'Club Atletico Firenze',
          subscription_plan: 'plus',
          subscription_version: '1.0',
          subscription_start_date: '2024-02-01',
          subscription_end_date: '2025-01-31',
          subscription_price: 200,
          status: 'active',
          created_at: '2024-02-28',
          last_login: '2024-03-05',
          contact_person: 'Roberto Gialli'
        }
      ])
    }, 1000)
  }, [])

  const handleAddClient = (clientData: ClientOnboarding) => {
    setIsSubmitting(true)
    
    // Simula creazione cliente
    setTimeout(() => {
      const newClient: Client = {
        id: Date.now().toString(),
        email: clientData.email,
        organization_name: clientData.organization_name,
        subscription_plan: clientData.subscription_plan,
        subscription_version: '1.0', // Default version for new clients
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
      
      setTopClients(prev => [newClient, ...prev])
      
      // Aggiorna statistiche
      if (stats) {
        setStats(prev => prev ? {
          ...prev,
          total_clients: prev.total_clients + 1,
          active_subscriptions: prev.active_subscriptions + 1
        } : null)
      }
      
      setShowAddClientModal(false)
      setIsSubmitting(false)
      alert(`Cliente ${clientData.organization_name} aggiunto con successo!`)
    }, 1000)
  }

  const getPlanDisplayName = (plan: string) => {
    const planNames: Record<string, string> = {
      'base': 'Base',
      'plus': 'Plus',
      'custom': 'Custom'
    }
    return planNames[plan] || plan
  }

  const getPlanColor = (plan: string) => {
    const planColors: Record<string, string> = {
      'base': 'bg-blue-100 text-blue-800',
      'plus': 'bg-green-100 text-green-800',
      'custom': 'bg-purple-100 text-purple-800'
    }
    return planColors[plan] || 'bg-gray-100 text-gray-800'
  }

  if (!stats) {
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Amministrativa</h1>
            <p className="text-gray-600">Panoramica completa della piattaforma MedCheck-Club</p>
          </div>
          <button className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Statistiche Principali */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clienti Totali</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_clients}</p>
                <p className="text-sm text-green-600">+18.7% vs mese scorso</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Squadre Totali</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_teams}</p>
                <p className="text-sm text-green-600">+12% vs mese scorso</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Giocatori Totali</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_players.toLocaleString()}</p>
                <p className="text-sm text-green-600">+8% vs mese scorso</p>
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
                <p className="text-3xl font-bold text-gray-900">€{stats.monthly_recurring_revenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+18.7% vs mese scorso</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Metriche Aggiuntive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Ricavi Annuali</p>
              <p className="text-2xl font-bold text-gray-900">€{stats.total_revenue_gross.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Proiezione annuale</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Abbonamenti Attivi</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active_subscriptions}</p>
              <p className="text-sm text-gray-500">Su {stats.total_clients} totali</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Ricavo Medio per Cliente</p>
              <p className="text-2xl font-bold text-gray-900">€{stats.average_revenue_per_client}</p>
              <p className="text-sm text-gray-500">Mensile</p>
            </div>
          </div>
        </div>

        {/* Azioni Rapide */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Azioni Rapide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setShowAddClientModal(true)}
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <Plus className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-blue-900">Nuovo Cliente</p>
                <p className="text-sm text-blue-700">Onboarding nuovo cliente</p>
              </div>
            </button>
            
            <Link
              href="/backoffice/insights"
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
            >
              <BarChart3 className="h-6 w-6 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-green-900">Analytics</p>
                <p className="text-sm text-green-700">Report ricavi e metriche</p>
              </div>
            </Link>

            <Link
              href="/backoffice/plans"
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
            >
              <Settings className="h-6 w-6 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-purple-900">Gestisci Piani</p>
                <p className="text-sm text-purple-700">Configura abbonamenti</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Top Clienti */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Clienti per Ricavi</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topClients.map((client, index) => (
                <div key={client.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg text-blue-600 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{client.organization_name}</h4>
                      <p className="text-sm text-gray-600">{client.contact_person} • {client.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Piano e Versione */}
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(client.subscription_plan)}`}>
                        <Package className="h-3 w-3" />
                        {getPlanDisplayName(client.subscription_plan)}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Tag className="h-3 w-3" />
                        v{client.subscription_version} • €{client.subscription_price}/anno
                      </div>
                    </div>
                    
                    {/* Statistiche */}
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Abbonamento {client.subscription_plan.toUpperCase()}
                      </div>
                      <div className="font-semibold text-gray-900">€{(client.subscription_price / 12).toFixed(0)}/mese</div>
                    </div>
                    
                    {/* Status */}
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {client.status === 'active' ? 'Attivo' : 'Inattivo'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Aggiunta Cliente */}
      <ClientOnboardingForm
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        onSubmit={handleAddClient}
        isLoading={isSubmitting}
      />
    </div>
  )
}
