'use server'

import prisma from '@/lib/prisma'

export async function getDashboardStats() {
  try {
    const [
      totalClientes,
      totalOrcamentos,
      tarefasEmProducao,
      contasReceber,
      recentOrcamentos,
      recentClientes
    ] = await Promise.all([
      prisma.cliente.count(),
      prisma.orcamento.count(),
      prisma.tarefa.count({ where: { status: 'Em Produção' } }),
      prisma.contaReceber.findMany({ where: { status: 'Recebido' } }),
      prisma.orcamento.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { cliente: true }
      }),
      prisma.cliente.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
    ])

    const totalReceita = contasReceber.reduce((acc, curr) => acc + curr.amount, 0)

    return {
      totalClientes,
      totalOrcamentos,
      tarefasEmProducao,
      totalReceita,
      recentOrcamentos,
      recentClientes
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error)
    return {
      totalClientes: 0,
      totalOrcamentos: 0,
      tarefasEmProducao: 0,
      totalReceita: 0,
      recentOrcamentos: [],
      recentClientes: []
    }
  }
}
