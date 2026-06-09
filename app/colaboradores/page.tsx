'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Calendar,
  MoreVertical,
  UserPlus,
  Trash2,
  Edit,
  ShieldCheck,
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

type Colaborador = {
  id: number
  name: string
  role: string
  department: string
  email: string
  phone: string
  status: string
  joinDate: string
}

const initialColaboradores: Colaborador[] = [
  { id: 1, name: "Ricardo Santos", role: "Gerente de Produção", department: "Produção", email: "ricardo@grapherp.com", phone: "(11) 91111-2222", status: "Ativo", joinDate: "2023-01-15" },
  { id: 2, name: "Amanda Lima", role: "Designer Gráfico", department: "Criação", email: "amanda@grapherp.com", phone: "(11) 92222-3333", status: "Ativo", joinDate: "2023-03-10" },
  { id: 3, name: "Bruno Oliveira", role: "Operador de Impressora", department: "Produção", email: "bruno@grapherp.com", phone: "(11) 93333-4444", status: "Ativo", joinDate: "2023-05-20" },
  { id: 4, name: "Carla Souza", role: "Vendedora", department: "Comercial", email: "carla@grapherp.com", phone: "(11) 94444-5555", status: "Férias", joinDate: "2023-02-01" },
  { id: 5, name: "Daniel Costa", role: "Auxiliar Administrativo", department: "Financeiro", email: "daniel@grapherp.com", phone: "(11) 95555-6666", status: "Ativo", joinDate: "2023-08-12" },
]

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>(initialColaboradores)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCol, setNewCol] = useState({ name: "", role: "", department: "Produção", email: "", phone: "" })

  const filteredColaboradores = colaboradores.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const deleteColaborador = (id: number) => {
    setColaboradores(prev => prev.filter(c => c.id !== id))
    toast.error("Colaborador removido da equipe")
  }

  const addColaborador = () => {
    if (!newCol.name || !newCol.role || !newCol.email) {
      toast.error("Preencha os campos obrigatórios")
      return
    }

    const col: Colaborador = {
      id: Math.max(...colaboradores.map(c => c.id)) + 1,
      name: newCol.name,
      role: newCol.role,
      department: newCol.department,
      email: newCol.email,
      phone: newCol.phone,
      status: "Ativo",
      joinDate: new Date().toISOString().split('T')[0]
    }

    setColaboradores(prev => [...prev, col])
    setIsAddDialogOpen(false)
    setNewCol({ name: "", role: "", department: "Produção", email: "", phone: "" })
    toast.success("Novo colaborador adicionado com sucesso")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Colaboradores</h1>
          <p className="text-muted-foreground">Gerencie sua equipe e permissões de acesso.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <UserPlus className="h-4 w-4" />
            Novo Colaborador
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Colaborador</DialogTitle>
              <DialogDescription>Adicione um novo membro à sua equipe.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name" 
                  placeholder="Nome do colaborador" 
                  value={newCol.name}
                  onChange={e => setNewCol({...newCol, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input 
                    id="role" 
                    placeholder="Ex: Designer" 
                    value={newCol.role}
                    onChange={e => setNewCol({...newCol, role: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dept">Departamento</Label>
                  <Input 
                    id="dept" 
                    placeholder="Ex: Produção" 
                    value={newCol.department}
                    onChange={e => setNewCol({...newCol, department: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="email@grapherp.com" 
                    value={newCol.email}
                    onChange={e => setNewCol({...newCol, email: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    placeholder="(11) 99999-9999" 
                    value={newCol.phone}
                    onChange={e => setNewCol({...newCol, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
              <Button onClick={addColaborador}>Cadastrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{colaboradores.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {colaboradores.filter(c => c.status === "Ativo").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Férias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {colaboradores.filter(c => c.status === "Férias").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Novas (Mês)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar colaborador..." 
              className="pl-8" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Cargo / Depto</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredColaboradores.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.iran.liara.run/public/${c.id + 10}`} />
                        <AvatarFallback>{c.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{c.role}</span>
                      <span className="text-xs text-muted-foreground">{c.department}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs gap-1">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {c.email}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      {c.joinDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.status === "Ativo" ? "default" : "secondary"}>
                      {c.status}
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
                          <ShieldCheck className="h-4 w-4" /> Permissões
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Clock className="h-4 w-4" /> Ponto
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive gap-2" onClick={() => deleteColaborador(c.id)}>
                          <Trash2 className="h-4 w-4" /> Desativar
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
