'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getOrcamentos() {
  try {
    const orcamentos = await prisma.orcamento.findMany({
      include: {
        cliente: true,
        itens: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return orcamentos.map(orc => ({
      ...orc,
      itens: orc.itens.map(item => ({
        ...item,
        acabamentos: item.acabamentos ? JSON.parse(item.acabamentos) : []
      }))
    }))
  } catch (error) {
    console.error('Error fetching orcamentos:', error)
    return []
  }
}

export async function createOrcamento(data: any) {
  try {
    const lastOrc = await prisma.orcamento.findFirst({
      orderBy: { numero: 'desc' }
    })
    
    let nextNumber = 1
    if (lastOrc) {
      const lastNum = parseInt(lastOrc.numero.split('-').pop() || '0')
      nextNumber = lastNum + 1
    }
    
    const numero = `ORC-2024-${nextNumber.toString().padStart(3, '0')}`

    const { itens, ...rest } = data;

    const orcamento = await prisma.orcamento.create({
      data: {
        ...rest,
        numero,
        dataEmissao: new Date(),
        itens: {
          create: itens.map((item: any) => ({
            ...item,
            acabamentos: JSON.stringify(item.acabamentos || [])
          }))
        }
      }
    })
    
    revalidatePath('/orcamentos')
    return { success: true, data: orcamento }
  } catch (error) {
    console.error('Error creating orcamento:', error)
    return { success: false, error: 'Falha ao criar orçamento' }
  }
}

export async function updateOrcamentoStatus(id: string, status: string) {
  try {
    await prisma.orcamento.update({
      where: { id },
      data: { status }
    })
    revalidatePath('/orcamentos')
    return { success: true }
  } catch (error) {
    console.error('Error updating orcamento status:', error)
    return { success: false, error: 'Falha ao atualizar status' }
  }
}

export async function deleteOrcamento(id: string) {
  try {
    await prisma.orcamento.delete({
      where: { id }
    })
    revalidatePath('/orcamentos')
    return { success: true }
  } catch (error) {
    console.error('Error deleting orcamento:', error)
    return { success: false, error: 'Falha ao excluir orçamento' }
  }
}

export async function getClientes() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nome: 'asc' }
    })
    return clientes
  } catch (error) {
    console.error('Error fetching clientes:', error)
    return []
  }
}

export async function createCliente(data: any) {
  try {
    const cliente = await prisma.cliente.create({
      data
    })
    revalidatePath('/clientes')
    return { success: true, data: cliente }
  } catch (error) {
    console.error('Error creating cliente:', error)
    return { success: false, error: 'Falha ao criar cliente' }
  }
}

export async function getClienteById(id: string) {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        orcamentos: {
          include: { itens: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    
    if (!cliente) return null;

    return {
      ...cliente,
      orcamentos: cliente.orcamentos.map(orc => ({
        ...orc,
        itens: orc.itens.map(item => ({
          ...item,
          acabamentos: item.acabamentos ? JSON.parse(item.acabamentos) : []
        }))
      }))
    }
  } catch (error) {
    console.error('Error fetching cliente:', error)
    return null
  }
}

export async function deleteCliente(id: string) {
  try {
    await prisma.cliente.delete({
      where: { id }
    })
    revalidatePath('/clientes')
    return { success: true }
  } catch (error) {
    console.error('Error deleting cliente:', error)
    return { success: false, error: 'Falha ao excluir cliente' }
  }
}

export async function getProdutos() {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { nome: 'asc' }
    })
    return produtos
  } catch (error) {
    console.error('Error fetching produtos:', error)
    return []
  }
}

export async function createProduto(data: any) {
  try {
    const produto = await prisma.produto.create({
      data
    })
    revalidatePath('/produtos')
    return { success: true, data: produto }
  } catch (error) {
    console.error('Error creating produto:', error)
    return { success: false, error: 'Falha ao criar produto' }
  }
}

export async function deleteProduto(id: string) {
  try {
    await prisma.produto.delete({
      where: { id }
    })
    revalidatePath('/produtos')
    return { success: true }
  } catch (error) {
    console.error('Error deleting produto:', error)
    return { success: false, error: 'Falha ao excluir produto' }
  }
}
