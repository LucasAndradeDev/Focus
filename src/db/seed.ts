import { db , client } from '.';
import { goalCompletions, goals } from './schema/schema';
import  dayjs  from 'dayjs';

async function seed() {
  // Deletando todos os registros das tabelas 'goalCompletions' e 'goals'
  await db.delete(goalCompletions);
  await db.delete(goals);

  // Inserindo novos registros na tabela 'goals'
  const result = await db.insert(goals).values([
    { title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
    { title: 'Estudar', desiredWeeklyFrequency: 5 },
    { title: 'Me exercitar', desiredWeeklyFrequency: 3 }  // Corrigido de 'excercitar' para 'exercitar'
  ]).returning();

  const startOfWeek = dayjs().startOf('week');

  // Inserindo novos registros na tabela 'goalCompletions'
  await db.insert(goalCompletions).values([
    { goalId: result[0].id , created_at: startOfWeek.toDate() },
    { goalId: result[1].id , created_at: startOfWeek.add(1, 'day').toDate() },
    { goalId: result[2].id , created_at: startOfWeek.add(2, 'day').toDate() }
  ]);
}

seed().finally(() => client.end());
