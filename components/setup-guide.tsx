"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Database, Key, Globe } from 'lucide-react'

export function SetupGuide() {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">MC</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Configurazione MedCheck Club</h1>
          <p className="text-gray-400 text-lg">Configura Supabase per utilizzare tutte le funzionalità</p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Database className="h-6 w-6 mr-2" />
              Passo 1: Crea un Progetto Supabase
            </CardTitle>
            <CardDescription className="text-gray-400">
              Registrati su Supabase e crea un nuovo progetto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Vai su <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">supabase.com</a></li>
              <li>Crea un account gratuito</li>
              <li>Clicca su "New Project"</li>
              <li>Scegli un nome per il progetto (es. "medcheck-club")</li>
              <li>Imposta una password sicura per il database</li>
              <li>Seleziona una regione vicina (es. "West EU")</li>
            </ol>
            <Button asChild className="w-full">
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Apri Supabase
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Key className="h-6 w-6 mr-2" />
              Passo 2: Ottieni le Credenziali
            </CardTitle>
            <CardDescription className="text-gray-400">
              Copia URL e chiave API dal tuo progetto Supabase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Nel dashboard Supabase, vai su "Settings" → "API"</li>
              <li>Copia il "Project URL"</li>
              <li>Copia la "anon public" key</li>
              <li>Aggiungi queste variabili al tuo file .env.local:</li>
            </ol>
            <div className="bg-gray-900 p-4 rounded-lg">
              <code className="text-green-400 text-sm">
                NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co<br/>
                NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
              </code>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Database className="h-6 w-6 mr-2" />
              Passo 3: Configura il Database
            </CardTitle>
            <CardDescription className="text-gray-400">
              Esegui gli script SQL per creare le tabelle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Nel dashboard Supabase, vai su "SQL Editor"</li>
              <li>Crea una nuova query</li>
              <li>Copia e incolla il contenuto di <code className="bg-gray-700 px-2 py-1 rounded">scripts/create-tables.sql</code></li>
              <li>Clicca "Run" per eseguire lo script</li>
              <li>Verifica che le tabelle "teams" e "players" siano state create</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Globe className="h-6 w-6 mr-2" />
              Passo 4: Abilita l'Autenticazione
            </CardTitle>
            <CardDescription className="text-gray-400">
              Configura l'autenticazione email/password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Vai su "Authentication" → "Settings"</li>
              <li>Assicurati che "Enable email confirmations" sia disabilitato per il testing</li>
              <li>Opzionale: Configura provider OAuth (Google, GitHub, etc.)</li>
              <li>Salva le impostazioni</li>
            </ol>
          </CardContent>
        </Card>

        <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-300 mb-2">✅ Configurazione Completata!</h3>
          <p className="text-green-200 mb-4">
            Una volta completati tutti i passaggi, ricarica la pagina per utilizzare MedCheck Club con il tuo database Supabase.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-green-600 hover:bg-green-700"
          >
            Ricarica Applicazione
          </Button>
        </div>

        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-300 mb-2">🚀 Modalità Demo</h3>
          <p className="text-blue-200 mb-4">
            Puoi anche testare l'applicazione in modalità demo senza configurare Supabase. 
            I dati non verranno salvati ma potrai esplorare tutte le funzionalità.
          </p>
          <Button 
            onClick={() => window.dispatchEvent(new CustomEvent('demo-login'))}
            variant="outline"
            className="border-blue-600 text-blue-300 hover:bg-blue-900/30"
          >
            Continua in Modalità Demo
          </Button>
        </div>
      </div>
    </div>
  )
}
