import { and, sql, gte, lte, eq } from "drizzle-orm";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema/schema";
import dayjs from "dayjs";
import { desc } from "drizzle-orm";


export async function getWeekSummary() {
  const lastDayOfWeek = dayjs().endOf('week').toDate();
  const firstDayOfWeek = dayjs().startOf('week').toDate();

  try {
    // CTE para metas criadas até o final da semana
    const goalsCreatedUpToWeek = db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.created_at,
      })
      .from(goals)
      .where(lte(goals.created_at, lastDayOfWeek))
      .as('goals_created_up_to_week');

    // CTE para metas completadas durante a semana
    const goalsCompletedUpToWeek = db
      .select({
        goalId: goalCompletions.goalId,
        title: goals.title,
        completedAtDate: sql`DATE(${goalCompletions.created_at})`.mapWith(String).as('completed_at_date'),
        completedAt: goalCompletions.created_at,
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goalCompletions.goalId, goals.id))
      .where(
        and(
          lte(goalCompletions.created_at, lastDayOfWeek),
          gte(goalCompletions.created_at, firstDayOfWeek)
        )
      )
      .orderBy(desc(goalCompletions.created_at))
      .as('goals_completed_up_to_week');

    // CTE para agrupar metas completadas por dia da semana
    const goalsCompletedByWeekDay = db
      .select({
        completedAtDate: goalsCompletedUpToWeek.completedAtDate,
        completions: sql`
          jsonb_agg(
            jsonb_build_object(
              'id', ${goalsCompletedUpToWeek.goalId},
              'title', ${goalsCompletedUpToWeek.title},
              'completedAt', ${goalsCompletedUpToWeek.completedAt}
            )
          )
        `.as('completions'),
      })
      .from(goalsCompletedUpToWeek)
      .groupBy(goalsCompletedUpToWeek.completedAtDate)
      .orderBy(desc(goalsCompletedUpToWeek.completedAtDate))
      .as('goals_completed_by_week_day');


    type goalsPerDay = Record<string, { id: string; title: string; completedAt: string}[]>

    // Consulta final
    const result = await db
      .select({
        completions: sql`(SELECT COUNT(*) FROM ${goalsCompletedUpToWeek})`.mapWith(Number).as('completions'),
        total: sql`(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(Number).as('total'),
        goalsPerDay: sql <goalsPerDay>`
          (SELECT jsonb_object_agg(${goalsCompletedByWeekDay.completedAtDate}, ${goalsCompletedByWeekDay.completions}) FROM ${goalsCompletedByWeekDay})
        `.as('goalsPerDay')
      })
      .from(goalsCreatedUpToWeek);

    return {
      summary: result[0], // Use [0] to get the single result object from the array
    };
  } catch (error) {
    console.error('Erro ao obter o resumo da semana:', error);
    throw error; // Re-throw to be caught by the route handler
  }
}
