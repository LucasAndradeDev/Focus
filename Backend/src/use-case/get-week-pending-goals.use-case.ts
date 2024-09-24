import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { db } from '../db'
import { goals, goalCompletions } from '../db/schema/schema'
import { and, count, eq, gte, lte, sql} from 'drizzle-orm'

dayjs.extend(weekOfYear)

export async function getWeekPendingGoals() {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        created_at: goals.created_at,
      })
      .from(goals)
      .where(lte(goals.created_at, lastDayOfWeek))
  )

  const goalsCompletedUpToWeek = db.$with('goals_completed_up_to_week').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as('completion_count'),
      })
      .from(goalCompletions)
      .where(
        and(
          lte(goalCompletions.created_at, lastDayOfWeek),
          gte(goalCompletions.created_at, firstDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  const pendingGoals = await db
  .with(goalsCreatedUpToWeek, goalsCompletedUpToWeek)
  .select({
    id: goalsCreatedUpToWeek.id,
    title: goalsCreatedUpToWeek.title,
    desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
    completionCount: sql `COALESCE(${goalsCompletedUpToWeek.completionCount}, 0)`.mapWith(Number),
  })
  .from(goalsCreatedUpToWeek)
  .leftJoin(goalsCompletedUpToWeek, eq(goalsCompletedUpToWeek.goalId, goalsCreatedUpToWeek.id))
      

  return{
    pendingGoals
  }
}



