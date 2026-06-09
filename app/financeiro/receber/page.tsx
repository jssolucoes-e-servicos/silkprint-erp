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
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  CheckCircle2, 
  Edit, 
  MoreVertical,
  Trash2,
  DollarSign
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

import useSWR from 'swr'
import { getContasReceber, createContaReceber, updateContaReceberStatus, deleteContaReceber } from '@/app/actions/financeiro'

type ContaReceber = {
  id: string
  client: string
  description: string
  dueDate: string | Date
  amount: number
  status: string
}

export default function ContasReceberPage() {
  const { data: contas = [], mutate, isLoading } = useSWR('contas-receber', getContasReceber)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newConta, setNewConta] = useState({ client: "", description: "", amount: "", dueDate: "", category: "Venda" })

  const filteredContas = (contas as any[]).filter(c => 
    c.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const markAsPaid = async (id: string) => {
    const res = await updateContaReceberStatus(id, "Recebido")
    if (res.success) {
      mutate()
      toast.success("Recebimento confirmado!")
    } else {
      toast.error(res.error)
    }
  }

  const handleDelete = async (id: string) => {
    const res = await deleteContaReceber(id)
    if (res.success) {
      mutate()
      toast.error("Lançamento removido")
    } else {
      toast.error(res.error)
    }
  }

  const handleAddConta = async () => {
    if (!newConta.client || !newConta.amount || !newConta.dueDate) {
      toast.error("Preencha os campos obrigatórios")
      return
    }

    const res = await createContaReceber(newConta)
    if (res.success) {
      mutate()
      setIsAddDialogOpen(false)
      setNewConta({ client: "", description: "", amount: "", dueDate: "", category: "Venda" })
      toast.success("Novo lançamento registrado")
    } else {
      toast.error(res.error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas a Receber</h1>
          <p className="text-muted-foreground">Gerencie seus recebimentos e fluxo de caixa.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger render={<Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Lançamento
          </Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Lançamento a Receber</DialogTitle>
              <DialogDescription>Registre um novo valor a ser recebido.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="cust">Cliente</Label>
                <Input 
                  id="cust" 
                  placeholder="Nome do cliente" 
                  value={newConta.client}
                  onChange={e => setNewConta({...newConta, client: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Descrição</Label>
                <Input 
                  id="desc" 
                  placeholder="Ex: Pedido #123" 
                  value={newConta.description}
                  onChange={e => setNewConta({...newConta, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Valor (R$)</Label>
                  <Input 
                    id="amount" 
                    placeholder="0,00" 
                    value={newConta.amount}
                    onChange={e => setNewConta({...newConta, amount: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Vencimento</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={newConta.dueDate}
                    onChange={e => setNewConta({...newConta, dueDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddConta}>Registrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total a Receber</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {contas.filter((c: any) => c.status === "Pendente").reduce((acc: number, curr: any) => acc + curr.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando recebimento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recebido no Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {contas.filter((c: any) => c.status === "Recebido").reduce((acc: number, curr: any) => acc + curr.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Total liquidado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Atraso</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R$ {contas.filter((c: any) => c.status === "Atrasado").reduce((acc: number, curr: any) => acc + curr.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{contas.filter((c: any) => c.status === "Atrasado").length} conta(s) em atraso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Geral</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {contas.reduce((acc: number, curr: any) => acc + curr.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Soma de todos os lançamentos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por cliente ou ID..." 
                className="pl-8" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    Carregando lançamentos...
                  </TableCell>
                </TableRow>
              ) : filteredContas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    Nenhum lançamento encontrado.
                  </TableCell>
                </TableRow>
              ) : filteredContas.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.id.substring(0, 8)}</TableCell>
                  <TableCell>{c.client}</TableCell>
                  <TableCell className="text-muted-foreground">{c.description}</TableCell>
                  <TableCell>{new Date(c.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="font-semibold">R$ {c.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <Badge variant={
                      c.status === "Recebido" ? "default" : 
                      c.status === "Atrasado" ? "destructive" : "secondary"
                    }>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>} />
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        {c.status !== "Recebido" && (
                          <DropdownMenuItem className="gap-2" onClick={() => markAsPaid(c.id)}>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Confirmar Recebimento
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive gap-2" onClick={() => handleDelete(c.id)}>
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
