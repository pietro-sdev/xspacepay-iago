// pages/api/redirect/service.ts
import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'
import { Api } from 'telegram/tl'
import bigInt from 'big-integer'

// Carrega do .env:
const apiId = parseInt(process.env.TELEGRAM_API_ID || '0', 10)
const apiHash = process.env.TELEGRAM_API_HASH || ''
let sessionString = process.env.TELEGRAM_SESSION || ''

let client: TelegramClient | null = null

/**
 * Retorna um client singleton (GramJS) logado via TELEGRAM_SESSION.
 */
async function getTelegramClient() {
  if (!client) {
    client = new TelegramClient(
      new StringSession(sessionString),
      apiId,
      apiHash,
      { connectionRetries: 5 }
    )
    await client.start({
      phoneNumber: async () => {
        throw new Error('Telefone não configurado. Use TELEGRAM_SESSION já logado.')
      },
      password: async () => '',
      phoneCode: async () => '',
      onError: (err) => console.error(err),
    })
    console.log('GramJS client iniciado.')
  }
  return client
}

interface LinkPair {
  oldLink: string;
  newLink: string;
}

/**
 * Edita mensagens do canal (channel pode ser ID numérico ou @username)
 * Substituindo os links antigos pelos novos com base no identificador numérico.
 */
export async function editChannelMessages(channel: string, linkPairs: LinkPair[]) {
  const tg = await getTelegramClient()

  let channelId = channel
  if (!channel.startsWith('-100') && /^\d+$/.test(channel)) {
    channelId = `-100${channel}`
  }

  let offsetId = 0
  const limit = 100
  let editedCount = 0

  // Crie um mapa para fácil busca: {oldLink: newLink}
  const linkMap: { [key: string]: string } = {}
  linkPairs.forEach(pair => {
    linkMap[pair.oldLink] = pair.newLink
  })

  while (true) {
    try {
      const history = await tg.invoke(
        new Api.messages.GetHistory({
          peer: channelId, // Usa channelId com prefixo, se necessário
          offsetId,
          offsetDate: 0,
          addOffset: 0,
          limit,
          maxId: 0,
          minId: 0,
          hash: bigInt(0), // GramJS pede um BigInteger
        })
      )

      // 'history' retorna um objeto com 'messages'
      const messages: any[] = history.messages || []
      if (!messages.length) {
        break
      }

      for (const msg of messages) {
        // Verifica se a mensagem possui entidades com URLs
        if (msg.entities && msg.entities.length > 0) {
          let hasLink = false
          // Itera sobre as entidades para encontrar URLs
          const updatedEntities: Api.MessageEntity[] = []

          msg.entities.forEach((entity: any) => {
            if (entity instanceof Api.MessageEntityTextUrl || entity instanceof Api.MessageEntityUrl) {
              const originalUrl = entity.url
              const newLink = linkMap[originalUrl]
              if (newLink) {
                hasLink = true
                // Substitui o URL pela newLink
                const updatedEntity = entity instanceof Api.MessageEntityTextUrl
                  ? new Api.MessageEntityTextUrl({
                      offset: entity.offset,
                      length: entity.length,
                      url: newLink,
                    })
                  : new Api.MessageEntityUrl({
                      offset: entity.offset,
                      length: entity.length,
                      url: newLink,
                    })

                // Type Assertion para evitar erros de TypeScript
                updatedEntities.push(updatedEntity as Api.MessageEntity)
              } else {
                // Se o URL não está no mapa, mantém a entidade original
                updatedEntities.push(entity)
              }
            } else {
              updatedEntities.push(entity)
            }
          })

          if (hasLink) {
            try {
              // Edita a mensagem mantendo o texto original e atualizando as entidades
              await tg.invoke(
                new Api.messages.EditMessage({
                  peer: channelId,
                  id: msg.id,
                  message: msg.message, // Mantém o texto original
                  entities: updatedEntities.length > 0 ? updatedEntities : undefined,
                })
              )
              editedCount++
              console.log(`Mensagem ID ${msg.id} editada com sucesso.`)
            } catch (err) {
              console.error(`Erro ao editar mensagem ID=${msg.id}:`, err)
            }
          }
        }
      }

      // Atualiza offsetId para buscar o próximo lote
      offsetId = messages[messages.length - 1].id
      if (offsetId === 0) break
    } catch (err) {
      console.error('Erro ao buscar histórico:', err)
      break
    }
  }

  return { editedCount }
}
