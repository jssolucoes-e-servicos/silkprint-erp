'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  DollarSign, 
  Download, 
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar
} from "lucide-react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

const data = [
  { name: 'Jan', receita: 4000, despesa: 2400 },
  { name: 'Fev', receita: 3000, despesa: 1398 },
  { name: 'Mar', receita: 2000, despesa: 9800 },
  { name: 'Abr', receita: 2780, despesa: 3908 },
  { name: 'Mai', receita: 1890, despesa: 4800 },
  { name: 'Jun', receita: 2390, despesa: 3800 },
  { name: 'Jul', receita: 3490, despesa: 4300 },
]

const transacoes = [
  { id: 1, description: "Venda Pedido #1234", category: "Vendas", amount: "R$ 1.250,00", type: "Entrada", date: "2024-03-10", status: "Confirmado" },
  { id: 2, description: "Compra de Papel Couché", category: "Estoque", amount: "R$ 3.400,00", type: "Saída", date: "2024-03-09", status: "Pendente" },
  { id: 3, description: "Aluguel Galpão", category: "Fixo", amount: "R$ 2.500,00", type: "Saída", date: "2024-03-05", status: "Confirmado" },
  { id: 4, description: "Venda Pedido #1235", category: "Vendas", amount: "R$ 850,00", type: "Entrada", date: "2024-03-04", status: "Confirmado" },
  { id: 5, description: "Manutenção Impressora", category: "Manutenção", amount: "R$ 450,00", type: "Saída", date: "2024-03-02", status: "Confirmado" },
]

export default function FinanceiroPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground">Controle suas receitas, despesas e fluxo de caixa.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/financeiro/receber">
            <Button variant="outline" className="gap-2">
              <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
              Contas a Receber
            </Button>
          </Link>
          <Link href="/financeiro/pagar">
            <Button variant="outline" className="gap-2">
              <ArrowDownCircle className="h-4 w-4 text-rose-500" />
              Contas a Pagar
            </Button>
          </Link>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Transação
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">R$ 45.231,89</div>
            <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% em relação ao mês anterior
            </div>
          </CardContent>
        </Card>
        <Card className="bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesa Total</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">R$ 12.450,00</div>
            <div className="flex items-center text-xs text-rose-600 dark:text-rose-400 mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              -4.2% em relação ao mês anterior
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo em Caixa</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">R$ 32.781,89</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Disponível para investimento
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="receita" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="despesa" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Resumo por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Vendas", value: 75, color: "bg-emerald-500" },
                { label: "Estoque", value: 15, color: "bg-blue-500" },
                { label: "Fixo", value: 8, color: "bg-amber-500" },
                { label: "Outros", value: 2, color: "bg-slate-500" },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Últimas Transações</CardTitle>
          <Button variant="ghost" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacoes.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.description}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell>{t.date}</TableCell>
                  <TableCell className={t.type === "Entrada" ? "text-emerald-600" : "text-rose-600"}>
                    {t.type === "Entrada" ? "+" : "-"} {t.amount}
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.status === "Confirmado" ? "default" : "secondary"}>
                      {t.status}
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
