"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Phone, Mail, Clock, User, X, FileText, Download, Upload, Eye, Plus, CheckCircle } from "lucide-react"

interface Player {
  id: string
  name: string
  email: string
  phone: string
  position: string
  medical_exam_date: string
  medical_expiry_date: string
  team_id: string
  visit_completed?: boolean
  visit_completed_date?: string
  medical_certificate?: string
  medical_certificate_name?: string
  medical_certificate_type?: string
}

interface VisitStatusDialogProps {
  player: Player | null
  isOpen: boolean
  onClose: () => void
  onUpdatePlayer?: (playerId: string, updates: Partial<Player>) => void
}

export function VisitStatusDialog({ player, isOpen, onClose, onUpdatePlayer }: VisitStatusDialogProps) {
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: string } | null>(null)
  const [isUploadComplete, setIsUploadComplete] = useState(false)
  const [localFileData, setLocalFileData] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  if (!player) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "oggi"
    if (diffDays === 1) return "domani"
    if (diffDays < 0) return `scaduto da ${Math.abs(diffDays)} giorni`
    return `${diffDays} giorni`
  }

  const getStatusColor = (daysUntilExpiry: string) => {
    if (daysUntilExpiry.includes("scaduto")) return "bg-red-100 text-red-800 border-red-200"
    if (daysUntilExpiry === "oggi" || daysUntilExpiry === "domani")
      return "bg-orange-100 text-orange-800 border-orange-200"
    return "bg-green-100 text-green-800 border-green-200"
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      alert("Formato file non supportato. Carica solo PDF o immagini (JPG, PNG).")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Il file è troppo grande. Dimensione massima: 10MB.")
      return
    }

    setUploadLoading(true)
    setUploadProgress(0)
    setUploadedFile({ name: file.name, type: file.type })
    setIsUploadComplete(false)

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 200)

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const fileData = e.target?.result as string

        const updates = {
          medical_certificate: fileData,
          medical_certificate_name: file.name,
          medical_certificate_type: file.type,
        }

        if (onUpdatePlayer) {
          onUpdatePlayer(player.id, updates)
        }

        // Immediately reflect the uploaded file locally to avoid any flicker
        setLocalFileData(fileData)

        clearInterval(progressInterval)
        setUploadProgress(100)

        setTimeout(() => {
          setUploadLoading(false)
          setShowSuccessModal(true)
          setIsUploadComplete(true)
        }, 500)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Errore durante il caricamento del file.")
      clearInterval(progressInterval)
      setUploadLoading(false)
      setUploadProgress(0)
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleMarkUploadComplete = () => {
    setIsUploadComplete(true)
    if (onUpdatePlayer) {
      onUpdatePlayer(player.id, { visit_completed: true })
    }
  }

  const handleDownloadCertificate = () => {
    const data = player.medical_certificate || localFileData
    const name = player.medical_certificate_name || uploadedFile?.name
    if (data && name) {
      const link = document.createElement("a")
      link.href = data
      link.download = name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handlePreviewCertificate = () => {
    const data = player.medical_certificate || localFileData
    if (data) {
      setIsPreviewOpen(true)
    }
  }

  const daysUntilExpiry = getDaysUntilExpiry(player.medical_expiry_date)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          <DialogHeader className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6">

            <div className="flex items-center gap-3 sm:gap-4 pr-12 sm:pr-14">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-lg sm:text-xl font-bold text-white mb-1 truncate">
                  {player.name}
                </DialogTitle>
                <p className="text-blue-100 text-sm sm:text-base">Stato Visita Medica</p>
              </div>
            </div>
          </DialogHeader>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 sm:gap-3">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                    <span>Informazioni Visita</span>
                  </h3>
                  <Badge className={`text-xs sm:text-sm font-medium border ${getStatusColor(daysUntilExpiry)}`}>
                    {player.visit_completed ? "Completata" : "In attesa"}
                  </Badge>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-600 text-xs sm:text-sm">Data visita medica</p>
                      <p className="text-gray-900 font-semibold text-sm sm:text-base truncate">
                        {formatDate(player.medical_exam_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-600 text-xs sm:text-sm">Scadenza certificato</p>
                      <p className="text-gray-900 font-semibold text-sm sm:text-base">{daysUntilExpiry}</p>
                    </div>
                  </div>
                </div>

                {(player.phone || player.email) && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {player.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${player.phone}`, "_self")}
                          className="h-10 sm:h-12 justify-start border-green-300 text-green-700 hover:bg-green-100 text-xs sm:text-sm bg-transparent"
                        >
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{player.phone}</span>
                        </Button>
                      )}

                      {player.email && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`mailto:${player.email}`, "_self")}
                          className="h-10 sm:h-12 justify-start border-blue-300 text-blue-700 hover:bg-blue-100 text-xs sm:text-sm bg-transparent"
                        >
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{player.email}</span>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 sm:gap-3">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span>Certificato Medico</span>
                </h3>
              </div>

              <div className="p-4 sm:p-6">
                {(player.medical_certificate || localFileData) ? (
                  <>
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-green-800 font-semibold text-sm sm:text-base truncate">
                            {player.medical_certificate_name || uploadedFile?.name}
                          </p>
                          {(isUploadComplete || !!(player.medical_certificate || localFileData)) && (
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Caricato
                            </Badge>
                          )}
                        </div>
                        <p className="text-green-600 text-xs sm:text-sm">
                          {(player.medical_certificate_type || uploadedFile?.type) === "application/pdf" ? "📄 Documento PDF" : "🖼️ Immagine"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviewCertificate}
                        className="h-10 sm:h-12 border-blue-300 text-blue-700 hover:bg-blue-100 text-xs sm:text-sm bg-transparent"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                        <span className="truncate">Visualizza</span>
                      </Button>

                      {player.visit_completed ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadCertificate}
                          className="h-10 sm:h-12 border-green-300 text-green-700 hover:bg-green-100 text-xs sm:text-sm bg-transparent"
                        >
                          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                          <span className="truncate">Scarica Certificato</span>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadLoading}
                          className="h-10 sm:h-12 border-orange-300 text-orange-700 hover:bg-orange-100 text-xs sm:text-sm bg-transparent"
                        >
                          {uploadLoading ? (
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-orange-600 mr-1 sm:mr-2"></div>
                          ) : (
                            <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                          )}
                          <span className="truncate">Sostituisci</span>
                        </Button>
                      )}
                    </div>

                    {!player.visit_completed && !!(player.medical_certificate || localFileData) && (
                      <div className="pt-4 border-t border-gray-200">
                        <Button
                          onClick={handleMarkUploadComplete}
                          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Segna come Completato
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {uploadLoading && uploadedFile ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-blue-800 font-semibold text-sm truncate">{uploadedFile.name}</p>
                            <p className="text-blue-600 text-xs">
                              {uploadedFile.type === "application/pdf" ? "📄 Documento PDF" : "🖼️ Immagine"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Caricamento in corso...</span>
                            <span className="text-blue-600 font-semibold">{Math.round(uploadProgress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                        </div>
                        <h4 className="text-gray-800 font-semibold text-base sm:text-lg mb-2">
                          Nessun certificato caricato
                        </h4>
                        <p className="text-gray-600 text-sm sm:text-base mb-6">
                          {player.visit_completed
                            ? "Il certificato medico non è disponibile per il download"
                            : "Carica il certificato medico per completare la visita"}
                        </p>

                        {!player.visit_completed && (
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadLoading}
                            className="h-12 sm:h-14 px-6 sm:px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base"
                          >
                            {uploadLoading ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Caricamento...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 sm:gap-3">
                                <Plus className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                <span>Carica Certificato</span>
                              </div>
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="w-[95vw] sm:w-auto max-w-sm sm:max-w-md p-0 rounded-2xl">
          <div className="text-center p-5 sm:p-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Caricamento completato</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-5">Il certificato medico è stato caricato con successo.</p>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full h-11 sm:h-12 bg-green-600 hover:bg-green-700 text-white"
            >
              Continua
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="w-[95vw] max-w-3xl h-[85vh] p-3 sm:p-4">
          <div className="w-full h-full rounded-lg overflow-hidden bg-white">
            {(() => {
              const data = player.medical_certificate || localFileData
              const type = player.medical_certificate_type || uploadedFile?.type || ""
              if (type === "application/pdf") {
                return (
                  <iframe
                    title="Anteprima Certificato"
                    src={data || ""}
                    className="w-full h-full"
                  />
                )
              }
              return (
                <img
                  alt="Anteprima Certificato"
                  src={data || ""}
                  className="w-full h-full object-contain bg-gray-50"
                />
              )
            })()}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownloadCertificate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
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
