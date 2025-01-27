import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import input from 'input';
import 'dotenv/config';


const apiId = parseInt(process.env.TELEGRAM_API_ID ?? '', 10);
const apiHash = process.env.TELEGRAM_API_HASH ?? '';

async function main() {
  const client = new TelegramClient(new StringSession(''), apiId, apiHash, {
    connectionRetries: 5,
  });
  
  await client.start({
    phoneNumber: async () => await input.text('Digite seu número de telefone internacional: '),
    password: async () => await input.text('Entre sua senha de 2FA (se tiver): '),
    phoneCode: async () => await input.text('Digite o código que chegou no Telegram/SMS: '),
    onError: (err) => console.log(err),
  });

  console.log('Login realizado com sucesso!');
  console.log('SESSION STRING:');
  console.log(client.session.save());
}

main();
