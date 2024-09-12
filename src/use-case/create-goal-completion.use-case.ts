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
                    gte(goalCompletions.created_at, firstDayOfWeek),
                    eq(goalCompletions.goalId, goalId)
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
        .where(eq(goals.id, goalId))
        .limit(1);
    
    // Verifique se o resultado está presente
    if (result.length === 0) {
        throw new Error('Goal not found');
    }

    const { desiredWeeklyFrequency, completionCount } = result[0];

    // Verifique se a meta já foi completada
    if (completionCount >= desiredWeeklyFrequency) {
        throw new Error('Goal already completed');
    }

    // Inserir um novo registro de conclusão de meta
    const insertResult = await db
        .insert(goalCompletions)
        .values({ goalId })
        .returning();

    const goalCompletion = insertResult[0];

    return {
        goalCompletion,
    };
}
