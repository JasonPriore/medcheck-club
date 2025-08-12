'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Building2, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  ArrowLeft,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { PlatformStats, RevenueData, ClientStats } from '@/lib/backoffice-types'

export default function BackofficeInsightsPage() {
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    total_clients: 0,
    total_revenue_gross: 0,
    total_revenue_net: 0,
    total_teams: 0,
    total_players: 0,
    active_subscriptions: 0,
    monthly_recurring_revenue: 0,
    average_revenue_per_client: 0
  })
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [topClients, setTopClients] = useState<ClientStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simula caricamento dati
    setTimeout(() => {
      setPlatformStats({
        total_clients: 24,
        total_revenue_gross: 45600,
        total_revenue_net: 41040, // 10% tasse
        total_teams: 89,
        total_players: 1247,
        active_subscriptions: 22,
        monthly_recurring_revenue: 4200,
        average_revenue_per_client: 1900
      })
      
      setRevenueData([
        { month: 'Gen 2024', gross_revenue: 4200, net_revenue: 3780, new_clients: 3, churn_rate: 4.2 },
        { month: 'Dic 2023', gross_revenue: 3800, net_revenue: 3420, new_clients: 2, churn_rate: 0 },
        { month: 'Nov 2023', gross_revenue: 3600, net_revenue: 3240, new_clients: 1, churn_rate: 0 },
        { month: 'Ott 2023', gross_revenue: 3400, net_revenue: 3060, new_clients: 2, churn_rate: 4.5 },
        { month: 'Set 2023', gross_revenue: 3200, net_revenue: 2880, new_clients: 1, churn_rate: 0 },
        { month: 'Ago 2023', gross_revenue: 3000, net_revenue: 2700, new_clients: 0, churn_rate: 4.8 }
      ])
      
      setTopClients([
        {
          id: '1',
          organization_name: 'Calcio Trento FC',
          subscription_plan: 'Plus',
          subscription_price: 200,
          teams_count: 8,
          players_count: 120,
          last_activity: '2024-01-20',
          revenue: 200
        },
        {
          id: '2',
          organization_name: 'ASD Bolzano',
          subscription_plan: 'Base',
          subscription_price: 80,
          teams_count: 3,
          players_count: 45,
          last_activity: '2024-01-18',
          revenue: 80
        },
        {
          id: '3',
          organization_name: 'Merano Calcio',
          subscription_plan: 'Custom',
          subscription_price: 350,
          teams_count: 12,
          players_count: 180,
          last_activity: '2024-01-15',
          revenue: 350
        }
      ])
      
      setIsLoading(false)
    }, 1000)
  }, [])

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
              <h1 className="text-2xl font-bold text-gray-900">Insights & Analytics</h1>
              <p className="text-gray-600">Analisi dettagliata della piattaforma e ricavi</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Filter className="h-4 w-4" />
              Filtri
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Download className="h-4 w-4" />
              Esporta Report
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
                <p className="text-sm font-medium text-gray-600">Ricavi Lordi Totali</p>
                <p className="text-3xl font-bold text-gray-900">€{platformStats.total_revenue_gross.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+12.5%</span>
              <span className="text-gray-500 ml-1">vs mese scorso</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ricavi Netto Totali</p>
                <p className="text-3xl font-bold text-gray-900">€{platformStats.total_revenue_net.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Dopo tasse (10%)</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">MRR</p>
                <p className="text-3xl font-bold text-gray-900">€{platformStats.monthly_recurring_revenue.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Monthly Recurring Revenue</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ricavo Medio/Cliente</p>
                <p className="text-3xl font-bold text-gray-900">€{platformStats.average_revenue_per_client.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Per abbonamento</span>
            </div>
          </div>
        </div>

        {/* Grafici e Analisi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Andamento Ricavi */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Andamento Ricavi Mensili</h3>
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Grafico ricavi lordi vs netti</p>
                <p className="text-sm">Integrazione con Recharts</p>
              </div>
            </div>
          </div>

          {/* Distribuzione Clienti per Piano */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuzione Clienti per Piano</h3>
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <PieChart className="h-12 w-12 mx-auto mb-2" />
                <p>Grafico distribuzione piani</p>
                <p className="text-sm">Base, Plus, Custom</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabella Ricavi Mensili */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Dettaglio Ricavi Mensili</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mese</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ricavi Lordi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ricavi Netto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nuovi Clienti</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Churn Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {revenueData.map((data, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€{data.gross_revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€{data.net_revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.new_clients}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.churn_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Clienti per Ricavi */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Clienti per Ricavi</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organizzazione</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piano</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prezzo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Squadre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giocatori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ultima Attività</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{client.organization_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        client.subscription_plan === 'Plus' ? 'bg-purple-100 text-purple-800' :
                        client.subscription_plan === 'Custom' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {client.subscription_plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€{client.subscription_price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.teams_count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.players_count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(client.last_activity).toLocaleDateString('it-IT')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
