// Importação da lib dayjs, para manipulação de datas
import { and, desc, eq, gte, lte, sql } from 'drizzle-orm'
// Importação do banco de dados
import { db } from '../db'
// Importação das tabelas
import { goalCompletions, goals } from '../db/schema/schema'
import dayjs from 'dayjs'

// Interface da função de busca de resumo por semana
export interface GetWeekSummaryProps {
  userId: string
}

// Funcionalidade para obter resumo da semana
export async function getWeekSummary({ userId }: GetWeekSummaryProps) {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

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
  )

  // CTE para metas completadas durante a semana
  const goalsCompletedInWeek = db.$with('goals_completed_in_week').as(
    db
      .select({
        id: goalCompletions.id,
        title: goals.title,
        completedAt: goalCompletions.createdAt, // Data da conclusão - Formato 'YYYY-MM-DD HH:mm:ss'
        completedAtDate: sql /*Data da conclusão convertida para 'YYYY-MM-DD'*/`  
          DATE(${goalCompletions.createdAt})
        `.as('completedAtDate'),
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goals.id, goalCompletions.goalId)) // O id da meta deve ser igual ao id da conclusão
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
      .orderBy(desc(goalCompletions.createdAt))
  )

  // CTE para metas completadas por dia
  const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
    db
      .select({
        completedAtDate: goalsCompletedInWeek.completedAtDate, // Data da conclusão
        completions: sql /*Detalhes da conclusão, utilizada para montar o resumo*/`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${goalsCompletedInWeek.id},
              'title', ${goalsCompletedInWeek.title},
              'completedAt', ${goalsCompletedInWeek.completedAt}
            )
          )
        `.as('completions'),
      })
      .from(goalsCompletedInWeek)
      .groupBy(goalsCompletedInWeek.completedAtDate)
      .orderBy(desc(goalsCompletedInWeek.completedAtDate))
  )

  // Tipagem para o resultado
  type GoalsPerDay = Record<
    string,
    {
      id: string
      title: string
      completedAt: string
    }[]
  >

  // Consulta final, para obter o resumo
  const result = await db
    .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
    .select({
      completed:
        sql /*Esse SQL calcula quantas vezes as metas foram completadas*/`(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith( // Converte o resultado para o tipo Number
          Number 
        ),
      total:
        sql /*Esse outro campo calcula quantas metas existem, o total de metas criadas*/`(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(
          Number
        ),
      goalsPerDay: sql /**/<GoalsPerDay>`
        JSON_OBJECT_AGG(
          ${goalsCompletedByWeekDay.completedAtDate},
          ${goalsCompletedByWeekDay.completions}
        )
      `,
    })
    .from(goalsCompletedByWeekDay)

  return {
    summary: result[0],
  }
}