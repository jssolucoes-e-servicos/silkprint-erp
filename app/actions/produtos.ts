'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProdutos() {
  try {
    return await prisma.produto.findMany({
      orderBy: { nome: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching produtos:', error);
    return [];
  }
}

export async function createProduto(data: {
  nome: string;
  descricao?: string;
  precoVenda: number;
  categoria?: string;
}) {
  try {
    const produto = await prisma.produto.create({
      data: {
        nome: data.nome,
        descricao: data.descricao || '',
        precoVenda: data.precoVenda,
        categoria: data.categoria || ''
      }
    });

    revalidatePath('/produtos');
    return { success: true, produto };
  } catch (error: any) {
    console.error('Error creating produto:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduto(id: string) {
  try {
    await prisma.produto.delete({
      where: { id }
    });

    revalidatePath('/produtos');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting produto:', error);
    return { success: false, error: error.message };
  }
}
