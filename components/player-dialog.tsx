"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Download, Eye, X, Camera, Users } from "lucide-react"
import { createPlayer, updatePlayer, canAddPlayer, SUBSCRIPTION_LIMITS } from "@/lib/local-storage"

interface Player {
  id: string
  name: string
  email: string
  phone: string
  position: string
  medical_exam_date: string
  medical_expiry_date: string
  team_id: string
  medical_certificate?: string
  medical_certificate_name?: string
  medical_certificate_type?: string
}

interface PlayerDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  player?: Player | null
  teamId: string
}

export function PlayerDialog({ isOpen, onClose, onSave, player, teamId }: PlayerDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    medical_exam_date: "",
    medical_expiry_date: "",
    medical_certificate: "",
    medical_certificate_name: "",
    medical_certificate_type: "",
  })
  const [loading, setLoading] = useState(false)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [playerLimits, setPlayerLimits] = useState<{ current: number; max: number } | null>(null)

  // Get player limits when dialog opens
  useEffect(() => {
    const fetchPlayerLimits = async () => {
      try {
        // This would need to be passed from parent component
        // For now, we'll show a placeholder
        setPlayerLimits({ current: 0, max: 50 })
      } catch (error) {
        console.error("Error fetching player limits:", error)
      }
    }
    
    if (isOpen && !player) {
      fetchPlayerLimits()
    }
  }, [isOpen, player])

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name,
        email: player.email,
        phone: player.phone,
        position: player.position,
        medical_exam_date: player.medical_exam_date,
        medical_expiry_date: player.medical_expiry_date,
        medical_certificate: player.medical_certificate || "",
        medical_certificate_name: player.medical_certificate_name || "",
        medical_certificate_type: player.medical_certificate_type || "",
      })
      if (player.medical_certificate) {
        setFilePreview(player.medical_certificate)
      }
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        medical_exam_date: "",
        medical_expiry_date: "",
        medical_certificate: "",
        medical_certificate_name: "",
        medical_certificate_type: "",
      })
      setFilePreview(null)
    }
  }, [player, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (player) {
        await updatePlayer(player.id, formData)
      } else {
        await createPlayer({ ...formData, team_id: teamId })
      }

      onSave()
    } catch (error) {
      console.error("Error saving player:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExamDateChange = (examDate: string) => {
    setFormData((prev) => {
      const newFormData = { ...prev, medical_exam_date: examDate }

      if (examDate) {
        const examDateObj = new Date(examDate)
        const expiryDate = new Date(examDateObj)
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)
        newFormData.medical_expiry_date = expiryDate.toISOString().split("T")[0]
      }

      return newFormData
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Il file è troppo grande. Dimensione massima: 5MB")
        return
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
      if (!allowedTypes.includes(file.type)) {
        alert("Tipo di file non supportato. Usa JPG, PNG o PDF")
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setFormData((prev) => ({
          ...prev,
          medical_certificate: result,
          medical_certificate_name: file.name,
          medical_certificate_type: file.type,
        }))
        setFilePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      medical_certificate: "",
      medical_certificate_name: "",
      medical_certificate_type: "",
    }))
    setFilePreview(null)
  }

  const handleDownloadFile = () => {
    if (formData.medical_certificate && formData.medical_certificate_name) {
      const link = document.createElement("a")
      link.href = formData.medical_certificate
      link.download = formData.medical_certificate_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handlePreviewFile = () => {
    if (formData.medical_certificate) {
      setIsPreviewOpen(true)
    }
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] max-w-[95vw] max-h-[90vh] overflow-y-auto bg-white border-gray-200 m-2 sm:m-4">
        <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
          <DialogTitle className="text-xl sm:text-2xl text-gray-800">
            {player ? "Modifica Giocatore" : "Aggiungi Giocatore"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base sm:text-lg">
            {player
              ? "Aggiorna le informazioni del giocatore e i dettagli della visita medica."
              : "Aggiungi un nuovo giocatore alla squadra."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 sm:space-y-6 py-4 sm:py-6 px-4 sm:px-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base sm:text-lg text-gray-700">
                Nome Completo
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="h-10 sm:h-12 text-base sm:text-lg bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"
                placeholder="Inserisci il nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base sm:text-lg text-gray-700">
                Indirizzo Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="h-10 sm:h-12 text-base sm:text-lg bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"
                placeholder="giocatore@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base sm:text-lg text-gray-700">
                Numero di Telefono
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="h-10 sm:h-12 text-base sm:text-lg bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"
                placeholder="+39 123 456 7890"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-base sm:text-lg text-gray-700">
                Ruolo
              </Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, position: value }))}
              >
                <SelectTrigger className="h-10 sm:h-12 text-base sm:text-lg bg-gray-50 border-gray-300 text-gray-800">
                  <SelectValue placeholder="Seleziona ruolo" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="Portiere" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Portiere
                  </SelectItem>
                  <SelectItem value="Difensore" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Difensore
                  </SelectItem>
                  <SelectItem value="Centrocampista" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Centrocampista
                  </SelectItem>
                  <SelectItem value="Attaccante" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Attaccante
                  </SelectItem>
                  <SelectItem value="Allenatore" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Allenatore
                  </SelectItem>
                  <SelectItem value="Staff" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">
                    Staff
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exam-date" className="text-base sm:text-lg text-gray-700">
                Data Visita Medica
              </Label>
              <Input
                id="exam-date"
                type="date"
                value={formData.medical_exam_date}
                onChange={(e) => handleExamDateChange(e.target.value)}
                className="h-10 sm:h-12 text-base sm:text-lg bg-gray-50 border-gray-300 text-gray-800"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry-date" className="text-base sm:text-lg text-gray-700">
                Data di Scadenza
              </Label>
              <Input
                id="expiry-date"
                type="date"
                value={formData.medical_expiry_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, medical_expiry_date: e.target.value }))}
                className="h-10 sm:h-12 text-base sm:text-lg bg-gray-50 border-gray-300 text-gray-800"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base sm:text-lg text-gray-700">Certificato Medico</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6">
                {!filePreview ? (
                  <div className="text-center">
                    <div className="flex flex-col items-center gap-2 sm:gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium text-sm sm:text-base mb-1">Carica certificato medico</p>
                        <p className="text-gray-500 text-xs sm:text-sm">JPG, PNG o PDF (max 5MB)</p>
                      </div>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base">
                          <Camera className="h-4 w-4 mr-2" />
                          Seleziona File
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-green-800 font-medium text-sm sm:text-base truncate">
                          {formData.medical_certificate_name}
                        </p>
                        <p className="text-green-600 text-xs sm:text-sm">
                          {formData.medical_certificate_type === "application/pdf" ? "Documento PDF" : "Immagine"}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleRemoveFile}
                        className="border-red-300 text-red-700 hover:bg-red-50 h-8 w-8 p-0 bg-transparent"
                      >
                        <X className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handlePreviewFile}
                        className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-100 text-xs sm:text-sm bg-transparent"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Anteprima
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleDownloadFile}
                        className="flex-1 border-green-300 text-green-700 hover:bg-green-50 text-xs sm:text-sm bg-transparent"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Scarica
                      </Button>
                      <label htmlFor="file-replace" className="flex-1 cursor-pointer">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 text-xs sm:text-sm bg-transparent"
                        >
                          <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Sostituisci
                        </Button>
                        <input
                          id="file-replace"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Player Limits Info */}
            {!player && playerLimits && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Limiti del piano</span>
                </div>
                <div className="text-sm text-blue-700">
                  <div className="flex justify-between">
                    <span>Giocatori attuali:</span>
                    <span className="font-medium">{playerLimits.current}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Limite massimo:</span>
                    <span className="font-medium">{playerLimits.max}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 space-y-2 sm:space-y-0 p-4 sm:p-6 pt-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto h-10 sm:h-12 text-base sm:text-lg border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto h-10 sm:h-12 text-base sm:text-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Salvataggio..." : player ? "Aggiorna Giocatore" : "Aggiungi Giocatore"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    {/* Preview Modal */}
    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
      <DialogContent className="w-[95vw] max-w-3xl h-[85vh] p-3 sm:p-4">
        <div className="w-full h-full rounded-lg overflow-hidden bg-white">
          {formData.medical_certificate_type === "application/pdf" ? (
            <iframe title="Anteprima Certificato" src={formData.medical_certificate} className="w-full h-full" />
          ) : (
            <img alt="Anteprima Certificato" src={formData.medical_certificate} className="w-full h-full object-contain bg-gray-50" />
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownloadFile} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            Scarica
          </Button>
          <Button onClick={() => setIsPreviewOpen(false)} variant="outline" className="flex-1">
            Chiudi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
