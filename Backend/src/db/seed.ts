import { db , client } from '.';
import { goalCompletions, goals } from './schema/schema';
import  dayjs  from 'dayjs';

export async function seed() {
  // Deletando todos os registros das tabelas 'goalCompletions' e 'goals'
  await db.delete(goalCompletions);
  await db.delete(goals);
}

seed().finally(() => client.end());
