'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Settings, 
  Ruler, 
  Trash2, 
  Timer, 
  Download, 
  Calendar, 
  ChevronDown, 
  TrendingUp, 
  TrendingDown,
  Lightbulb,
  ArrowRight,
  User
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const machineData = [
  { name: 'Offset 1', value: 85, color: '#3b82f6' },
  { name: 'Digital 2', value: 65, color: '#3b82f6' },
  { name: 'Plotter', value: 95, color: '#3b82f6' },
  { name: 'Acabam.', value: 45, color: '#3b82f6' },
  { name: 'Silk', value: 75, color: '#3b82f6' },
]

const wasteData = [
  { name: 'Papel Couché', value: 1.2, progress: 35 },
  { name: 'Adesivo Vinil', value: 4.8, progress: 75 },
  { name: 'Lona Frontlight', value: 2.5, progress: 55 },
  { name: 'Papel Offset', value: 0.9, progress: 20 },
]

const operators = [
  { name: 'Ricardo Pereira', initial: 'RP', machine: 'Offset GTO 52', efficiency: 94, jobs: 142, status: 'Excelente', color: '#10b981' },
  { name: 'Ana Luiza Silva', initial: 'AL', machine: 'Digital Konica', efficiency: 88, jobs: 312, status: 'Acima da Média', color: '#3b82f6' },
  { name: 'Marcos Santos', initial: 'MS', machine: 'Plotter HP Latte', efficiency: 76, jobs: 85, status: 'Revisar OEE', color: '#f97316' },
]

export default function RelatoriosPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios de Produtividade</h1>
          <p className="text-muted-foreground">Analise o desempenho da sua gráfica em tempo real.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            Este Mês
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline">Últimos 7 dias</Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Settings className="h-5 w-5" />
              </div>
              <span className="text-emerald-500 text-xs font-bold">+2.1%</span>
            </div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">OEE Geral</p>
            <h3 className="text-2xl font-black mt-1">82.4%</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Ruler className="h-5 w-5" />
              </div>
              <span className="text-destructive text-xs font-bold">-500 m²</span>
            </div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Produção Total</p>
            <h3 className="text-2xl font-black mt-1">14.250 <span className="text-sm font-normal text-muted-foreground">m²</span></h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Trash2 className="h-5 w-5" />
              </div>
              <span className="text-emerald-500 text-xs font-bold">-0.4%</span>
            </div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Taxa de Desperdício</p>
            <h3 className="text-2xl font-black mt-1">3.2%</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Timer className="h-5 w-5" />
              </div>
              <span className="text-destructive text-xs font-bold">-1.2%</span>
            </div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Cumprimento de Prazos</p>
            <h3 className="text-2xl font-black mt-1">96.8%</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Production Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Produção por Máquina (m²)</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={machineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {machineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Waste Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Análise de Desperdício</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {wasteData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-primary font-bold">{item.value}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500" 
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/20 flex gap-3">
              <Lightbulb className="h-5 w-5 text-primary shrink-0" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                O desperdício em <strong className="text-primary">Adesivo Vinil</strong> subiu 12% em relação à média. Verifique a calibração da Plotter 2.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operators Ranking Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">Ranking de Operadores</CardTitle>
          <Button variant="ghost" className="text-primary font-bold gap-1">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="uppercase tracking-widest text-xs">
                <TableHead>Operador</TableHead>
                <TableHead>Máquina Principal</TableHead>
                <TableHead>Eficiência (%)</TableHead>
                <TableHead>Jobs Concluídos</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operators.map((op) => (
                <TableRow key={op.name} className="group hover:bg-primary/5">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                        {op.initial}
                      </div>
                      <span className="text-sm font-semibold">{op.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{op.machine}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{op.efficiency}%</span>
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ width: `${op.efficiency}%`, backgroundColor: op.color }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{op.jobs}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" style={{ color: op.color, borderColor: `${op.color}40`, backgroundColor: `${op.color}10` }}>
                      {op.status}
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
