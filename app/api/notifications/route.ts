import { NextResponse } from 'next/server'
import { getExpiringPlayers } from '@/lib/local-storage'

export async function POST() {
  try {
    const expiringPlayers = await getExpiringPlayers()
    const today = new Date()
    
    const notifications = expiringPlayers.map(player => {
      const expiryDate = new Date(player.medical_expiry_date)
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      let message = ''
      if (daysUntilExpiry === 0) {
        message = `URGENTE: La tua visita medica scade OGGI!`
      } else if (daysUntilExpiry === 7) {
        message = `PROMEMORIA: La tua visita medica scade tra 7 giorni (${expiryDate.toLocaleDateString('it-IT')})`
      } else if (daysUntilExpiry === 30) {
        message = `PROMEMORIA: La tua visita medica scade tra 30 giorni (${expiryDate.toLocaleDateString('it-IT')})`
      } else if (daysUntilExpiry < 0) {
        message = `SCADUTA: La tua visita medica è scaduta ${Math.abs(daysUntilExpiry)} giorni fa!`
      }

      return {
        player: player.name,
        email: player.email,
        phone: player.phone,
        message,
        daysUntilExpiry
      }
    })

    return NextResponse.json({ 
      success: true, 
      notifications,
      message: `${notifications.length} notifiche sarebbero inviate`
    })
  } catch (error) {
    console.error('Error processing notifications:', error)
    return NextResponse.json({ success: false, error: 'Errore nell\'elaborazione delle notifiche' }, { status: 500 })
  }
}
