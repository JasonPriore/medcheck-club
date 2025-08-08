"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createPlayer, updatePlayer } from "@/lib/local-storage"

interface Player {
  id: string
  name: string
  email: string
  phone: string
  position: string
  medical_exam_date: string
  medical_expiry_date: string
  team_id: string
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
    name: '',
    email: '',
    phone: '',
    position: '',
    medical_exam_date: '',
    medical_expiry_date: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name,
        email: player.email,
        phone: player.phone,
        position: player.position,
        medical_exam_date: player.medical_exam_date,
        medical_expiry_date: player.medical_expiry_date
      })
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        medical_exam_date: '',
        medical_expiry_date: ''
      })
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
      console.error('Error saving player:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExamDateChange = (examDate: string) => {
    setFormData(prev => {
      const newFormData = { ...prev, medical_exam_date: examDate }
      
      if (examDate) {
        const examDateObj = new Date(examDate)
        const expiryDate = new Date(examDateObj)
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)
        newFormData.medical_expiry_date = expiryDate.toISOString().split('T')[0]
      }
      
      return newFormData
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] max-w-[95vw] max-h-[90vh] overflow-y-auto bg-white border-gray-200 m-2 sm:m-4">
        <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
          <DialogTitle className="text-xl sm:text-2xl text-gray-800">
            {player ? 'Modifica Giocatore' : 'Aggiungi Giocatore'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base sm:text-lg">
            {player ? 'Aggiorna le informazioni del giocatore e i dettagli della visita medica.' : 'Aggiungi un nuovo giocatore alla squadra.'}
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
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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
                onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}
              >
                <SelectTrigger className="h-10 sm:h-12 text-base sm:text-lg bg-gray-50 border-gray-300 text-gray-800">
                  <SelectValue placeholder="Seleziona ruolo" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="Portiere" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">Portiere</SelectItem>
                  <SelectItem value="Difensore" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">Difensore</SelectItem>
                  <SelectItem value="Centrocampista" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">Centrocampista</SelectItem>
                  <SelectItem value="Attaccante" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">Attaccante</SelectItem>
                  <SelectItem value="Allenatore" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">Allenatore</SelectItem>
                  <SelectItem value="Staff" className="text-base sm:text-lg text-gray-800 hover:bg-gray-100">Staff</SelectItem>
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
                onChange={(e) => setFormData(prev => ({ ...prev, medical_expiry_date: e.target.value }))}
                className="h-10 sm:h-12 text-base sm:text-lg bg-gray-50 border-gray-300 text-gray-800"
                required
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 space-y-2 sm:space-y-0 p-4 sm:p-6 pt-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="w-full sm:w-auto h-10 sm:h-12 text-base sm:text-lg border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Annulla
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto h-10 sm:h-12 text-base sm:text-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Salvataggio...' : (player ? 'Aggiorna Giocatore' : 'Aggiungi Giocatore')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
