'use client'

import { useState } from 'react'
import { 
  UserPlus, 
  Search, 
  Package, 
  PlusCircle, 
  Trash2, 
  Sparkles, 
  MessageSquare, 
  Calculator, 
  CheckCircle2, 
  Save, 
  FileText, 
  MessageCircle,
  ChevronRight,
  ArrowLeft,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type ItemOrcamento = {
  id: string
  product: string
  quantity: number
  specs: string
  cost: number
  suggestedPrice: number
  finishes: string[]
}

const availableFinishes = [
  { id: 'refile', label: 'Refile Especial (+R$ 0,02/un)', price: 0.02 },
  { id: 'lamination', label: 'Laminação Fosca (+R$ 0,05/un)', price: 0.05 },
  { id: 'varnish', label: 'Verniz Localizado (+R$ 0,08/un)', price: 0.08 },
  { id: 'hole', label: 'Furo Superior (+R$ 0,01/un)', price: 0.01 },
]

// Force re-evaluation check
import { createOrcamento } from '@/app/actions/orcamentos'
import { getClientes } from '@/app/actions/clientes'
import useSWR from 'swr'

export default function NovoOrcamentoPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: clientes = [] } = useSWR('clientes', getClientes)
  const [selectedCliente, setSelectedCliente] = useState<any>(null)
  const [clientSearch, setClientSearch] = useState('')
  
  const [items, setItems] = useState<ItemOrcamento[]>([
    {
      id: '1',
      product: 'Cartão de Visita 4x4 - Couché 300g',
      quantity: 1000,
      specs: '',
      cost: 0.12,
      suggestedPrice: 0.35,
      finishes: ['refile']
    }
  ])

  const filteredClientes = (clientes as any[]).filter(c => 
    c.nome.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (c.documento || "").includes(clientSearch)
  )

  const [notes, setNotes] = useState('')
  const [markup, setMarkup] = useState(65)
  const [freight, setFreight] = useState(15)
  const [discounts, setDiscounts] = useState(0)

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Math.random().toString(36).substr(2, 9),
        product: 'Flyer A5 - Couché 115g',
        quantity: 1000,
        specs: '',
        cost: 0.08,
        suggestedPrice: 0.25,
        finishes: []
      }
    ])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const toggleFinish = (itemId: string, finishId: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const finishes = item.finishes.includes(finishId)
          ? item.finishes.filter(f => f !== finishId)
          : [...item.finishes, finishId]
        return { ...item, finishes }
      }
      return item
    }))
  }

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => {
      const finishPrice = item.finishes.reduce((fAcc, fId) => {
        const finish = availableFinishes.find(f => f.id === fId)
        return fAcc + (finish?.price || 0)
      }, 0)
      return acc + (item.suggestedPrice + finishPrice) * item.quantity
    }, 0)
  }

  const calculateTotalCost = () => {
    return items.reduce((acc, item) => acc + item.cost * item.quantity, 0)
  }

  const totalFinal = calculateSubtotal() + freight - discounts

  const handleFinalize = async () => {
    if (items.length === 0) {
      toast.error("Adicione pelo menos um item ao orçamento")
      return
    }

    setIsSubmitting(true)
    
    const orcamentoData = {
      clienteId: selectedCliente?.id,
      itens: items.map(item => ({
        produtoNome: item.product,
        quantidade: item.quantity,
        especificacoes: item.specs,
        custoUnitario: item.cost,
        precoSugerido: item.suggestedPrice,
        acabamentos: item.finishes
      })),
      custoTotal: calculateTotalCost(),
      markup: markup,
      frete: freight,
      descontos: discounts,
      totalFinal: totalFinal,
      observacoes: notes,
      status: "Pendente"
    }

    const res = await createOrcamento(orcamentoData)
    
    if (res.success) {
      toast.success("Orçamento finalizado com sucesso!")
      router.push('/orcamentos')
    } else {
      toast.error(res.error || "Erro ao salvar orçamento")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/orcamentos" className="hover:text-primary transition-colors">Orçamentos</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Novo Orçamento</span>
      </div>

      {/* Page Title Area */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">Novo Orçamento</h1>
        <p className="text-muted-foreground">Preencha os dados abaixo para gerar um orçamento técnico detalhado.</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* 1. Customer Selection */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <UserPlus className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-bold">1. Identificação do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Localizar Cliente</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    className="pl-10 h-12 bg-muted/50 border-border/50 focus:ring-1 focus:ring-primary" 
                    placeholder="Nome, CPF/CNPJ ou Email..." 
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                  />
                  {clientSearch && filteredClientes.length > 0 && !selectedCliente && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-card border border-border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                      {filteredClientes.map(cliente => (
                        <button
                          key={cliente.id}
                          className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex flex-col"
                          onClick={() => {
                            setSelectedCliente(cliente)
                            setClientSearch(cliente.nome)
                          }}
                        >
                          <span className="font-bold">{cliente.nome}</span>
                          <span className="text-xs text-muted-foreground">{cliente.documento}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-end gap-3">
                <Button variant="outline" className="h-12 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 font-semibold">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Novo Cliente Rápido
                </Button>
                <div className="flex-1 h-12 bg-muted/30 border border-dashed border-border/50 rounded-lg px-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{selectedCliente ? selectedCliente.nome : "Nenhum cliente selecionado"}</span>
                    {selectedCliente && <span className="text-[10px] text-muted-foreground">{selectedCliente.documento}</span>}
                  </div>
                  {selectedCliente && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-auto h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        setSelectedCliente(null)
                        setClientSearch('')
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Item Selection */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-bold">2. Itens do Orçamento</CardTitle>
            </div>
            <Button onClick={addItem} className="bg-primary text-primary-foreground hover:brightness-110 font-bold">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Produto/Serviço
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border border-border/50 rounded-xl p-5 bg-muted/20">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-start gap-6">
                    <div className="flex-1 min-w-[280px] space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase">Produto / Serviço</Label>
                      <Select defaultValue={item.product}>
                        <SelectTrigger className="bg-background border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cartão de Visita 4x4 - Couché 300g">Cartão de Visita 4x4 - Couché 300g</SelectItem>
                          <SelectItem value="Flyer A5 - Couché 115g">Flyer A5 - Couché 115g</SelectItem>
                          <SelectItem value="Banner Lona 440g - Acabamento Ilhós">Banner Lona 440g - Acabamento Ilhós</SelectItem>
                          <SelectItem value="Criação de Logotipo">Criação de Logotipo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24 space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase">Qtd.</Label>
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        className="bg-background border-border/50"
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setItems(items.map(i => i.id === item.id ? { ...i, quantity: val } : i))
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-[200px] space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase">Especificações Técnicas</Label>
                      <Input 
                        placeholder="Papel, cores, acabamento..." 
                        className="bg-background border-border/50"
                        value={item.specs}
                        onChange={(e) => {
                          setItems(items.map(i => i.id === item.id ? { ...i, specs: e.target.value } : i))
                        }}
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase">Custo (Un.)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R$</span>
                        <Input 
                          readOnly 
                          value={item.cost.toFixed(2)} 
                          className="pl-8 bg-muted/50 border-border/50 text-muted-foreground cursor-not-allowed" 
                        />
                      </div>
                    </div>
                    <div className="w-32 space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase">Preço Sugerido</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R$</span>
                        <Input 
                          type="number" 
                          step="0.01"
                          value={item.suggestedPrice} 
                          className="pl-8 bg-background border-border/50 font-bold text-primary"
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0
                            setItems(items.map(i => i.id === item.id ? { ...i, suggestedPrice: val } : i))
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center self-end h-10">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Acabamentos Section */}
                  <div className="pt-4 border-t border-border/50">
                    <Label className="text-xs font-bold text-muted-foreground uppercase mb-3 flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      Acabamentos (Opcionais)
                    </Label>
                    <div className="flex flex-wrap gap-3">
                      {availableFinishes.map((finish) => (
                        <label 
                          key={finish.id}
                          className="flex items-center gap-2 bg-background border border-border/50 px-3 py-1.5 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                        >
                          <Checkbox 
                            checked={item.finishes.includes(finish.id)}
                            onCheckedChange={() => toggleFinish(item.id, finish.id)}
                          />
                          <span className="text-xs font-medium">{finish.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="border-2 border-dashed border-border/50 rounded-xl p-8 flex items-center justify-center text-muted-foreground text-sm">
                Adicione mais itens ao orçamento clicando no botão acima
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3. Notes */}
          <Card className="lg:col-span-2 border-border/50 bg-card/50 flex flex-col">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-bold">3. Observações Internas</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <Textarea 
                className="w-full h-full min-h-[160px] bg-muted/30 border-border/50 focus:ring-1 focus:ring-primary resize-none" 
                placeholder="Ex: Prazo de entrega urgente, solicitar prova física ao cliente..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* 4. Calculation & Totals */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
              <Calculator className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-bold">4. Resumo de Valores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Custo Total de Produção</span>
                <span className="font-medium">R$ {calculateTotalCost().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Markup / Margem (%)</span>
                <div className="w-20">
                  <Input 
                    type="number" 
                    value={markup} 
                    className="h-8 text-right bg-background border-border/50"
                    onChange={(e) => setMarkup(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Valor do Frete (R$)</span>
                <div className="w-24">
                  <Input 
                    type="number" 
                    value={freight} 
                    className="h-8 text-right bg-background border-border/50 font-medium"
                    onChange={(e) => setFreight(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Descontos</span>
                <div className="w-24">
                  <Input 
                    type="number" 
                    value={discounts} 
                    className="h-8 text-right bg-background border-border/50"
                    onChange={(e) => setDiscounts(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <hr className="border-border/50" />
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold">Total Final</span>
                <span className="text-2xl font-black text-primary">R$ {totalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="pt-6 flex flex-col gap-3">
                <Button 
                  onClick={handleFinalize}
                  disabled={isSubmitting}
                  className="w-full h-12 bg-primary text-primary-foreground hover:brightness-110 font-black uppercase text-sm shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Processando...
                    </div>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Finalizar Orçamento
                    </>
                  )}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-10 bg-muted/50 border-border/50 text-xs font-bold">
                    <Save className="mr-1 h-4 w-4" />
                    Rascunho
                  </Button>
                  <Button variant="outline" className="h-10 bg-muted/50 border-border/50 text-xs font-bold">
                    <FileText className="mr-1 h-4 w-4" />
                    Gerar PDF
                  </Button>
                </div>
                <Button variant="outline" className="w-full h-10 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/20 text-xs font-bold">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Enviar por WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-border/50 text-[10px] text-muted-foreground uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Operador: admin_joao</span>
          </div>
          <div>Filial: Matriz - SP</div>
        </div>
        <div className="flex items-center gap-4">
          <span>IP: 189.12.45.XX</span>
          <span>Versão 4.2.0-stable</span>
        </div>
      </div>
    </div>
  )
}
