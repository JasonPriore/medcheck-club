'use client'

import { useState } from 'react'
import { 
  Package, 
  Plus, 
  X, 
  Save, 
  Loader2, 
  AlertTriangle,
  CheckCircle,
  Trash2,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PlanCreationData } from '@/lib/backoffice-types'

interface PlanCreationFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (planData: PlanCreationData) => void
  isLoading?: boolean
}

export function PlanCreationForm({ isOpen, onClose, onSubmit, isLoading = false }: PlanCreationFormProps) {
  const [formData, setFormData] = useState<PlanCreationData>({
    name: '',
    display_name: '',
    description: '',
    base_price: 0,
    teams_limit: 0,
    players_limit: 0,
    features: [''],
    is_active: true,
    custom_pricing_enabled: false,
    notes: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof PlanCreationData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData(prev => ({ ...prev, features: newFeatures }))
  }

  const addFeature = () => {
    setFormData(prev => ({ 
      ...prev, 
      features: [...prev.features, ''] 
    }))
  }

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, features: newFeatures }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Nome tecnico richiesto'
    if (!formData.display_name.trim()) newErrors.display_name = 'Nome visualizzato richiesto'
    if (!formData.description.trim()) newErrors.description = 'Descrizione richiesta'
    if (formData.base_price < 0) newErrors.base_price = 'Prezzo deve essere positivo'
    if (formData.teams_limit < 0) newErrors.teams_limit = 'Limite squadre deve essere positivo'
    if (formData.players_limit < 0) newErrors.players_limit = 'Limite giocatori deve essere positivo'
    if (formData.features.some(f => !f.trim())) newErrors.features = 'Tutte le funzionalità devono essere compilate'

    // Validazione nome tecnico (solo lettere minuscole, numeri e trattini)
    if (formData.name && !/^[a-z0-9-]+$/.test(formData.name)) {
      newErrors.name = 'Nome tecnico può contenere solo lettere minuscole, numeri e trattini'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const finalData: PlanCreationData = {
      ...formData,
      name: formData.name.trim(),
      display_name: formData.display_name.trim(),
      description: formData.description.trim(),
      features: formData.features.filter(f => f.trim())
    }

    onSubmit(finalData)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      display_name: '',
      description: '',
      base_price: 0,
      teams_limit: 0,
      players_limit: 0,
      features: [''],
      is_active: true,
      custom_pricing_enabled: false,
      notes: ''
    })
    setErrors({})
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Plus className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Crea Nuovo Piano Abbonamento</h2>
                <p className="text-gray-600">Definisci un nuovo piano per i clienti</p>
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
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nome Tecnico *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="es. basic, premium, enterprise"
                  className={errors.name ? 'border-red-300' : ''}
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Solo lettere minuscole, numeri e trattini. Usato internamente.
                </p>
              </div>

              <div>
                <Label htmlFor="display_name" className="text-sm font-medium text-gray-700">
                  Nome Visualizzato *
                </Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => handleInputChange('display_name', e.target.value)}
                  placeholder="es. Base, Plus, Enterprise"
                  className={errors.display_name ? 'border-red-300' : ''}
                />
                {errors.display_name && (
                  <p className="text-red-600 text-xs mt-1">{errors.display_name}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Nome visibile ai clienti nell'interfaccia.
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Descrizione *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descrizione dettagliata del piano e delle sue caratteristiche..."
                rows={3}
                className={errors.description ? 'border-red-300' : ''}
              />
              {errors.description && (
                <p className="text-red-600 text-xs mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Prezzo e Limiti */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Prezzo e Limiti
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="base_price" className="text-sm font-medium text-gray-700">
                  Prezzo Base (€/anno) *
                </Label>
                <Input
                  id="base_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => handleInputChange('base_price', parseFloat(e.target.value) || 0)}
                  className={errors.base_price ? 'border-red-300' : ''}
                />
                {errors.base_price && (
                  <p className="text-red-600 text-xs mt-1">{errors.base_price}</p>
                )}
              </div>

              <div>
                <Label htmlFor="teams_limit" className="text-sm font-medium text-gray-700">
                  Limite Squadre *
                </Label>
                <Input
                  id="teams_limit"
                  type="number"
                  min="0"
                  value={formData.teams_limit}
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
                  value={formData.players_limit}
                  onChange={(e) => handleInputChange('players_limit', parseInt(e.target.value) || 0)}
                  className={errors.players_limit ? 'border-red-300' : ''}
                />
                {errors.players_limit && (
                  <p className="text-red-600 text-xs mt-1">{errors.players_limit}</p>
                )}
              </div>
            </div>
          </div>

          {/* Configurazione Piano */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Configurazione Piano
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Piano Attivo
                  </Label>
                </div>
                <p className="text-xs text-gray-500 ml-7">
                  I piani inattivi non saranno visibili ai clienti durante la registrazione.
                </p>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="custom_pricing_enabled"
                    checked={formData.custom_pricing_enabled}
                    onChange={(e) => handleInputChange('custom_pricing_enabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="custom_pricing_enabled" className="text-sm font-medium text-gray-700">
                    Prezzi Personalizzabili
                  </Label>
                </div>
                <p className="text-xs text-gray-500 ml-7">
                  Permette ai clienti di negoziare prezzi personalizzati.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Informazioni Importanti
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Il piano sarà creato con versione 1.0</li>
                  <li>• I limiti possono essere modificati in futuro</li>
                  <li>• Le modifiche creano automaticamente nuove versioni</li>
                  <li>• I contratti esistenti non vengono influenzati</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Funzionalità */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-600" />
                Funzionalità del Piano
              </h3>
              <Button
                type="button"
                onClick={addFeature}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Aggiungi Funzionalità
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Funzionalità ${index + 1} (es. Dashboard avanzata, Report personalizzati)`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => removeFeature(index)}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                    disabled={formData.features.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {formData.features.length === 0 && (
                <p className="text-gray-500 text-sm italic">Nessuna funzionalità definita</p>
              )}
            </div>
            {errors.features && (
              <p className="text-red-600 text-xs">{errors.features}</p>
            )}
            <p className="text-xs text-gray-500">
              Descrivi le caratteristiche principali del piano. Almeno una funzionalità è richiesta.
            </p>
          </div>

          {/* Note Aggiuntive */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-600" />
              Note Aggiuntive
            </h3>
            
            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Note per Amministratori
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Note interne, considerazioni speciali, limitazioni note..."
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Queste note sono visibili solo agli amministratori, non ai clienti.
              </p>
            </div>
          </div>

          {/* Anteprima Piano */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Anteprima Piano</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nome:</span>
                <span className="ml-2 font-medium">{formData.display_name || 'Non specificato'}</span>
              </div>
              <div>
                <span className="text-gray-600">Prezzo:</span>
                <span className="ml-2 font-medium">€{formData.base_price}/anno</span>
              </div>
              <div>
                <span className="text-gray-600">Limiti:</span>
                <span className="ml-2 font-medium">{formData.teams_limit} squadre, {formData.players_limit} giocatori</span>
              </div>
              <div>
                <span className="text-gray-600">Stato:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  formData.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {formData.is_active ? 'Attivo' : 'Inattivo'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Prezzi Personalizzabili:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  formData.custom_pricing_enabled 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {formData.custom_pricing_enabled ? 'Sì' : 'No'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Funzionalità:</span>
                <span className="ml-2 font-medium">{formData.features.filter(f => f.trim()).length}</span>
              </div>
            </div>
          </div>

          {/* Footer con Azioni */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onClose()
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Annulla
            </Button>
            
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                Reset Form
              </Button>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creazione in corso...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Crea Piano
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
