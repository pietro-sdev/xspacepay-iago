import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hashear a senha
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('pietro07menezes@gmail.com', saltRounds);

  // Criação do usuário
  const user = await prisma.user.create({
    data: {
      name: 'Pietro Menezes',
      email: 'pietro07menezes@gmail.com',
      password: hashedPassword,
      profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106',
    },
  });

  console.log('Usuário criado:', user);
}

main()
  .catch((e) => {
    console.error('Erro ao criar o usuário:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
