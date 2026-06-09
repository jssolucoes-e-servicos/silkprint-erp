'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { createCliente } from "@/app/actions/orcamentos"
import { useState } from "react"

export default function NovoClientePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      nome: formData.get('name') as string,
      documento: formData.get('doc') as string,
      email: formData.get('email') as string,
      telefone: formData.get('phone') as string,
    }

    const res = await createCliente(data)
    
    if (res.success) {
      toast.success("Cliente cadastrado com sucesso!")
      router.push("/clientes")
    } else {
      toast.error(res.error || "Erro ao cadastrar cliente")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/clientes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Cadastro de Novo Cliente</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados Básicos</CardTitle>
              <CardDescription>Informações principais da empresa ou pessoa física.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Cliente</Label>
                  <Select defaultValue="pj">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pj">Pessoa Jurídica (CNPJ)</SelectItem>
                      <SelectItem value="pf">Pessoa Física (CPF)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc">CNPJ / CPF</Label>
                  <Input id="doc" name="doc" placeholder="00.000.000/0000-00" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Razão Social / Nome Completo</Label>
                  <Input id="name" name="name" placeholder="Ex: Gráfica Silva Ltda" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fantasy">Nome Fantasia</Label>
                  <Input id="fantasy" name="fantasy" placeholder="Ex: Gráfica Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ie">Inscrição Estadual</Label>
                  <Input id="ie" name="ie" placeholder="Isento ou número" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contato e Endereço</CardTitle>
              <CardDescription>Onde e como falar com o cliente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact">Pessoa de Contato</Label>
                  <Input id="contact" name="contact" placeholder="Ex: João Silva" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail Financeiro</Label>
                  <Input id="email" name="email" type="email" placeholder="financeiro@empresa.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone Principal</Label>
                  <Input id="phone" name="phone" placeholder="(11) 3333-4444" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input id="whatsapp" name="whatsapp" placeholder="(11) 99999-9999" />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" placeholder="00000-000" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Logradouro</Label>
                  <Input id="address" placeholder="Rua, Avenida, etc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input id="number" placeholder="123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input id="complement" placeholder="Sala, Bloco, etc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input id="neighborhood" placeholder="Bairro" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" placeholder="Cidade" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input id="state" placeholder="UF" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/clientes">
              <Button variant="outline" type="button">Cancelar</Button>
            </Link>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Finalizar Cadastro
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
