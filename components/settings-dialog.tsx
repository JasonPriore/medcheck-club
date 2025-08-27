"use client"

import { useState, useEffect, useRef } from "react"
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
  AlertTriangle,
  Upload,
  FileImage
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
  const [uploadStatus, setUploadStatus] = useState<{
    loading: boolean
    error: string | null
    success: boolean
  }>({
    loading: false,
    error: null,
    success: false
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.organization_logo || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset form when user changes
  useEffect(() => {
    setFormData({
      organization_name: user.organization_name || "",
      organization_logo: user.organization_logo || ""
    })
    setPreviewUrl(user.organization_logo || null)
    setSelectedFile(null)
    setUploadStatus({ loading: false, error: null, success: false })
  }, [user])

  // Ensure file input is properly initialized
  useEffect(() => {
    if (fileInputRef.current) {
      console.log('File input found and initialized')
      console.log('File input element:', fileInputRef.current)
      console.log('File input type:', fileInputRef.current.type)
      console.log('File input accept:', fileInputRef.current.accept)
      
      // Remove any existing event listeners to avoid duplicates
      const currentRef = fileInputRef.current
      const handleChange = (e: Event) => {
        console.log('File input change event listener triggered')
        console.log('Event:', e)
        console.log('Event target:', e.target)
      }
      
      currentRef.addEventListener('change', handleChange)
      
      return () => {
        currentRef.removeEventListener('change', handleChange)
      }
    } else {
      console.log('File input not found')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (uploadStatus.loading) return

    console.log('Submitting form with data:', formData)
    console.log('Organization logo length:', formData.organization_logo?.length || 0)

    setUploadStatus({ loading: true, error: null, success: false })
    
    try {
      const result = await updateUserOrganization(user.id, formData)
      console.log('Update result:', result)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      setUploadStatus({ loading: false, error: null, success: true })
      
      // Show success message briefly before closing
      setTimeout(() => {
        onUpdate()
        onClose()
      }, 1000)
    } catch (error) {
      console.error("Error updating organization:", error)
      setUploadStatus({ 
        loading: false, 
        error: "Errore durante il salvataggio. Riprova.", 
        success: false 
      })
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload event triggered:', e)
    console.log('Event target:', e.target)
    console.log('Event target files:', e.target.files)
    
    const file = e.target.files?.[0]
    console.log('File selected:', file)
    
    if (!file) {
      console.log('No file selected')
      return
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"]
    console.log('File type:', file.type, 'Allowed types:', allowedTypes)
    console.log('File type check result:', allowedTypes.includes(file.type))
    
    if (!allowedTypes.includes(file.type)) {
      console.log('File type not allowed')
      setUploadStatus({
        loading: false,
        error: "Formato file non supportato. Carica solo JPG, PNG o SVG.",
        success: false
      })
      return
    }

    // Validate file size (5MB limit)
    console.log('File size:', file.size, 'bytes')
    console.log('File size check result:', file.size <= 5 * 1024 * 1024)
    
    if (file.size > 5 * 1024 * 1024) {
      console.log('File too large')
      setUploadStatus({
        loading: false,
        error: "Il file è troppo grande. Dimensione massima: 5MB.",
        success: false
      })
      return
    }

    console.log('File validation passed, proceeding with upload')
    setSelectedFile(file)
    setUploadStatus({ loading: false, error: null, success: false })

    // Create preview
    const reader = new FileReader()
    
    reader.onload = () => {
      const result = reader.result as string
      console.log('File read successfully, result length:', result.length)
      console.log('Result type:', typeof result)
      console.log('Result starts with data:', result.startsWith('data:'))
      
      setPreviewUrl(result)
      setFormData(prev => {
        const newData = {
          ...prev,
          organization_logo: result
        }
        console.log('Updated formData:', newData)
        return newData
      })
      console.log('Updated formData with logo')
    }
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error)
      setUploadStatus({
        loading: false,
        error: "Errore durante la lettura del file.",
        success: false
      })
    }
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100
        console.log('File reading progress:', progress.toFixed(2) + '%')
      }
    }
    
    console.log('Starting to read file...')
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setFormData(prev => ({
      ...prev,
      organization_logo: ""
    }))
    setUploadStatus({ loading: false, error: null, success: false })
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const resetForm = () => {
    setFormData({
      organization_name: user.organization_name || "",
      organization_logo: user.organization_logo || ""
    })
    setPreviewUrl(user.organization_logo || null)
    setSelectedFile(null)
    setUploadStatus({ loading: false, error: null, success: false })
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="organization_logo">Logo/Immagine Organizzazione (Opzionale)</Label>
                    
                    {/* File Upload Input */}
                    <div className="mt-2">
                      <div className="flex gap-2 items-center">
                        <Input
                          ref={fileInputRef}
                          id="organization_logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="cursor-pointer flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          disabled={uploadStatus.loading}
                          onError={(e) => {
                            console.error('File input error:', e)
                            setUploadStatus({
                              loading: false,
                              error: "Errore con l'input file. Riprova.",
                              success: false
                            })
                          }}
                          onClick={() => {
                            console.log('File input clicked')
                            console.log('File input ref current:', fileInputRef.current)
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log('Browse button clicked')
                            console.log('File input ref current:', fileInputRef.current)
                            if (fileInputRef.current) {
                              console.log('Triggering file input click')
                              fileInputRef.current.click()
                            } else {
                              console.log('File input ref is null')
                            }
                          }}
                          disabled={uploadStatus.loading}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Sfoglia
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Formati supportati: JPG, PNG, SVG. Dimensione massima: 5MB
                      </p>
                      
                      {/* Debug info */}
                      <div className="mt-2 text-xs text-gray-400">
                        <p>Stato upload: {uploadStatus.loading ? 'Caricamento...' : uploadStatus.error ? 'Errore' : uploadStatus.success ? 'Successo' : 'Pronto'}</p>
                        <p>File selezionato: {selectedFile ? selectedFile.name : 'Nessuno'}</p>
                        <p>Preview URL: {previewUrl ? `${previewUrl.substring(0, 50)}...` : 'Nessuno'}</p>
                        <p>File input ref: {fileInputRef.current ? 'Disponibile' : 'Non disponibile'}</p>
                      </div>
                    </div>

                    {/* Preview and Status */}
                    {previewUrl && (
                      <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 border border-gray-300 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                            {previewUrl.startsWith('data:image') ? (
                              <img 
                                src={previewUrl} 
                                alt="Logo preview" 
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <FileImage className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">
                              {selectedFile ? selectedFile.name : "Logo caricato"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "File esistente"}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeLogo}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Upload Status Messages */}
                    {uploadStatus.error && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        {uploadStatus.error}
                      </div>
                    )}
                    
                    {uploadStatus.success && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                        Modifiche salvate con successo!
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={uploadStatus.loading || !formData.organization_name.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {uploadStatus.loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Salvataggio...
                      </>
                    ) : (
                      "Salva Modifiche"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1"
                    disabled={uploadStatus.loading}
                  >
                    Reset
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={uploadStatus.loading}
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
