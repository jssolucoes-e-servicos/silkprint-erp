'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Printer, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // In a real app, validate password too. Simplified for now
    const result = await login(email, password)
    
    if (result.success) {
      toast.success('Login realizado com sucesso!')
      router.push('/app')
    } else {
      toast.error(result.message || 'E-mail ou senha incorretos')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 md:p-0">
      <div className="w-full max-w-[1200px] flex flex-col md:flex-row h-auto md:min-h-[600px] bg-card overflow-hidden md:rounded-2xl md:shadow-2xl border border-border/50">
        {/* Hero Side */}
        <div className="hidden md:flex md:w-1/2 relative bg-slate-950 items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
          <div 
            className="absolute inset-0 z-0 opacity-40 bg-cover bg-center" 
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?q=80&w=1932&auto=format&fit=crop")' }}
          ></div>
          <div className="relative z-10 p-12 text-white">
            <div className="mb-6">
              <Printer className="text-primary h-16 w-16" />
            </div>
            <h1 className="text-5xl font-black mb-4 tracking-tight">GraphERP</h1>
            <p className="text-slate-400 text-xl max-w-sm font-medium leading-relaxed">
              A solução completa para gestão inteligente da sua indústria gráfica.
            </p>
          </div>
        </div>

        {/* Login Form Side */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 bg-card">
          <div className="mx-auto w-full max-w-sm">
            <div className="flex flex-col items-center mb-10 md:items-start">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 md:hidden">
                <Printer className="text-primary h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Bem-vindo</h2>
              <p className="mt-2 text-sm text-muted-foreground">Acesse sua conta ou crie uma para gerenciar sua gráfica</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail corporativo</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="exemplo@grapherp.com" 
                    className="pl-10 h-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-10 pr-10 h-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/acesso/recuperar-acesso" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                  Esqueci minha senha
                </Link>
                <Link href="/acesso/cadastro" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                    Criar conta
                </Link>
              </div>

              <Button type="submit" className="w-full h-12 text-sm font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all">
                Entrar no Sistema
              </Button>
            </form>

            <div className="mt-10 border-t border-border pt-6">
              <div className="flex flex-col items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Ambiente Seguro e Criptografado
                </div>
                <p>© 2024 GraphERP - Todos os direitos reservados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
