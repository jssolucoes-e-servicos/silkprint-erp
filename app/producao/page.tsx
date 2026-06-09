'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  MoreHorizontal, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  ArrowRightLeft,
  Edit2
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

import useSWR from 'swr'
import { getTarefas, createTarefa, updateTarefaStatus, deleteTarefa } from '@/app/actions/producao'

type Task = {
  id: string
  title: string
  priority: string
  deadline: string
  customer: string
  status: string
}

const columns = ["Pendente", "Em Produção", "Revisão", "Concluído"]

export default function ProducaoPage() {
  const { data: allTasks = [], mutate, isLoading } = useSWR('tarefas', getTarefas)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", customer: "", priority: "Média", deadline: "" })

  // Group tasks by status
  const tasksByStatus: { [key: string]: Task[] } = columns.reduce((acc, col) => {
    acc[col] = (allTasks as any[]).filter(t => t.status === col)
    return acc
  }, {} as any)

  const moveTask = async (taskId: string, toCol: string) => {
    const res = await updateTarefaStatus(taskId, toCol)
    if (res.success) {
      mutate()
      toast.success(`Tarefa movida para ${toCol}`)
    } else {
      toast.error(res.error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    const res = await deleteTarefa(taskId)
    if (res.success) {
      mutate()
      toast.error("Tarefa excluída")
    } else {
      toast.error(res.error)
    }
  }

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.customer) {
      toast.error("Preencha os campos obrigatórios")
      return
    }

    const res = await createTarefa(newTask)
    if (res.success) {
      mutate()
      setNewTask({ title: "", customer: "", priority: "Média", deadline: "" })
      setIsAddDialogOpen(false)
      toast.success("Novo pedido adicionado à produção")
    } else {
      toast.error(res.error)
    }
  }

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produção (Kanban)</h1>
          <p className="text-muted-foreground">Gerencie o fluxo de trabalho da sua gráfica em tempo real.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="h-4 w-4" />
            Novo Pedido
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Pedido em Produção</DialogTitle>
              <DialogDescription>Adicione um novo item à fila de produção.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título do Trabalho</Label>
                <Input 
                  id="title" 
                  placeholder="Ex: Cartões de Visita" 
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customer">Cliente</Label>
                <Input 
                  id="customer" 
                  placeholder="Nome do cliente" 
                  value={newTask.customer}
                  onChange={e => setNewTask({...newTask, customer: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select value={newTask.priority} onValueChange={v => setNewTask({...newTask, priority: v || "Média"})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Prazo</Label>
                  <Input 
                    id="deadline" 
                    placeholder="Ex: 3 dias" 
                    value={newTask.deadline}
                    onChange={e => setNewTask({...newTask, deadline: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddTask}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {columns.map((column) => (
          <div key={column} className="flex flex-col gap-4 bg-muted/20 p-4 rounded-2xl border border-border/50">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">{column}</h2>
                <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[10px] font-bold">
                  {tasksByStatus[column]?.length || 0}
                </Badge>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-3 pr-4">
                {isLoading ? (
                  <div className="text-center py-10 text-muted-foreground text-xs">
                    Carregando...
                  </div>
                ) : tasksByStatus[column]?.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground text-xs">
                    Vazio
                  </div>
                ) : tasksByStatus[column]?.map((task) => (
                  <Card key={task.id} className="group hover:border-primary/50 transition-all shadow-sm hover:shadow-md bg-card border-border/50">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
                          {task.title}
                        </CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" />}>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2">
                              <Edit2 className="h-3.5 w-3.5" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Mover para</DropdownMenuLabel>
                              {columns.filter(c => c !== column).map(c => (
                                <DropdownMenuItem key={c} onClick={() => moveTask(task.id, c)} className="gap-2">
                                  <ArrowRightLeft className="h-3.5 w-3.5" /> {c}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive gap-2" onClick={() => handleDeleteTask(task.id)}>
                              <Trash2 className="h-3.5 w-3.5" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/80">{task.customer}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={
                          task.priority === "Alta" ? "destructive" : 
                          task.priority === "Média" ? "default" : "secondary"
                        } className="text-[10px] px-2 py-0 h-5 font-semibold">
                          {task.priority}
                        </Badge>
                        <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                          {column === "Concluído" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          ) : task.priority === "Alta" ? (
                            <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                          ) : (
                            <Clock className="h-3.5 w-3.5" />
                          )}
                          {task.deadline}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  )
}
