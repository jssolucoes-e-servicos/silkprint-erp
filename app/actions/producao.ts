'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache'

export async function getTarefas() {
  try {
    const tarefas = await prisma.tarefa.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return tarefas
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error)
    return []
  }
}

export async function createTarefa(data: { title: string, customer: string, priority: string, deadline: string, status?: string }) {
  try {
    const tarefa = await prisma.tarefa.create({
      data: {
        title: data.title,
        customer: data.customer,
        priority: data.priority,
        deadline: data.deadline,
        status: data.status || "Pendente"
      }
    })
    revalidatePath('/producao')
    return { success: true, data: tarefa }
  } catch (error) {
    console.error('Erro ao criar tarefa:', error)
    return { success: false, error: 'Erro ao criar tarefa' }
  }
}

export async function updateTarefaStatus(id: string, status: string) {
  try {
    await prisma.tarefa.update({
      where: { id },
      data: { status }
    })
    revalidatePath('/producao')
    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar status da tarefa:', error)
    return { success: false, error: 'Erro ao atualizar status' }
  }
}

export async function deleteTarefa(id: string) {
  try {
    await prisma.tarefa.delete({
      where: { id }
    })
    revalidatePath('/producao')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error)
    return { success: false, error: 'Erro ao excluir tarefa' }
  }
}
