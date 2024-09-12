import { db } from "../db";
import { goalCompletions, goals } from "../db/schema/schema";
import { and, count, gte, lte, sql, eq } from 'drizzle-orm';
import dayjs from 'dayjs';

// Interface da função de criação de meta
interface CreateGoalCompletionProps {
    goalId: string;
}

// Função de criação de meta
export async function createGoalCompletion({ goalId }: CreateGoalCompletionProps) {
    const firstDayOfWeek = dayjs().startOf('week').toDate();
    const lastDayOfWeek = dayjs().endOf('week').toDate();

    // CTE para contar as conclusões de metas até o final da semana
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
    );

    // Consulta para obter a frequência desejada da meta e a contagem de conclusões
    const result = await db
        .with(goalsCompletedUpToWeek)
        .select({
            desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
            completionCount: sql`COALESCE(${goalsCompletedUpToWeek}.completion_count, 0)`.mapWith(Number),
        })
        .from(goals)
        .leftJoin(goalsCompletedUpToWeek, eq(goals.id, goalsCompletedUpToWeek.goalId))
    
    // Inserir um novo registro de conclusão de meta
    const insertionResult = await db
        .insert(goalCompletions)
        .values({ goalId })
        .returning();

    const goalCompletion = insertionResult[0];

    return {
        goalCompletion,
        result
    };
}
