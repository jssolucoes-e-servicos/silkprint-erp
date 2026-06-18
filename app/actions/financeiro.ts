'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache'

// Contas a Pagar
export async function getContasPagar() {
  try {
    const contas = await prisma.contaPagar.findMany({
      orderBy: { dueDate: 'asc' }
    })
    return contas
  } catch (error) {
    console.error('Error fetching contas pagar:', error)
    return []
  }
}

export async function createContaPagar(data: any) {
  try {
    const conta = await prisma.contaPagar.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
        amount: parseFloat(data.amount.toString().replace('R$', '').replace('.', '').replace(',', '.'))
      }
    })
    revalidatePath('/financeiro/pagar')
    return { success: true, data: conta }
  } catch (error) {
    console.error('Error creating conta pagar:', error)
    return { success: false, error: 'Falha ao criar conta a pagar' }
  }
}

export async function updateContaPagarStatus(id: string, status: string) {
  try {
    await prisma.contaPagar.update({
      where: { id },
      data: { status }
    })
    revalidatePath('/financeiro/pagar')
    return { success: true }
  } catch (error) {
    console.error('Error updating conta pagar status:', error)
    return { success: false, error: 'Falha ao atualizar status' }
  }
}

export async function deleteContaPagar(id: string) {
  try {
    await prisma.contaPagar.delete({
      where: { id }
    })
    revalidatePath('/financeiro/pagar')
    return { success: true }
  } catch (error) {
    console.error('Error deleting conta pagar:', error)
    return { success: false, error: 'Falha ao excluir conta' }
  }
}

// Contas a Receber
export async function getContasReceber() {
  try {
    const contas = await prisma.contaReceber.findMany({
      orderBy: { dueDate: 'asc' }
    })
    return contas
  } catch (error) {
    console.error('Error fetching contas receber:', error)
    return []
  }
}

export async function createContaReceber(data: any) {
  try {
    const conta = await prisma.contaReceber.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
        amount: parseFloat(data.amount.toString().replace('R$', '').replace('.', '').replace(',', '.'))
      }
    })
    revalidatePath('/financeiro/receber')
    return { success: true, data: conta }
  } catch (error) {
    console.error('Error creating conta receber:', error)
    return { success: false, error: 'Falha ao criar conta a receber' }
  }
}

export async function updateContaReceberStatus(id: string, status: string) {
  try {
    await prisma.contaReceber.update({
      where: { id },
      data: { status }
    })
    revalidatePath('/financeiro/receber')
    return { success: true }
  } catch (error) {
    console.error('Error updating conta receber status:', error)
    return { success: false, error: 'Falha ao atualizar status' }
  }
}

export async function deleteContaReceber(id: string) {
  try {
    await prisma.contaReceber.delete({
      where: { id }
    })
    revalidatePath('/financeiro/receber')
    return { success: true }
  } catch (error) {
    console.error('Error deleting conta receber:', error)
    return { success: false, error: 'Falha ao excluir conta' }
  }
}
