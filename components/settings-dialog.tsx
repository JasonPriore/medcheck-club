"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Settings, 
  Building2, 
  CreditCard, 
  Users, 
  Calendar, 
  Mail, 
  Camera,
  X,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { updateUserOrganization, SUBSCRIPTION_LIMITS } from "@/lib/local-storage"

interface User {
  id: string
  email: string
  organization_name?: string
  organization_logo?: string
  subscription_plan: "base" | "plus" | "custom"
  subscription_start_date: string
  subscription_end_date: string
  subscription_price: number
}

interface SettingsDialogProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function SettingsDialog({ user, isOpen, onClose, onUpdate }: SettingsDialogProps) {
  const [formData, setFormData] = useState({
    organization_name: user.organization_name || "",
    organization_logo: user.organization_logo || ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUserOrganization(user.id, formData)
      onUpdate()
      onClose()
    } catch (error) {
      console.error("Error updating organization:", error)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          organization_logo: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const getSubscriptionInfo = (plan: string) => {
    if (!plan || !SUBSCRIPTION_LIMITS[plan as keyof typeof SUBSCRIPTION_LIMITS]) {
      // Default to base plan if invalid
      return {
        teams: `${SUBSCRIPTION_LIMITS.base.teams} squadre`,
        players: `${SUBSCRIPTION_LIMITS.base.players} giocatori`,
        price: `€${SUBSCRIPTION_LIMITS.base.price}/anno`
      }
    }
    
    const limits = SUBSCRIPTION_LIMITS[plan as keyof typeof SUBSCRIPTION_LIMITS]
    return {
      teams: `${limits.teams} squadre`,
      players: `${limits.players} giocatori`,
      price: `€${limits.price}/anno`
    }
  }

  const getPlanColor = (plan: string) => {
    if (!plan) return "bg-gray-100 text-gray-800 border-gray-200"
    
    switch (plan) {
      case "base": return "bg-blue-100 text-blue-800 border-blue-200"
      case "plus": return "bg-purple-100 text-purple-800 border-purple-200"
      case "custom": return "bg-orange-100 text-orange-800 border-orange-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPlanName = (plan: string) => {
    if (!plan) return "Base"
    
    switch (plan) {
      case "base": return "Base"
      case "plus": return "Plus"
      case "custom": return "Custom"
      default: return "Base"
    }
  }

  const subscriptionInfo = getSubscriptionInfo(user.subscription_plan || 'base')
  const daysUntilExpiry = Math.ceil((new Date(user.subscription_end_date || new Date()).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white">Impostazioni Organizzazione</DialogTitle>
              <p className="text-blue-100">Gestisci le informazioni del tuo club sportivo</p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Organization Info Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Informazioni Organizzazione
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="organization_name">Nome Organizzazione</Label>
                    <Input
                      id="organization_name"
                      value={formData.organization_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, organization_name: e.target.value }))}
                      placeholder="Inserisci il nome della tua organizzazione sportiva"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="organization_logo">Logo/Immagine Organizzazione (Opzionale)</Label>
                    <Input
                      id="organization_logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formati supportati: JPG, PNG, SVG. Dimensione massima: 5MB
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={false} // Removed loading state
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Salva Modifiche
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Annulla
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Subscription Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Piano di Abbonamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Piano attuale:</span>
                    <Badge className={getPlanColor(user.subscription_plan || 'base')}>
                      {getPlanName(user.subscription_plan || 'base')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Prezzo:</span>
                    <span className="font-semibold">€{user.subscription_price}/anno</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Data inizio:</span>
                    <span className="font-semibold">
                      {new Date(user.subscription_start_date).toLocaleDateString("it-IT")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Data scadenza:</span>
                    <span className="font-semibold">
                      {new Date(user.subscription_end_date).toLocaleDateString("it-IT")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Stato:</span>
                    <div className="flex items-center gap-2">
                      {daysUntilExpiry > 0 ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium">
                            {daysUntilExpiry === 1 ? "Scade domani" : `Scade tra ${daysUntilExpiry} giorni`}
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="text-red-600 font-medium">
                            Scaduto da {Math.abs(daysUntilExpiry)} giorni
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Limiti del piano:</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700">Squadre</span>
                      </div>
                      <span className="font-semibold">{subscriptionInfo.teams}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">Giocatori</span>
                      </div>
                      <span className="font-semibold">{subscriptionInfo.players}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                        <span className="text-gray-700">Prezzo</span>
                      </div>
                      <span className="font-semibold">{subscriptionInfo.price}</span>
                    </div>
                  </div>

                  {user.subscription_plan === "custom" && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-orange-800 text-sm">
                        <strong>Piano Custom:</strong> Contattaci per personalizzare i limiti in base alle tue esigenze.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 border-orange-300 text-orange-700 hover:bg-orange-100"
                        onClick={() => window.open("mailto:consulenza@medcheckclub.com?subject=Richiesta Piano Custom", "_blank")}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Contattaci
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Piani Disponibili
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-2 border-blue-200 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-blue-800 mb-2">Base</h4>
                  <div className="text-2xl font-bold text-blue-600 mb-2">€80/anno</div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• 2 squadre</div>
                    <div>• 50 giocatori</div>
                    <div>• Supporto base</div>
                  </div>
                </div>

                <div className="border-2 border-purple-200 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-purple-800 mb-2">Plus</h4>
                  <div className="text-2xl font-bold text-purple-600 mb-2">€200/anno</div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• 5 squadre</div>
                    <div>• 100 giocatori</div>
                    <div>• Supporto prioritario</div>
                  </div>
                </div>

                <div className="border-2 border-orange-200 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-orange-800 mb-2">Custom</h4>
                  <div className="text-2xl font-bold text-orange-600 mb-2">Su richiesta</div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• Squadre illimitate</div>
                    <div>• Giocatori illimitati</div>
                    <div>• Supporto dedicato</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-orange-300 text-orange-700 hover:bg-orange-100"
                    onClick={() => window.open("mailto:consulenza@medcheckclub.com?subject=Richiesta Piano Custom", "_blank")}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contattaci
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
