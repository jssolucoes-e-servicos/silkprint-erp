'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  DollarSign,
  History,
  Edit,
  MoreVertical
} from "lucide-react"
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import useSWR from 'swr'
import { getClienteById } from '@/app/actions/clientes'

export default function PerfilClientePage() {
  const params = useParams()
  const id = params.id as string
  const { data: cliente, isLoading } = useSWR(id ? `cliente-${id}` : null, () => getClienteById(id))

  if (isLoading) {
    return <div className="flex items-center justify-center py-20">Carregando perfil...</div>
  }

  if (!cliente) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Cliente não encontrado.</div>
  }

  const orcamentos = cliente.orcamentos || []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/clientes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Perfil do Cliente</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://avatar.iran.liara.run/public/${id}`} />
                <AvatarFallback>GS</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{cliente.nome}</h2>
                <p className="text-sm text-muted-foreground">{cliente.documento}</p>
                <Badge className="mt-2" variant="default">
                  Ativo
                </Badge>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{cliente.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{cliente.telefone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Endereço não cadastrado</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Cliente desde {new Date(cliente.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <Button className="w-full gap-2">
              <Edit className="h-4 w-4" />
              Editar Perfil
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {orcamentos.reduce((acc: number, curr: any) => acc + curr.totalFinal, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Orçamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orcamentos.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {orcamentos.length > 0 ? (orcamentos.reduce((acc: number, curr: any) => acc + curr.totalFinal, 0) / orcamentos.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : "0,00"}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="orcamentos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orcamentos" className="gap-2"><History className="h-4 w-4" /> Orçamentos</TabsTrigger>
              <TabsTrigger value="financeiro" className="gap-2"><DollarSign className="h-4 w-4" /> Financeiro</TabsTrigger>
            </TabsList>
            <TabsContent value="orcamentos" className="pt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Histórico de Orçamentos</CardTitle>
                  <Link href="/orcamentos/novo">
                    <Button variant="outline" size="sm">Novo Orçamento</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orcamentos.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                            Nenhum orçamento encontrado.
                          </TableCell>
                        </TableRow>
                      ) : orcamentos.map((orc: any) => (
                        <TableRow key={orc.id}>
                          <TableCell className="font-medium">{orc.numero}</TableCell>
                          <TableCell>{new Date(orc.dataEmissao).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>R$ {orc.totalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell>
                            <Badge variant="default">{orc.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="financeiro" className="pt-4">
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <DollarSign className="h-12 w-12 text-muted-foreground opacity-20" />
                <div className="space-y-1">
                  <h3 className="font-semibold">Nenhum registro financeiro</h3>
                  <p className="text-sm text-muted-foreground">Não há faturas ou pagamentos registrados para este cliente.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
