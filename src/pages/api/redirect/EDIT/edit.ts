// pages/api/redirect/edit.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { editChannelMessages } from './service'
// Se desejar utilizar o repositório para logs, importe aqui:
// import { saveRedirectHistory } from './repository'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método não permitido.' })
  }

  const { channel, linkPairs } = req.body

  if (!channel || !Array.isArray(linkPairs) || linkPairs.length !== 5) {
    return res.status(400).json({ success: false, error: 'Parâmetros obrigatórios ausentes ou inválidos.' })
  }

  // Validar cada par de links
  for (let i = 0; i < linkPairs.length; i++) {
    const { oldLink, newLink } = linkPairs[i];
    if (!oldLink || !newLink) {
      return res.status(400).json({ success: false, error: `Par de links ${i + 1} está incompleto.` })
    }
  }

  try {
    // Chama o service para editar mensagens
    const result = await editChannelMessages(channel, linkPairs)

    // Exemplo de uso do repositório (opcional):
    // await saveRedirectHistory({ channel, linkPairs, editedCount: result.editedCount })

    return res.status(200).json({
      success: true,
      message: `Redirecionamento concluído. Mensagens editadas: ${result.editedCount}`,
    })
  } catch (error: any) {
    console.error('Erro no redirect:', error)
    return res.status(500).json({
      success: false,
      error: 'Erro ao executar redirecionamento.',
    })
  }
}
