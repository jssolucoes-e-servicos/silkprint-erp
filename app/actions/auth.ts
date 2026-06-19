'use server'

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function register(data: { name: string; email: string; password: string }) {
  console.log('Registering user:', data.email);
  const hashedPassword = await bcrypt.hash(data.password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
    console.log('User registered successfully:', user.id);
    return { success: true };
  } catch (error) {
    console.error('Error in registration action:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Erro genérico ao registrar usuário' };
  }
}

export async function login(email: string, password: string) {
  console.log('Logging in user:', email);
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log('Invalid credentials for:', email);
      return { success: false, message: 'Credenciais inválidas' };
    }

    (await cookies()).set('session-token', user.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
    });
    console.log('User logged in successfully:', user.id);
    return { success: true };
  } catch (error) {
    console.error('Error in login action:', error);
    return { success: false, message: 'Erro ao realizar login' };
  }
}

export async function logout() {
  (await cookies()).delete('session-token');
}
