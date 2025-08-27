'use client'

import { useState, useEffect } from 'react'
import { 
  Package, 
  Edit, 
  X, 
  Save, 
  Loader2, 
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SubscriptionPlanTemplate, SubscriptionPlanVersion } from '@/lib/backoffice-types'

interface PlanEditFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (planId: string, planData: Partial<SubscriptionPlanTemplate>) => void
  plan: SubscriptionPlanTemplate | null
  isLoading?: boolean
}

export function PlanEditForm({ isOpen, onClose, onSubmit, plan, isLoading = false }: PlanEditFormProps) {
  const [formData, setFormData] = useState<Partial<SubscriptionPlanTemplate>>({})
  const [features, setFeatures] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (plan) {
      setFormData({
        display_name: plan.display_name,
        description: plan.description,
        base_price: plan.base_price,
        teams_limit: plan.teams_limit,
        players_limit: plan.players_limit,
        is_active: plan.is_active,
        custom_pricing_enabled: plan.custom_pricing_enabled
      })
      setFeatures([...plan.features])
      setHasChanges(false)
    }
  }, [plan])

  const handleInputChange = (field: keyof SubscriptionPlanTemplate, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
    setHasChanges(true)
  }

  const addFeature = () => {
    setFeatures([...features, ''])
    setHasChanges(true)
  }

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index)
    setFeatures(newFeatures)
    setHasChanges(true)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.display_name) newErrors.display_name = 'Nome piano richiesto'
    if (!formData.description) newErrors.description = 'Descrizione richiesta'
    if (formData.base_price < 0) newErrors.base_price = 'Prezzo deve essere positivo'
    if (formData.teams_limit < 0) newErrors.teams_limit = 'Limite squadre deve essere positivo'
    if (formData.players_limit < 0) newErrors.players_limit = 'Limite giocatori deve essere positivo'
    if (features.some(f => !f.trim())) newErrors.features = 'Tutte le funzionalità devono essere compilate'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !plan) return

    const finalData: Partial<SubscriptionPlanTemplate> = {
      ...formData,
      features: features.filter(f => f.trim())
    }

    onSubmit(plan.id, finalData)
  }

  if (!isOpen || !plan) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Edit className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Modifica Piano Abbonamento</h2>
                <p className="text-gray-600">Aggiorna il piano {plan.display_name}</p>
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
          {/* Informazioni Base */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Informazioni Base
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="display_name" className="text-sm font-medium text-gray-700">
                  Nome Piano *
                </Label>
                <Input
                  id="display_name"
                  value={formData.display_name || ''}
                  onChange={(e) => handleInputChange('display_name', e.target.value)}
                  placeholder="es. Base, Plus, Custom"
                  className={errors.display_name ? 'border-red-300' : ''}
                />
                {errors.display_name && (
                  <p className="text-red-600 text-xs mt-1">{errors.display_name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="base_price" className="text-sm font-medium text-gray-700">
                  Prezzo Base (€/anno) *
                </Label>
                <Input
                  id="base_price"
                  type="number"
                  min="0"
                  value={formData.base_price || 0}
                  onChange={(e) => handleInputChange('base_price', parseFloat(e.target.value) || 0)}
                  className={errors.base_price ? 'border-red-300' : ''}
                />
                {errors.base_price && (
                  <p className="text-red-600 text-xs mt-1">{errors.base_price}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Descrizione *
              </Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descrizione del piano e delle sue caratteristiche..."
                rows={3}
                className={errors.description ? 'border-red-300' : ''}
              />
              {errors.description && (
                <p className="text-red-600 text-xs mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Limiti e Configurazione */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Limiti e Configurazione
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teams_limit" className="text-sm font-medium text-gray-700">
                  Limite Squadre *
                </Label>
                <Input
                  id="teams_limit"
                  type="number"
                  min="0"
                  value={formData.teams_limit || 0}
                  onChange={(e) => handleInputChange('teams_limit', parseInt(e.target.value) || 0)}
                  className={errors.teams_limit ? 'border-red-300' : ''}
                />
                {errors.teams_limit && (
                  <p className="text-red-600 text-xs mt-1">{errors.teams_limit}</p>
                )}
              </div>

              <div>
                <Label htmlFor="players_limit" className="text-sm font-medium text-gray-700">
                  Limite Giocatori *
                </Label>
                <Input
                  id="players_limit"
                  type="number"
                  min="0"
                  value={formData.players_limit || 0}
                  onChange={(e) => handleInputChange('players_limit', parseInt(e.target.value) || 0)}
                  className={errors.players_limit ? 'border-red-300' : ''}
                />
                {errors.players_limit && (
                  <p className="text-red-600 text-xs mt-1">{errors.players_limit}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active || false}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Piano Attivo
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="custom_pricing_enabled"
                  checked={formData.custom_pricing_enabled || false}
                  onChange={(e) => handleInputChange('custom_pricing_enabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label htmlFor="custom_pricing_enabled" className="text-sm font-medium text-gray-700">
                  Prezzi Personalizzabili
                </Label>
              </div>
            </div>
          </div>

          {/* Funzionalità */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                Funzionalità
              </h3>
              <Button
                type="button"
                onClick={addFeature}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Aggiungi
              </Button>
            </div>
            
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Funzionalità ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => removeFeature(index)}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {features.length === 0 && (
                <p className="text-gray-500 text-sm italic">Nessuna funzionalità definita</p>
              )}
            </div>
            {errors.features && (
              <p className="text-red-600 text-xs">{errors.features}</p>
            )}
          </div>

          {/* Informazioni Versione */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Informazioni Versione
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-600">Versione Corrente:</p>
                <p className="font-semibold text-blue-800">{plan.current_version}</p>
              </div>
              <div>
                <p className="text-blue-600">Ultimo Aggiornamento:</p>
                <p className="font-semibold text-blue-800">
                  {new Date(plan.updated_at).toLocaleDateString('it-IT')}
                </p>
              </div>
              <div>
                <p className="text-blue-600">Clienti Attivi:</p>
                <p className="font-semibold text-blue-800">{plan.total_clients}</p>
              </div>
              <div>
                <p className="text-blue-600">Ricavi Mensili:</p>
                <p className="font-semibold text-blue-800">€{plan.monthly_revenue}</p>
              </div>
            </div>
          </div>

          {/* Avviso Importante */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Modifiche ai Piani Esistenti</h4>
                <p className="text-yellow-700 text-sm mb-2">
                  <strong>Importante:</strong> Le modifiche ai piani esistenti NON influenzano i contratti già attivi.
                </p>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• I clienti esistenti mantengono il piano originale</li>
                  <li>• Solo i nuovi contratti utilizzeranno la versione aggiornata</li>
                  <li>• Il sistema creerà automaticamente una nuova versione</li>
                  <li>• Lo storico delle versioni sarà sempre disponibile</li>
                </ul>
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Aggiornamento in corso...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Aggiorna Piano
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
