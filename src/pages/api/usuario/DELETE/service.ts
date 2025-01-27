import { deleteUserInDB } from './repository';

export async function deleteUserService(userId: string) {
  const deletedUser = await deleteUserInDB(userId);
  return deletedUser;
}
