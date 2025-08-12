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
import { Users } from "lucide-react"
import { createPlayer, updatePlayer, getUserPlayerCount } from "@/lib/local-storage"

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

interface PlayerFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  medical_exam_date: string;
  medical_expiry_date: string;
}

export function PlayerDialog({ isOpen, onClose, onSave, player, teamId }: PlayerDialogProps) {
  const [formData, setFormData] = useState<PlayerFormData>({
    name: "",
    email: "",
    phone: "",
    position: "",
    medical_exam_date: "",
    medical_expiry_date: ""
  })
  const [loading, setLoading] = useState(false)
  const [playerLimits, setPlayerLimits] = useState({ current: 0, max: 0 })

  useEffect(() => {
    if (isOpen) {
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
        // Reset form for new player
        setFormData({
          name: "",
          email: "",
          phone: "",
          position: "",
          medical_exam_date: "",
          medical_expiry_date: ""
        })
        // Fetch player limits for new player
        fetchPlayerLimits()
      }
    }
  }, [isOpen, player, teamId])

  const fetchPlayerLimits = async () => {
    try {
      // Get the current user ID from the team
      const teams = JSON.parse(localStorage.getItem('medcheck_teams') || '[]')
      const currentTeam = teams.find((t: any) => t.id === teamId)
      if (currentTeam) {
        const limits = await getUserPlayerCount(currentTeam.user_id)
        setPlayerLimits({ current: limits.currentPlayers, max: limits.maxPlayers })
      }
    } catch (error) {
      console.error('Error fetching player limits:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (player) {
        // Update existing player
        await updatePlayer(player.id, formData)
      } else {
        // Create new player
        await createPlayer({
          ...formData,
          team_id: teamId,
          visit_completed: false
        })
      }

      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving player:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md">
        <DialogHeader>
          <DialogTitle>
            {player ? "Modifica Giocatore" : "Aggiungi Nuovo Giocatore"}
          </DialogTitle>
          <DialogDescription>
            {player 
              ? "Modifica le informazioni del giocatore selezionato"
              : "Inserisci le informazioni per il nuovo giocatore"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Player Limits Info */}
          {!player && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Limiti Piano Abbonamento</span>
              </div>
              <div className="space-y-2 text-sm text-blue-700">
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

          {/* Basic Player Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome e Cognome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Inserisci nome e cognome"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@esempio.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+39 123 456 7890"
              />
            </div>

            <div>
              <Label htmlFor="position">Ruolo/Posizione</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="es. Attaccante, Centrocampista, Portiere..."
              />
            </div>

            <div>
              <Label htmlFor="medical_exam_date">Data Visita Medica</Label>
              <Input
                id="medical_exam_date"
                type="date"
                value={formData.medical_exam_date}
                onChange={(e) => setFormData(prev => ({ ...prev, medical_exam_date: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="medical_expiry_date">Data Scadenza Visita</Label>
              <Input
                id="medical_expiry_date"
                type="date"
                value={formData.medical_expiry_date}
                onChange={(e) => setFormData(prev => ({ ...prev, medical_expiry_date: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annulla
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvataggio..." : (player ? "Aggiorna" : "Crea")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
