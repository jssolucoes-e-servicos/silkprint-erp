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
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Trash2,
  Edit,
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
import { getContasPagar, createContaPagar, updateContaPagarStatus, deleteContaPagar } from '@/app/actions/financeiro'

type Conta = {
  id: string
  description: string
  supplier: string
  dueDate: string | Date
  amount: number
  status: string
  category: string
}

export default function ContasPagarPage() {
  const { data: contas = [], mutate, isLoading } = useSWR('contas-pagar', getContasPagar)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newConta, setNewConta] = useState({ description: "", supplier: "", amount: "", dueDate: "", category: "Fixo" })

  const filteredContas = (contas as Conta[]).filter(c => 
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    const res = await deleteContaPagar(id)
    if (res.success) {
      mutate()
      toast.error("Conta removida")
    } else {
      toast.error(res.error)
    }
  }

  const markAsPaid = async (id: string) => {
    const res = await updateContaPagarStatus(id, "Pago")
    if (res.success) {
      mutate()
      toast.success("Conta marcada como paga")
    } else {
      toast.error(res.error)
    }
  }

  const handleAddConta = async () => {
    if (!newConta.description || !newConta.amount || !newConta.dueDate) {
      toast.error("Preencha os campos obrigatórios")
      return
    }

    const res = await createContaPagar(newConta)
    if (res.success) {
      mutate()
      setIsAddDialogOpen(false)
      setNewConta({ description: "", supplier: "", amount: "", dueDate: "", category: "Fixo" })
      toast.success("Nova conta a pagar registrada")
    } else {
      toast.error(res.error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas a Pagar</h1>
          <p className="text-muted-foreground">Gerencie suas obrigações financeiras e vencimentos.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="h-4 w-4" />
            Nova Conta
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Conta a Pagar</DialogTitle>
              <DialogDescription>Registre uma nova obrigação financeira.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="desc">Descrição</Label>
                <Input 
                  id="desc" 
                  placeholder="Ex: Aluguel" 
                  value={newConta.description}
                  onChange={e => setNewConta({...newConta, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="supp">Fornecedor</Label>
                <Input 
                  id="supp" 
                  placeholder="Nome do fornecedor" 
                  value={newConta.supplier}
                  onChange={e => setNewConta({...newConta, supplier: e.target.value})}
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
              <Button onClick={handleAddConta}>Registrar Conta</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {contas.filter((c: any) => c.status === "Pendente").reduce((acc: number, curr: any) => acc + curr.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Contas aguardando pagamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Atrasado</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
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
            <CardTitle className="text-sm font-medium">Total Pago (Mês)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              R$ {contas.filter((c: any) => c.status === "Pago").reduce((acc: number, curr: any) => acc + curr.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Total liquidado</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por descrição ou fornecedor..." 
                className="pl-8" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    Carregando contas...
                  </TableCell>
                </TableRow>
              ) : filteredContas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    Nenhuma conta encontrada.
                  </TableCell>
                </TableRow>
              ) : filteredContas.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.description}</TableCell>
                  <TableCell>{c.supplier}</TableCell>
                  <TableCell>{new Date(c.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>R$ {c.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{c.category}</TableCell>
                  <TableCell>
                    <Badge variant={
                      c.status === "Pago" ? "default" : 
                      c.status === "Atrasado" ? "destructive" : "secondary"
                    }>
                      {c.status}
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
                        <DropdownMenuItem className="gap-2" onClick={() => markAsPaid(c.id)}>
                          <DollarSign className="h-4 w-4" /> Marcar como Pago
                        </DropdownMenuItem>
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
