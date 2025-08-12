"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, signUp } from "@/lib/local-storage"
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

interface User {
  id: string
  email: string
}

interface LoginScreenProps {
  onLogin: (user: User) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password)

      if (result.error) {
        setError(result.error)
      } else if (result.user) {
        onLogin(result.user)
      }
    } catch (error: any) {
      setError('Errore durante l\'autenticazione')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    const result = await signIn('demo@medcheckclub.com', 'demo123')
    if (result.user) {
      onLogin(result.user)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <span className="text-white font-bold text-xl sm:text-2xl">MC</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">MedCheck Club</h1>
          <p className="text-gray-600 text-base sm:text-lg">Gestione Visite Mediche</p>
        </div>

        <Card className="bg-white border-gray-200 shadow-xl">
          <CardHeader className="text-center p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">
              {isLogin ? 'Accedi' : 'Registrati'}
            </CardTitle>
            <CardDescription className="text-gray-600 text-base sm:text-lg">
              {isLogin 
                ? 'Inserisci le tue credenziali per accedere' 
                : 'Crea un nuovo account per iniziare'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleAuth} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base sm:text-lg text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 sm:pl-12 h-10 sm:h-12 text-base sm:text-lg bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="tua@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base sm:text-lg text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 sm:pl-12 pr-10 sm:pr-12 h-10 sm:h-12 text-base sm:text-lg bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="La tua password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                  <p className="text-red-700 text-center text-sm sm:text-base">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 sm:h-12 text-base sm:text-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Caricamento...' : (isLogin ? 'Accedi' : 'Registrati')}
              </Button>

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setIsLogin(!isLogin)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-sm sm:text-base"
                >
                  {isLogin 
                    ? 'Non hai un account? Registrati' 
                    : 'Hai già un account? Accedi'
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Section */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-base sm:text-lg font-medium text-blue-800 mb-2">🚀 Accesso Rapido Demo</h3>
          <p className="text-blue-700 text-sm mb-3 sm:mb-4">
            Prova subito l'applicazione con dati di esempio già configurati.
          </p>
          <Button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full h-10 sm:h-12 text-base sm:text-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? 'Caricamento...' : 'Accedi con Account Demo'}
          </Button>
        </div>

        {/* Info Section */}
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-700 text-xs sm:text-sm text-center mb-2">
            <strong>Versione Demo:</strong> Tutti i dati sono salvati localmente nel browser. 
            Perfetto per testare tutte le funzionalità senza configurazione.
          </p>
          <div className="text-center">
            <a 
              href="/backoffice"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors"
            >
              🏢 Accesso Amministratori
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
