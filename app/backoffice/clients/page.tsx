'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Eye, 
  Trash2,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  ArrowLeft,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { Client, ClientOnboarding } from '@/lib/backoffice-types'
import { ClientOnboardingForm } from '@/components/backoffice/client-onboarding-form'
import { ClientEditForm } from '@/components/backoffice/client-edit-form'

export default function BackofficeClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Simula caricamento dati
    setTimeout(() => {
      const mockClients: Client[] = [
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
          last_login: '2024-01-20',
          contact_person: 'Marco Rossi',
          phone: '+39 0461 123456',
          address: 'Via del Calcio, 1, Trento',
          vat_number: 'IT12345678901'
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
          last_login: '2024-01-18',
          contact_person: 'Giuseppe Bianchi',
          phone: '+39 0471 654321',
          address: 'Piazza Sport, 5, Bolzano',
          vat_number: 'IT98765432109'
        },
        {
          id: '3',
          email: 'info@meranocalcio.it',
          organization_name: 'Merano Calcio',
          subscription_plan: 'custom',
          subscription_start_date: '2024-01-01',
          subscription_end_date: '2024-12-31',
          subscription_price: 350,
          status: 'active',
          created_at: '2024-01-05',
          last_login: '2024-01-15',
          contact_person: 'Luca Verdi',
          phone: '+39 0473 111222',
          address: 'Via dello Stadio, 10, Merano',
          vat_number: 'IT45678912345',
          custom_limits: {
            teams: 12,
            players: 180,
            price: 350,
            notes: 'Piano personalizzato per grande club'
          }
        }
      ]
      
      setClients(mockClients)
      setFilteredClients(mockClients)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = clients

    // Filtro per ricerca
    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro per status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter)
    }

    // Filtro per piano
    if (planFilter !== 'all') {
      filtered = filtered.filter(client => client.subscription_plan === planFilter)
    }

    setFilteredClients(filtered)
  }, [clients, searchTerm, statusFilter, planFilter])

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
      
      setClients(prev => [newClient, ...prev])
      setShowAddModal(false)
      setIsSubmitting(false)
      
      // Mostra conferma
      alert(`Cliente ${clientData.organization_name} creato con successo!`)
    }, 1500)
  }

  const handleEditClient = async (clientId: string, clientData: Partial<Client>) => {
    setIsSubmitting(true)
    
    // Simula aggiornamento cliente
    setTimeout(() => {
      setClients(prev => prev.map(client => 
        client.id === clientId 
          ? { ...client, ...clientData, last_login: new Date().toISOString() }
          : client
      ))
      
      setShowEditModal(false)
      setSelectedClient(null)
      setIsSubmitting(false)
      
      // Mostra conferma
      alert('Cliente aggiornato con successo!')
    }, 1000)
  }

  const handleDeleteClient = async (clientId: string) => {
    if (confirm('Sei sicuro di voler eliminare questo cliente? Questa azione non può essere annullata.')) {
      setClients(prev => prev.filter(client => client.id !== clientId))
      alert('Cliente eliminato con successo!')
    }
  }

  const openEditModal = (client: Client) => {
    setSelectedClient(client)
    setShowEditModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'suspended': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Attivo'
      case 'suspended': return 'Sospeso'
      case 'cancelled': return 'Cancellato'
      case 'pending': return 'In Attesa'
      default: return status
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'plus': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'custom': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getPlanText = (plan: string) => {
    switch (plan) {
      case 'base': return 'Base'
      case 'plus': return 'Plus'
      case 'custom': return 'Custom'
      default: return plan
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Gestione Clienti</h1>
              <p className="text-gray-600">Gestisci tutti i clienti della piattaforma</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nuovo Cliente
            </button>
            <button className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filtri e Ricerca */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca clienti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tutti gli Status</option>
              <option value="active">Attivo</option>
              <option value="suspended">Sospeso</option>
              <option value="cancelled">Cancellato</option>
              <option value="pending">In Attesa</option>
            </select>
            
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tutti i Piani</option>
              <option value="base">Base</option>
              <option value="plus">Plus</option>
              <option value="custom">Custom</option>
            </select>
            
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Filter className="h-4 w-4" />
              Filtri Avanzati
            </button>
          </div>
        </div>

        {/* Statistiche Rapide */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clienti Totali</p>
                <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clienti Attivi</p>
                <p className="text-3xl font-bold text-gray-900">
                  {clients.filter(c => c.status === 'active').length}
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
                <p className="text-sm font-medium text-gray-600">Ricavi Mensili</p>
                <p className="text-3xl font-bold text-gray-900">
                  €{clients.reduce((sum, c) => sum + c.subscription_price, 0).toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nuovi Questo Mese</p>
                <p className="text-3xl font-bold text-gray-900">
                  {clients.filter(c => {
                    const created = new Date(c.created_at)
                    const now = new Date()
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Plus className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabella Clienti */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Lista Clienti ({filteredClients.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piano</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prezzo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scadenza</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ultimo Accesso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{client.organization_name}</div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                          {client.contact_person && (
                            <div className="text-xs text-gray-400">{client.contact_person}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(client.subscription_plan)}`}>
                        {getPlanText(client.subscription_plan)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{client.subscription_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                        {getStatusText(client.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(client.subscription_end_date).toLocaleDateString('it-IT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(client.last_login).toLocaleDateString('it-IT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openEditModal(client)}
                          className="text-green-600 hover:text-green-900"
                          title="Modifica cliente"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClient(client.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Elimina cliente"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form Aggiungi Cliente */}
      <ClientOnboardingForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddClient}
        isLoading={isSubmitting}
      />

      {/* Form Modifica Cliente */}
      <ClientEditForm
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedClient(null)
        }}
        onSubmit={handleEditClient}
        client={selectedClient}
        isLoading={isSubmitting}
      />
    </div>
  )
}
