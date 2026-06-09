'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function RecuperarAcessoPage() {
  const [email, setEmail] = useState('')

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Instruções de recuperação enviadas para o seu e-mail!')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border/50 px-6 py-4 lg:px-40 bg-card">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1 rounded">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">GraphERP</h2>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              Recuperar Acesso
            </h1>
            <p className="text-muted-foreground text-base">
              Insira o e-mail cadastrado para receber as instruções de recuperação.
            </p>
          </div>

          <div className="bg-card p-1 rounded-2xl shadow-2xl border border-border/50">
            <form className="p-6 space-y-6" onSubmit={handleRecover}>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail de Trabalho</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="exemplo@empresa.com" 
                    className="pl-10 h-14 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/20 gap-2">
                Enviar Link de Recuperação
                <ArrowRight className="h-5 w-5" />
              </Button>
            </form>
          </div>

          <div className="text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-semibold transition-colors group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Voltar para o Login
            </Link>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-muted-foreground text-xs">
        © 2024 GraphERP - Todos os direitos reservados.
      </footer>

      {/* Background Decoration */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-1/4 h-1/4 bg-primary/10 blur-[100px] rounded-full"></div>
    </div>
  )
}
