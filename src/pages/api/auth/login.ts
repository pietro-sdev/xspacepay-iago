import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/prisma';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Certifique-se de definir isso no .env

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
    }

    // Geração do token JWT usando `jose`
    const token = await new SignJWT({ id: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(JWT_SECRET)); // Chave secreta

    return res.status(200).json({
      message: 'Login bem-sucedido.',
      token,
      userId: user.id,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}
