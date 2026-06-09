'use client'

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  FileText, 
  Package, 
  Kanban,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from "lucide-react"
import { StatCard } from '@/components/stat-card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

import useSWR from 'swr'
import { getDashboardStats } from '@/app/actions/dashboard'

export default function DashboardPage() {
  const { data: stats, isLoading } = useSWR('dashboard-stats', getDashboardStats)

  const recentOrders = stats?.recentOrcamentos.map(orc => ({
    id: orc.numero,
    customer: orc.cliente?.nome || "Consumidor Final",
    total: `R$ ${orc.totalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    status: orc.status,
    date: new Date(orc.dataEmissao).toLocaleDateString('pt-BR')
  })) || []

  const chartData = [
    { name: 'Jan', vendas: 4000 },
    { name: 'Fev', vendas: 3000 },
    { name: 'Mar', vendas: 2000 },
    { name: 'Abr', vendas: 2780 },
    { name: 'Mai', vendas: 1890 },
    { name: 'Jun', vendas: 2390 },
    { name: 'Jul', vendas: 3490 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Painel Geral</h1>
        <div className="flex items-center gap-2">
          <Link href="/orcamentos">
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              Novo Orçamento
            </Button>
          </Link>
          <Link href="/produtos/novo">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Produto
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Receita Realizada" 
          value={isLoading ? "..." : `R$ ${stats?.totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={DollarSign} 
          description="Total recebido (Contas a Receber)"
        />
        <StatCard 
          title="Total Orçamentos" 
          value={isLoading ? "..." : stats?.totalOrcamentos.toString() || "0"} 
          icon={FileText} 
          description="Emitidos no sistema"
        />
        <StatCard 
          title="Em Produção" 
          value={isLoading ? "..." : stats?.tarefasEmProducao.toString() || "0"} 
          icon={Kanban} 
          description="pedidos ativos no momento"
        />
        <StatCard 
          title="Total Clientes" 
          value={isLoading ? "..." : stats?.totalClientes.toString() || "0"} 
          icon={Users} 
          description="Base de clientes cadastrados"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral de Vendas</CardTitle>
            <CardDescription>Comparativo entre vendas e orçamentos realizados.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0.01 250)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'oklch(0.45 0.02 250)'}} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value}`} tick={{fill: 'oklch(0.45 0.02 250)'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid oklch(0.9 0.01 250)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  />
                  <Area type="monotone" dataKey="vendas" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVendas)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Clientes Recentes</CardTitle>
            <CardDescription>Últimos cadastros realizados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Carregando...</p>
              ) : stats?.recentClientes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum cliente cadastrado.</p>
              ) : stats?.recentClientes.map((cliente) => (
                <div key={cliente.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{cliente.nome.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{cliente.nome}</p>
                    <p className="text-sm text-muted-foreground">{cliente.email || "Sem e-mail"}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimos Pedidos</CardTitle>
          <CardDescription>Acompanhamento em tempo real dos pedidos.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === "Concluído" ? "default" : 
                      order.status === "Em Produção" ? "secondary" : 
                      order.status === "Pendente" ? "outline" : "destructive"
                    }>
                      {order.status}
                    </Badge>
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
