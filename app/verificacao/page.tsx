'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShieldCheck, HelpCircle, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function VerificacaoPage() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = () => {
    if (code.join('').length === 6) {
      toast.success('Verificação concluída!')
      router.push('/')
    } else {
      toast.error('Insira o código completo')
    }
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
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <HelpCircle className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl border border-border/50 shadow-2xl">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-2">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-foreground">Two-Factor Verification</h1>
            <p className="text-muted-foreground text-base font-normal leading-relaxed">
              Enter the 6-digit verification code sent to your registered device to secure your session.
            </p>
          </div>

          <div className="flex justify-center gap-2 sm:gap-4">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                className="h-14 w-11 sm:w-14 text-center text-xl font-bold bg-muted border-2 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          <div className="space-y-6">
            <Button 
              className="w-full h-14 text-base font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
              onClick={handleVerify}
            >
              Verify and Login
            </Button>
            <div className="flex flex-col items-center gap-2">
              <p className="text-muted-foreground text-sm font-normal">Didn&apos;t receive the code?</p>
              <button className="text-primary text-sm font-bold hover:underline decoration-primary/50 underline-offset-4">
                Resend Code
              </button>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground text-xs">
            <Lock className="h-4 w-4" />
            <span>Encrypted Session: XA-992-01</span>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-muted-foreground text-xs">
        © 2024 GraphERP Systems. All rights reserved.
      </footer>
    </div>
  )
}
