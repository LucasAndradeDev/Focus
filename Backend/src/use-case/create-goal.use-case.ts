import { db } from "../db"
import { goals } from "../db/schema/schema"

// Interface da função de criação de meta
interface CreateGoalProps {
    title: string
    desiredWeeklyFrequency: number
}

// Função de criação de meta
export async function createGoal({ title, desiredWeeklyFrequency }: CreateGoalProps) {
    const result = await db.insert(goals).values({ title, desiredWeeklyFrequency }).returning()

    const goal = result[0]

    return {
        goal,
    }
}