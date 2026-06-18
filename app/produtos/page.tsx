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
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Image as ImageIcon
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
import Link from 'next/link'
import { toast } from "sonner"
import useSWR from 'swr'
import { getProdutos, deleteProduto as deleteProdutoAction } from '@/app/actions/produtos'

type Produto = {
  id: string
  nome: string
  descricao: string
  precoVenda: number
  categoria: string
}

export default function ProdutosPage() {
  const { data: produtos = [], mutate, isLoading } = useSWR('produtos', getProdutos)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProdutos = (produtos as Produto[]).filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.categoria || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    const res = await deleteProdutoAction(id)
    if (res.success) {
      mutate()
      toast.error("Item removido do catálogo")
    } else {
      toast.error(res.error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos e Serviços</h1>
          <p className="text-muted-foreground">Gerencie o catálogo de itens e serviços da sua gráfica digital.</p>
        </div>
        
        <Link href="/produtos/novo">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Cadastro
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar itens..." 
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
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço Base</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead className="text-center">E-commerce</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    Carregando produtos...
                  </TableCell>
                </TableRow>
              ) : filteredProdutos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              ) : filteredProdutos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border/50">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{p.nome}</p>
                        <p className="text-xs text-muted-foreground">{p.descricao}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">
                      Produto
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.categoria}</TableCell>
                  <TableCell className="font-semibold">R$ {p.precoVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <span className="text-emerald-500 font-medium">
                      Disponível
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <button className="text-primary hover:opacity-80 transition-opacity">
                      <Eye className="h-5 w-5" />
                    </button>
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
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive gap-2" onClick={() => handleDelete(p.id)}>
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
