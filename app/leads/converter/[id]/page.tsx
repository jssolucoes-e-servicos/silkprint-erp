'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  UserPlus, 
  ArrowLeft, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  History, 
  CheckCircle2,
  Building2,
  User
} from "lucide-react"
import Link from 'next/link'
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ConverterLeadPage() {
  const params = useParams()
  const router = useRouter()
  const [personType, setPersonType] = useState('pf')
  const [leadData, setLeadData] = useState({
    name: "João Silva",
    origin: "Campanha Facebook Ads",
    email: "joao.silva@email.com",
    phone: "(11) 98888-7777",
    interest: "Assinatura Anual - Plano Enterprise",
    lastInteraction: "há 2 horas"
  })

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Lead convertido em cliente com sucesso!')
    router.push('/clientes')
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Converter Lead em Cliente</h1>
          <p className="mt-2 text-muted-foreground">
            Transforme os dados de <span className="text-primary font-semibold">{leadData.name}</span> em um cadastro de cliente completo.
          </p>
        </div>
        <Link href="/leads">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Leads
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Lead Summary */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center gap-3">
              <Search className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold">Resumo do Lead</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-1 border-b border-border/50 pb-3">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Nome do Lead</span>
                  <span className="font-medium">{leadData.name}</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-border/50 pb-3">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Origem</span>
                  <span className="font-medium">{leadData.origin}</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-border/50 pb-3">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">E-mail</span>
                  <span className="font-medium">{leadData.email}</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-border/50 pb-3">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Telefone</span>
                  <span className="font-medium">{leadData.phone}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Interesse</span>
                  <span className="font-medium">{leadData.interest}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              &quot;Estou interessado em integrar o GraphERP com minha loja Shopify. Gostaria de saber sobre o suporte a múltiplos CNPJs.&quot;
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-primary font-bold">
              <History className="h-4 w-4" />
              Última interação {leadData.lastInteraction}
            </div>
          </div>
        </div>

        {/* Right Column: Conversion Form */}
        <div className="lg:col-span-8">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-bold">Dados para Cadastro de Cliente</CardTitle>
              </div>
              <Tabs value={personType} onValueChange={setPersonType} className="w-full md:w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pf" className="gap-2">
                    <User className="h-4 w-4" />
                    Pessoa Física
                  </TabsTrigger>
                  <TabsTrigger value="pj" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    Pessoa Jurídica
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleConvert}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{personType === 'pf' ? 'Nome Completo' : 'Razão Social'}</Label>
                    <Input id="name" defaultValue={leadData.name} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doc">{personType === 'pf' ? 'CPF' : 'CNPJ'}</Label>
                    <Input id="doc" placeholder={personType === 'pf' ? "000.000.000-00" : "00.000.000/0000-00"} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail de Faturamento</Label>
                    <Input id="email" type="email" defaultValue={leadData.email} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone Principal</Label>
                    <Input id="phone" defaultValue={leadData.phone} className="h-12" />
                  </div>
                </div>

                <div className="border-t border-border/50 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input id="cep" placeholder="00000-000" className="h-12" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input id="address" placeholder="Rua, Avenida..." className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input id="neighborhood" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input id="city" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input id="state" className="h-12" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Switch id="notify" defaultChecked />
                  <Label htmlFor="notify" className="text-sm text-muted-foreground cursor-pointer">
                    Notificar cliente via e-mail sobre a criação da conta e acesso ao portal.
                  </Label>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-border/50">
                  <Button type="submit" className="flex-1 h-14 text-base font-bold gap-2 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <UserPlus className="h-5 w-5" />
                    Confirmar Conversão e Criar Cliente
                  </Button>
                  <Link href="/leads" className="md:w-auto">
                    <Button variant="ghost" type="button" className="w-full h-14 px-8 font-bold">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
