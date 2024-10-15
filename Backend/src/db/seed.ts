import { db , client } from '.';
import { goalCompletions, goals, users} from './schema/schema';


export async function seed() {
  // Deletando todos os registros das tabelas 'goalCompletions' e 'goals'
  await db.delete(goalCompletions);
  await db.delete(goals);

  // Deletando todos os registros das tabelas 'users'
  await db.delete(users);

}

seed().finally(() => client.end());
