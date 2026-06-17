'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getOrcamentos() {
  try {
    return await prisma.orcamento.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching orcamentos:', error);
    return [];
  }
}

export async function createOrcamento(data: {
  cliente: string;
  documento?: string;
  telefone?: string;
  email?: string;
  itens: Array<{ descricao: string; qtd: number; preco: number }>;
  valorTotal: number;
  status?: string;
}) {
  try {
    const orcamento = await prisma.orcamento.create({
      data: {
        cliente: data.cliente,
        documento: data.documento || '',
        telefone: data.telefone || '',
        email: data.email || '',
        itens: data.itens,
        valorTotal: data.valorTotal,
        status: data.status || 'PENDENTE'
      }
    });

    // If initial status is APROVADO, automatically create accounts receivable entry
    if (data.status === 'APROVADO') {
      const dataVencimento = new Date();
      dataVencimento.setDate(dataVencimento.getDate() + 30); // 30-day default term

      await prisma.contasReceber.create({
        data: {
          cliente: data.cliente,
          descricao: `Orçamento #${orcamento.id.substring(18)}`,
          valor: data.valorTotal,
          dataVencimento,
          status: 'PENDENTE'
        }
      });
    }

    revalidatePath('/');
    revalidatePath('/orcamentos');
    return { success: true, orcamento };
  } catch (error: any) {
    console.error('Error creating orcamento:', error);
    return { success: false, error: error.message };
  }
}

export async function updateOrcamentoStatus(id: string, status: string) {
  try {
    const orcamento = await prisma.orcamento.update({
      where: { id },
      data: { status }
    });

    // If status is changed to APROVADO, create accounts receivable entry
    if (status === 'APROVADO') {
      const dataVencimento = new Date();
      dataVencimento.setDate(dataVencimento.getDate() + 30); // 30 days due

      // Check if already exists first
      const exists = await prisma.contasReceber.findFirst({
        where: { descricao: `Orçamento #${id.substring(18)}` }
      });

      if (!exists) {
        await prisma.contasReceber.create({
          data: {
            cliente: orcamento.cliente,
            descricao: `Orçamento #${id.substring(18)}`,
            valor: orcamento.valorTotal,
            dataVencimento,
            status: 'PENDENTE'
          }
        });
      }
    }

    revalidatePath('/');
    revalidatePath('/orcamentos');
    return { success: true, orcamento };
  } catch (error: any) {
    console.error('Error updating orcamento status:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteOrcamento(id: string) {
  try {
    await prisma.orcamento.delete({
      where: { id }
    });
    
    // Also clean up any accounts receivable generated for this
    try {
      await prisma.contasReceber.deleteMany({
        where: { descricao: `Orçamento #${id.substring(18)}` }
      });
    } catch (e) {
      console.warn('Could not delete associated account receivable:', e);
    }

    revalidatePath('/');
    revalidatePath('/orcamentos');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting orcamento:', error);
    return { success: false, error: error.message };
  }
}
