'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableFooter
} from "@/components/ui/table"
import { 
  Plus, 
  ArrowLeft, 
  Image as ImageIcon, 
  Trash2, 
  Info, 
  Tag, 
  Package, 
  Save,
  X
} from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import Image from 'next/image'
import { createProduto } from '@/app/actions/produtos'

export default function NovoProdutoPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [insumos, setInsumos] = useState([
    { id: 1, name: "Papel Couché 250g - Fosco", qty: 1, unit: "FL", cost: 1.45 },
    { id: 2, name: "Tinta CMYK - Premium Ink", qty: 0.05, unit: "ML", cost: 0.12 },
    { id: 3, name: "Laminação BOPP Brilho", qty: 0.25, unit: "M2", cost: 0.80 },
  ])

  const totalCost = insumos.reduce((acc, curr) => acc + curr.cost, 0)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = document.getElementById('product-form') as HTMLFormElement
    const formData = new FormData(form)
    
    const data = {
      nome: formData.get('name') as string,
      descricao: formData.get('description') as string,
      precoCusto: totalCost,
      precoVenda: parseFloat(formData.get('price') as string || "0"),
      categoria: formData.get('category') as string || "digital",
    }

    const res = await createProduto(data)
    
    if (res.success) {
      toast.success("Produto salvo com sucesso!")
      router.push('/produtos')
    } else {
      toast.error(res.error || "Erro ao salvar produto")
      setIsSubmitting(false)
    }
  }

  const removeInsumo = (id: number) => {
    setInsumos(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 border-b border-border/50">
        <div className="flex items-center gap-4">
          <Link href="/produtos">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Novo Produto / Serviço</h1>
            <p className="text-sm text-muted-foreground">Cadastre um novo item no catálogo da sua gráfica.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/produtos">
            <Button variant="ghost">Cancelar</Button>
          </Link>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Produto
          </Button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSave} className="grid gap-8">
        {/* Section 1: Informações Básicas */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-border/50 pb-4">
            <Info className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">1. Informações Básicas</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="name">Nome do Produto/Serviço</Label>
              <Input id="name" name="name" placeholder="Ex: Cartão de Visita Couché 300g 4x4" className="h-12" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU / Código Interno</Label>
              <Input id="sku" name="sku" placeholder="PROD-00123" className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select defaultValue="digital" name="category">
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital">Impressão Digital</SelectItem>
                  <SelectItem value="offset">Offset</SelectItem>
                  <SelectItem value="brindes">Brindes</SelectItem>
                  <SelectItem value="design">Serviços de Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Descrição Detalhada</Label>
              <Textarea id="description" name="description" placeholder="Descreva as especificações do produto para o catálogo..." rows={4} />
            </div>
          </div>
        </div>

        {/* Section 2: Configuração de Venda */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-border/50 pb-4">
            <Tag className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">2. Configuração de Venda</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Preço de Venda (R$)</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">R$</span>
                <Input id="price" name="price" type="number" step="0.01" className="pl-10 h-12" defaultValue="0.00" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="margin">Margem de Lucro Esperada (%)</Label>
              <div className="relative">
                <Input id="margin" type="number" step="1" className="pr-10 h-12" defaultValue="30" />
                <span className="absolute right-3 top-3 text-muted-foreground">%</span>
              </div>
            </div>
            <div className="flex items-center gap-3 h-full pt-6">
              <Switch id="ecommerce" defaultChecked />
              <Label htmlFor="ecommerce" className="cursor-pointer">Exibir no E-commerce</Label>
            </div>
          </div>
        </div>

        {/* Section 3: Composição Técnica */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">3. Composição Técnica (Insumos)</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-primary font-bold gap-1">
              <Plus className="h-4 w-4" /> Adicionar Insumo
            </Button>
          </div>
          <div className="overflow-hidden border border-border/50 rounded-lg">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Insumo</TableHead>
                  <TableHead className="text-center">Quantidade</TableHead>
                  <TableHead className="text-center">Unidade</TableHead>
                  <TableHead className="text-right">Custo Estimado</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {insumos.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.name}</TableCell>
                    <TableCell className="text-center">
                      <Input type="number" defaultValue={i.qty} className="w-20 mx-auto text-center h-8" />
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">{i.unit}</TableCell>
                    <TableCell className="text-right">R$ {i.cost.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => removeInsumo(i.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="bg-muted/50">
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">Custo Total de Produção:</TableCell>
                  <TableCell className="text-right font-bold text-primary">R$ {totalCost.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>

        {/* Section 4: Mídia */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-border/50 pb-4">
            <ImageIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">4. Mídia (E-commerce)</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-64 aspect-square rounded-xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground p-4 cursor-pointer hover:bg-muted/80 transition-colors">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-xs text-center font-medium">Arraste a foto do produto aqui ou clique para buscar</p>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="font-medium text-sm">Galeria de Imagens</h4>
                <p className="text-xs text-muted-foreground">Envie até 5 imagens. Recomendado: 1000x1000px, fundo branco ou neutro.</p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <div className="aspect-square rounded-lg bg-muted border border-border overflow-hidden relative group">
                  <Image 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm8noKhETCDSfVUcG3wZEgPPVBQBxkxx4-KoSEjUXqGTx-jUo199l2sywQaQYuFpkexdO-AEtmP15Ejfnm8ghNejrnPUzIk7kZk1J55yt3-G89qV98Iq7wMhkFpjUygYG2L73WG9nnl7c0KtVssEJHx0RxBvrN2PcC5CZrBlcAjIADdpDx8TTl_JiHwYR3GxhAE3xzBKX471fHE0pmP_NxvZmThKviSVO8-bxGoagq9c0dLSZwSpIinXDkIGZ5bXyRRbrmILMorto" 
                    alt="Product preview"
                    fill
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="ghost" size="icon" className="text-white hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="aspect-square rounded-lg bg-muted border-2 border-dashed border-border flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors">
                  <Plus className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
