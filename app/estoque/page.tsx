'use client'

import { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  AlertTriangle, 
  ArrowUpDown,
  MoreHorizontal,
  Trash2,
  Edit,
  History,
  ArrowRightLeft
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type Produto = {
  id: number
  name: string
  category: string
  stock: number
  minStock: number
  unit: string
  price: string
}

const initialProdutos: Produto[] = [
  { id: 1, name: "Papel Couché 150g A4", category: "Papel", stock: 1500, minStock: 500, unit: "Folhas", price: "R$ 0,45" },
  { id: 2, name: "Tinta Cyan 1L", category: "Insumos", stock: 3, minStock: 5, unit: "Litros", price: "R$ 120,00" },
  { id: 3, name: "Papel Adesivo Brilho", category: "Papel", stock: 200, minStock: 100, unit: "Folhas", price: "R$ 1,20" },
  { id: 4, name: "Tinta Magenta 1L", category: "Insumos", stock: 2, minStock: 5, unit: "Litros", price: "R$ 120,00" },
  { id: 5, name: "Lona Front Light 440g", category: "Lona", stock: 50, minStock: 20, unit: "Metros", price: "R$ 15,00" },
]

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>(initialProdutos)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newProd, setNewProd] = useState({ name: "", category: "Papel", stock: 0, minStock: 0, unit: "Folhas", price: "" })

  const filteredProdutos = produtos.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const deleteProduto = (id: number) => {
    setProdutos(prev => prev.filter(p => p.id !== id))
    toast.error("Produto removido do estoque")
  }

  const addProduto = () => {
    if (!newProd.name || !newProd.price) {
      toast.error("Preencha os campos obrigatórios")
      return
    }

    const prod: Produto = {
      id: Math.max(...produtos.map(p => p.id)) + 1,
      name: newProd.name,
      category: newProd.category,
      stock: Number(newProd.stock),
      minStock: Number(newProd.minStock),
      unit: newProd.unit,
      price: `R$ ${newProd.price}`
    }

    setProdutos(prev => [...prev, prod])
    setIsAddDialogOpen(false)
    setNewProd({ name: "", category: "Papel", stock: 0, minStock: 0, unit: "Folhas", price: "" })
    toast.success("Produto adicionado ao inventário")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
          <p className="text-muted-foreground">Controle de materiais e insumos da produção.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="h-4 w-4" />
            Novo Produto
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Produto no Estoque</DialogTitle>
              <DialogDescription>Cadastre um novo material ou insumo.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Papel Couché 150g" 
                  value={newProd.name}
                  onChange={e => setNewProd({...newProd, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input 
                    id="category" 
                    placeholder="Papel, Tinta, etc" 
                    value={newProd.category}
                    onChange={e => setNewProd({...newProd, category: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Preço Unitário</Label>
                  <Input 
                    id="price" 
                    placeholder="0,00" 
                    value={newProd.price}
                    onChange={e => setNewProd({...newProd, price: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="stock">Estoque Inicial</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    value={newProd.stock}
                    onChange={e => setNewProd({...newProd, stock: parseInt(e.target.value)})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="min">Estoque Mínimo</Label>
                  <Input 
                    id="min" 
                    type="number" 
                    value={newProd.minStock}
                    onChange={e => setNewProd({...newProd, minStock: parseInt(e.target.value)})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unidade</Label>
                  <Input 
                    id="unit" 
                    placeholder="Folhas, L, etc" 
                    value={newProd.unit}
                    onChange={e => setNewProd({...newProd, unit: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
              <Button onClick={addProduto}>Salvar Produto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{produtos.length}</div>
            <p className="text-xs text-muted-foreground">Em {new Set(produtos.map(p => p.category)).size} categorias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {produtos.filter(p => p.stock <= p.minStock).length} itens
            </div>
            <p className="text-xs text-muted-foreground">Necessitam reposição urgente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor em Estoque</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 15.430,00</div>
            <p className="text-xs text-muted-foreground">Baseado no preço de custo</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produto..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Estoque Atual</TableHead>
                <TableHead>Mínimo</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Preço Unit.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProdutos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>{p.minStock}</TableCell>
                  <TableCell>{p.unit}</TableCell>
                  <TableCell>{p.price}</TableCell>
                  <TableCell>
                    <Badge variant={p.stock <= p.minStock ? "destructive" : "default"}>
                      {p.stock <= p.minStock ? "Baixo" : "Normal"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                          <ArrowRightLeft className="h-4 w-4" /> Ajustar Estoque
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <History className="h-4 w-4" /> Histórico
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive gap-2" onClick={() => deleteProduto(p.id)}>
                          <Trash2 className="h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
