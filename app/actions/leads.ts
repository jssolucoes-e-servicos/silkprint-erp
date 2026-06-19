'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getLeads() {
  try {
    return await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
}

export async function createLead(data: { name: string; company?: string; email?: string; phone?: string; status?: string; source?: string }) {
  try {
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        company: data.company || null,
        email: data.email || null,
        phone: data.phone || null,
        status: data.status || 'NEW',
        source: data.source || 'DIRECT'
      }
    });
    revalidatePath('/leads');
    revalidatePath('/');
    return { success: true, lead };
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return { success: false, error: error.message };
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/leads');
    revalidatePath('/');
    return { success: true, lead };
  } catch (error: any) {
    console.error('Error updating lead status:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteLead(id: string) {
  try {
    await prisma.lead.delete({
      where: { id }
    });
    revalidatePath('/leads');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return { success: false, error: error.message };
  }
}
