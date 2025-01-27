import { getAllUsersFromDB } from './repository';

export async function listAllUsersService() {
  
  const users = await getAllUsersFromDB();
  return users;
}
