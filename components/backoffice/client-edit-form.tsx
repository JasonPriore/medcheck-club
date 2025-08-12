'use client'

import { useState, useEffect } from 'react'
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Package, 
  Users, 
  DollarSign, 
  Calendar,
  X,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Client, ClientOnboarding, SubscriptionPlan } from '@/lib/backoffice-types'

interface ClientEditFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (clientId: string, clientData: Partial<Client>) => void
  client: Client | null
  isLoading?: boolean
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'base',
    name: 'base',
    display_name: 'Base',
    description: 'Piano ideale per piccole società sportive',
    base_price: 80,
    teams_limit: 2,
    players_limit: 50,
    features: ['2 squadre', '50 giocatori', 'Supporto email', 'Dashboard base'],
    is_active: true,
    custom_pricing_enabled: false
  },
  {
    id: 'plus',
    name: 'plus',
    display_name: 'Plus',
    description: 'Piano completo per società sportive di medie dimensioni',
    base_price: 200,
    teams_limit: 5,
    players_limit: 100,
    features: ['5 squadre', '100 giocatori', 'Supporto prioritario', 'Dashboard avanzata', 'Report personalizzati'],
    is_active: true,
    custom_pricing_enabled: false
  },
  {
    id: 'custom',
    name: 'custom',
    display_name: 'Custom',
    description: 'Piano personalizzato per grandi società e federazioni',
    base_price: 0,
    teams_limit: 0,
    players_limit: 0,
    features: ['Limiti personalizzabili', 'Prezzo su misura', 'Supporto dedicato', 'Dashboard enterprise', 'API access'],
    is_active: true,
    custom_pricing_enabled: true
  }
]

export function ClientEditForm({ isOpen, onClose, onSubmit, client, isLoading = false }: ClientEditFormProps) {
  const [formData, setFormData] = useState<Partial<Client>>({})
  const [customLimits, setCustomLimits] = useState({
    teams: 10,
    players: 200,
    price: 500,
    billing_cycle: 'annual' as 'monthly' | 'annual'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (client) {
      setFormData({
        email: client.email,
        organization_name: client.organization_name,
        subscription_plan: client.subscription_plan,
        subscription_price: client.subscription_price,
        contact_person: client.contact_person || '',
        phone: client.phone || '',
        address: client.address || '',
        vat_number: client.vat_number || '',
        notes: client.notes || '',
        status: client.status
      })

      if (client.custom_limits) {
        setCustomLimits({
          teams: client.custom_limits.teams,
          players: client.custom_limits.players,
          price: client.custom_limits.price,
          billing_cycle: 'annual' // Default, potrebbe essere estratto dalle note
        })
      }
      
      setHasChanges(false)
    }
  }, [client])

  const handleInputChange = (field: keyof Client, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleCustomLimitsChange = (field: keyof typeof customLimits, value: string | number) => {
    setCustomLimits(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handlePlanChange = (plan: string) => {
    setFormData(prev => ({ 
      ...prev, 
      subscription_plan: plan as 'base' | 'plus' | 'custom',
      subscription_price: plan === 'base' ? 80 : plan === 'plus' ? 200 : customLimits.price
    }))
    setHasChanges(true)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) newErrors.email = 'Email richiesta'
    if (!formData.organization_name) newErrors.organization_name = 'Nome società richiesto'
    if (!formData.contact_person) newErrors.contact_person = 'Nome contatto richiesto'
    
    if (formData.subscription_plan === 'custom') {
      if (customLimits.teams < 1) newErrors.teams = 'Numero squadre deve essere almeno 1'
      if (customLimits.players < 1) newErrors.players = 'Numero giocatori deve essere almeno 1'
      if (customLimits.price < 1) newErrors.price = 'Prezzo deve essere maggiore di 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !client) return

    const finalData: Partial<Client> = {
      ...formData,
      subscription_price: formData.subscription_plan === 'custom' ? customLimits.price : formData.subscription_price,
      custom_limits: formData.subscription_plan === 'custom' ? {
        teams: customLimits.teams,
        players: customLimits.players,
        price: customLimits.price,
        notes: `Piano personalizzato: ${customLimits.teams} squadre, ${customLimits.players} giocatori, ${customLimits.billing_cycle === 'annual' ? 'fatturazione annuale' : 'fatturazione mensile'}`
      } : undefined
    }

    onSubmit(client.id, finalData)
  }

  const getSelectedPlan = SUBSCRIPTION_PLANS.find(p => p.name === formData.subscription_plan)

  if (!isOpen || !client) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Modifica Cliente</h2>
                <p className="text-gray-600">Aggiorna le informazioni di {client.organization_name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informazioni Società */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Informazioni Società
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organization_name" className="text-sm font-medium text-gray-700">
                  Nome Società *
                </Label>
                <Input
                  id="organization_name"
                  value={formData.organization_name || ''}
                  onChange={(e) => handleInputChange('organization_name', e.target.value)}
                  placeholder="es. Calcio Trento FC"
                  className={errors.organization_name ? 'border-red-300' : ''}
                />
                {errors.organization_name && (
                  <p className="text-red-600 text-xs mt-1">{errors.organization_name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="vat_number" className="text-sm font-medium text-gray-700">
                  Partita IVA
                </Label>
                <Input
                  id="vat_number"
                  value={formData.vat_number || ''}
                  onChange={(e) => handleInputChange('vat_number', e.target.value)}
                  placeholder="IT12345678901"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                Indirizzo
              </Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Via del Calcio, 1, Trento"
              />
            </div>
          </div>

          {/* Informazioni Contatto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Informazioni Contatto
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_person" className="text-sm font-medium text-gray-700">
                  Nome e Cognome Contatto *
                </Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person || ''}
                  onChange={(e) => handleInputChange('contact_person', e.target.value)}
                  placeholder="es. Marco Rossi"
                  className={errors.contact_person ? 'border-red-300' : ''}
                />
                {errors.contact_person && (
                  <p className="text-red-600 text-xs mt-1">{errors.contact_person}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Telefono
                </Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+39 0461 123456"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="info@calciotrento.it"
                className={errors.email ? 'border-red-300' : ''}
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Status Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Status Cliente
            </h3>
            
            <div>
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                Status Account
              </Label>
              <select
                id="status"
                value={formData.status || 'active'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Attivo</option>
                <option value="suspended">Sospeso</option>
                <option value="cancelled">Cancellato</option>
                <option value="pending">In Attesa</option>
              </select>
            </div>
          </div>

          {/* Selezione Piano Abbonamento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Piano Abbonamento
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    formData.subscription_plan === plan.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePlanChange(plan.name)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{plan.display_name}</h4>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.subscription_plan === plan.name
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.subscription_plan === plan.name && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">
                      €{plan.base_price}
                      <span className="text-sm font-normal text-gray-500">/anno</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configurazione Piano Custom */}
          {formData.subscription_plan === 'custom' && (
            <div className="space-y-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <h4 className="text-lg font-semibold text-orange-800 flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-600" />
                Configurazione Piano Personalizzato
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="custom_teams" className="text-sm font-medium text-orange-800">
                    Numero Squadre *
                  </Label>
                  <Input
                    id="custom_teams"
                    type="number"
                    min="1"
                    value={customLimits.teams}
                    onChange={(e) => handleCustomLimitsChange('teams', parseInt(e.target.value))}
                    className={errors.teams ? 'border-red-300' : 'border-orange-300'}
                  />
                  {errors.teams && (
                    <p className="text-red-600 text-xs mt-1">{errors.teams}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="custom_players" className="text-sm font-medium text-orange-800">
                    Numero Giocatori *
                  </Label>
                  <Input
                    id="custom_players"
                    type="number"
                    min="1"
                    value={customLimits.players}
                    onChange={(e) => handleCustomLimitsChange('players', parseInt(e.target.value))}
                    className={errors.players ? 'border-red-300' : 'border-orange-300'}
                  />
                  {errors.players && (
                    <p className="text-red-600 text-xs mt-1">{errors.players}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="custom_price" className="text-sm font-medium text-orange-800">
                    Prezzo *
                  </Label>
                  <Input
                    id="custom_price"
                    type="number"
                    min="1"
                    value={customLimits.price}
                    onChange={(e) => handleCustomLimitsChange('price', parseInt(e.target.value))}
                    className={errors.price ? 'border-red-300' : 'border-orange-300'}
                  />
                  {errors.price && (
                    <p className="text-red-600 text-xs mt-1">{errors.price}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-orange-800">
                    Ciclo di Fatturazione
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => handleCustomLimitsChange('billing_cycle', 'monthly')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        customLimits.billing_cycle === 'monthly'
                          ? 'bg-orange-600 text-white'
                          : 'bg-white text-orange-600 border border-orange-300'
                      }`}
                    >
                      Mensile
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCustomLimitsChange('billing_cycle', 'annual')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        customLimits.billing_cycle === 'annual'
                          ? 'bg-orange-600 text-white'
                          : 'bg-white text-orange-600 border border-orange-300'
                      }`}
                    >
                      Annuale
                    </button>
                  </div>
                </div>

                <div className="flex items-end">
                  <div className="bg-white p-3 rounded-lg border border-orange-300">
                    <div className="text-sm text-orange-600">Prezzo finale:</div>
                    <div className="text-2xl font-bold text-orange-800">
                      €{customLimits.price}
                      <span className="text-sm font-normal text-orange-600">
                        /{customLimits.billing_cycle === 'annual' ? 'anno' : 'mese'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Riepilogo Piano Selezionato */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">Riepilogo Piano Selezionato</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-600">Piano:</p>
                <p className="font-semibold text-blue-800">{getSelectedPlan?.display_name}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Prezzo:</p>
                <p className="font-semibold text-blue-800">
                  €{formData.subscription_price}
                  <span className="text-sm font-normal text-blue-600">
                    /{formData.subscription_plan === 'custom' && customLimits.billing_cycle === 'monthly' ? 'mese' : 'anno'}
                  </span>
                </p>
              </div>
              {formData.subscription_plan === 'custom' && (
                <>
                  <div>
                    <p className="text-sm text-blue-600">Squadre:</p>
                    <p className="font-semibold text-blue-800">{customLimits.teams}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">Giocatori:</p>
                    <p className="font-semibold text-blue-800">{customLimits.players}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Note Aggiuntive */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Note Aggiuntive
            </Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Informazioni aggiuntive sul cliente o sul piano..."
              rows={3}
            />
          </div>

          {/* Informazioni Sistema */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              Informazioni Sistema
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">ID Cliente:</p>
                <p className="font-medium text-gray-800">{client.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Data Creazione:</p>
                <p className="font-medium text-gray-800">
                  {new Date(client.created_at).toLocaleDateString('it-IT')}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Ultimo Accesso:</p>
                <p className="font-medium text-gray-800">
                  {new Date(client.last_login).toLocaleDateString('it-IT')}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Scadenza Abbonamento:</p>
                <p className="font-medium text-gray-800">
                  {new Date(client.subscription_end_date).toLocaleDateString('it-IT')}
                </p>
              </div>
            </div>
          </div>

          {/* Footer con Azioni */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Annulla
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading || !hasChanges}
              className="bg-green-600 hover:bg-green-700 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Aggiornamento in corso...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Aggiorna Cliente
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
