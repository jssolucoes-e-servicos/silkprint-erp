'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Printer, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { register } from '@/app/actions/auth'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    
    const result = await register({ name, email, password })
    setIsPending(false)
    
    if (result.success) {
      toast.success('Conta criada com sucesso!')
      router.push('/acesso/login')
    } else {
      toast.error(result.message || 'Erro ao criar conta')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 md:p-0">
      <div className="w-full max-w-[1200px] flex flex-col md:flex-row h-auto md:min-h-[600px] bg-white dark:bg-slate-900 overflow-hidden md:rounded-2xl md:shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="hidden md:flex md:w-1/2 relative bg-slate-950 items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
          <div className="relative z-10 p-12 text-white">
            <Printer className="text-blue-500 h-16 w-16 mb-6" />
            <h1 className="text-5xl font-black mb-4 tracking-tight">GraphERP</h1>
            <p className="text-slate-400 text-xl max-w-sm">Junte-se à revolução na gestão de indústrias gráficas.</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20">
          <div className="mx-auto w-full max-w-sm">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Criar conta</h2>
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <Input id="name" placeholder="Seu Nome" className="pl-10 h-12" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <Input id="email" type="email" placeholder="exemplo@grapherp.com" className="pl-10 h-12" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10 h-12" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" className="absolute right-3 top-3.5" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5 text-slate-500" /> : <Eye className="h-5 w-5 text-slate-500" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                {isPending ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              Já tem uma conta? <Link href="/acesso/login" className="text-blue-600 font-semibold">Entrar</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
