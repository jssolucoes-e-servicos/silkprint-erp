'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getLeads() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return leads
  } catch (error) {
    console.error('Error fetching leads:', error)
    return []
  }
}

export async function createLead(data: any) {
  try {
    const lead = await prisma.lead.create({
      data
    })
    revalidatePath('/leads')
    return { success: true, data: lead }
  } catch (error) {
    console.error('Error creating lead:', error)
    return { success: false, error: 'Falha ao criar lead' }
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    await prisma.lead.update({
      where: { id },
      data: { status }
    })
    revalidatePath('/leads')
    return { success: true }
  } catch (error) {
    console.error('Error updating lead status:', error)
    return { success: false, error: 'Falha ao atualizar status' }
  }
}

export async function deleteLead(id: string) {
  try {
    await prisma.lead.delete({
      where: { id }
    })
    revalidatePath('/leads')
    return { success: true }
  } catch (error) {
    console.error('Error deleting lead:', error)
    return { success: false, error: 'Falha ao excluir lead' }
  }
}
