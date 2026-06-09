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
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  FileText,
  CheckCircle2,
  XCircle,
  Clock
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
import { toast } from "sonner"
import Link from 'next/link'
import useSWR from 'swr'
import { getOrcamentos, updateOrcamentoStatus, deleteOrcamento as deleteOrcamentoAction } from '@/app/actions/orcamentos'

type Orcamento = {
  id: string
  numero: string
  cliente?: { nome: string }
  dataEmissao: Date
  totalFinal: number
  status: string
  itens: any[]
}

export default function OrcamentosPage() {
  const { data: orcamentos = [], mutate, isLoading } = useSWR('orcamentos', getOrcamentos)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrcamentos = (orcamentos as Orcamento[]).filter(orc => 
    (orc.cliente?.nome || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    orc.numero.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    const res = await deleteOrcamentoAction(id)
    if (res.success) {
      mutate()
      toast.success("Orçamento excluído")
    } else {
      toast.error(res.error)
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    const res = await updateOrcamentoStatus(id, status)
    if (res.success) {
      mutate()
      toast.success(`Status atualizado para ${status}`)
    } else {
      toast.error(res.error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orçamentos</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe todos os orçamentos emitidos.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          
          <Link href="/orcamentos/novo">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Orçamento
            </Button>
          </Link>
        </div>
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                <TableHead>Data</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    Carregando orçamentos...
                  </TableCell>
                </TableRow>
              ) : filteredOrcamentos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    Nenhum orçamento encontrado.
                  </TableCell>
                </TableRow>
              ) : filteredOrcamentos.map((orc) => (
                <TableRow key={orc.id}>
                  <TableCell className="font-medium">{orc.numero}</TableCell>
                  <TableCell>{orc.cliente?.nome || "Cliente não identificado"}</TableCell>
                  <TableCell>{new Date(orc.dataEmissao).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{orc.itens.length}</TableCell>
                  <TableCell>R$ {orc.totalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <Badge variant={
                      orc.status === "Aprovado" ? "default" : 
                      orc.status === "Pendente" ? "secondary" : 
                      orc.status === "Enviado" ? "outline" : "destructive"
                    }>
                      {orc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <FileText className="h-4 w-4" /> Gerar PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2" onClick={() => handleUpdateStatus(orc.id, "Aprovado")}>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Aprovar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2" onClick={() => handleUpdateStatus(orc.id, "Recusado")}>
                            <XCircle className="h-4 w-4 text-destructive" /> Recusar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2" onClick={() => handleUpdateStatus(orc.id, "Pendente")}>
                            <Clock className="h-4 w-4 text-amber-500" /> Pendente
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(orc.id)}>
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
