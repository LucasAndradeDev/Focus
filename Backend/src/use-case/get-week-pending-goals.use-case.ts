// Importação da lib dayjs, para manipulação de datas
import dayjs from 'dayjs';
// Importação do plugin dayjs/plugin/weekOfYear, para manipulação de semanas
import weekOfYear from 'dayjs/plugin/weekOfYear';
// Importação do banco de dados
import { db } from '../db';
// Importação das tabelas
import { goals, goalCompletions } from '../db/schema/schema';
// Importação da biblioteca 'drizzle-orm'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm';

// Interface da função de busca de metas pendentes por semana
export interface GetWeekPendingGoalsProps {
  userId: string;
}

// Extensão da biblioteca 'dayjs'
dayjs.extend(weekOfYear);

// Funcionalidade para obter metas pendentes por semana
export async function getWeekPendingGoals({ userId }: GetWeekPendingGoalsProps) {
  const firstDayOfWeek = dayjs().startOf('week').toDate();
  const lastDayOfWeek = dayjs().endOf('week').toDate();

  // CTE para metas criadas até o final da semana
  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(
        and(
          lte(goals.createdAt, lastDayOfWeek), // Seleciona apenas as metas criadas até o final da semana
          eq(goals.userId, userId) // Seleciona apenas as metas criadas pelo usuário informado
        )
      )
  );

  // CTE para metas completadas durante a semana
  const goalsCompletedUpToWeek = db.$with('goals_completed_up_to_week').as(
    db
      .select({
        goalId: goalCompletions.goalId, 
        completionCount: count(goalCompletions.id).as('completion_count'), // Conta quantas vezes cada meta foi completada
      })
      .from(goalCompletions)
      .where(
        and(
          lte(goalCompletions.createdAt, lastDayOfWeek),
          gte(goalCompletions.createdAt, firstDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId) // Agrupa as conclusões por meta, para saber quantas vezes cada meta foi completada
  );

  // Consulta para obter as metas pendentes
  const pendingGoals = await db
    .with(goalsCreatedUpToWeek, goalsCompletedUpToWeek) // Uso das CTEs criadas acima
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount: sql`COALESCE(${goalsCompletedUpToWeek.completionCount}, 0)`.mapWith(Number), // Caso nenhuma conclusão seja encontrada, o valor de 'completionCount' é '0'
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(goalsCompletedUpToWeek, eq(goalsCompletedUpToWeek.goalId, goalsCreatedUpToWeek.id));

  return {
    pendingGoals,
  };
}
