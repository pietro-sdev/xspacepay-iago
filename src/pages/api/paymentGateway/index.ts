import { NextApiRequest, NextApiResponse } from 'next';
import { PaymentGatewayService } from './service';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Autenticação: Verificar o token JWT
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ error: 'Token inválido.' });
    }
    const userId = decoded.id;

    switch (req.method) {
      case 'POST':
        // Salvar/Atualizar um gateway
        const { type, apiKey, secretKey } = req.body;
        if (!type || !apiKey) {
          return res.status(400).json({ error: 'Tipo e apiKey são obrigatórios.' });
        }

        // Validação adicional para os tipos
        const allowedTypes = ['pix', 'stripe', 'paypal'];
        if (!allowedTypes.includes(type)) {
          return res.status(400).json({ error: 'Tipo de gateway inválido.' });
        }

        // Salvar ou atualizar o gateway
        const gateway = await PaymentGatewayService.saveGateway(userId, type, apiKey, secretKey);
        return res.status(200).json({ gateway });

      case 'GET':
        // Listar todos os gateways do usuário
        const gateways = await PaymentGatewayService.getUserGateways(userId);
        return res.status(200).json({ gateways });

      case 'DELETE':
        // Remover um gateway específico
        const { type: delType } = req.query;
        if (!delType || typeof delType !== 'string') {
          return res.status(400).json({ error: 'Tipo de gateway para remoção não fornecido.' });
        }

        await PaymentGatewayService.deleteGateway(userId, delType);
        return res.status(200).json({ message: 'Gateway removido com sucesso.' });

      default:
        return res.status(405).json({ error: 'Método não permitido.' });
    }
  } catch (error: any) {
    console.error('Erro na autenticação ou no processamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
