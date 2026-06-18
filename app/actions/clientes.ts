'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getClientes() {
  try {
    return await prisma.cliente.findMany({
      orderBy: { nome: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching clientes:', error);
    return [];
  }
}

export async function getClienteById(id: string) {
  try {
    return await prisma.cliente.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error('Error fetching cliente by id:', error);
    return null;
  }
}

export async function createCliente(data: {
  nome: string;
  documento?: string;
  telefone?: string;
  email?: string;
}) {
  try {
    const cliente = await prisma.cliente.create({
      data: {
        nome: data.nome,
        documento: data.documento || '',
        telefone: data.telefone || '',
        email: data.email || ''
      }
    });

    revalidatePath('/clientes');
    return { success: true, cliente };
  } catch (error: any) {
    console.error('Error creating cliente:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCliente(id: string) {
  try {
    await prisma.cliente.delete({
      where: { id }
    });

    revalidatePath('/clientes');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting cliente:', error);
    return { success: false, error: error.message };
  }
}
