import { createUserInDB } from './repository';
import bcrypt from 'bcrypt';

interface CreateUserServiceInput {
  name: string;
  email: string;
  password: string;
  profilePicture?: string | null;
}

export async function createUserService({
  name,
  email,
  password,
  profilePicture,
}: CreateUserServiceInput) {

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUserInDB({
    name,
    email,
    password: hashedPassword,
    profilePicture: profilePicture || null,
  });

  return user;
}
