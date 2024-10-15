import { db } from "../db";
import { goals } from "../db/schema/schema";

// Interface da função de criação de meta
interface CreateGoalProps {
    userId: string; // ID do usuário que está criando a meta
    title: string; // Título da meta
    desiredWeeklyFrequency: number; // Frequência semanal desejada
}

// Função de criação de meta
export async function createGoal({ userId, title, desiredWeeklyFrequency }: CreateGoalProps) {
    // Insere a nova meta no banco de dados
    const result = await db.insert(goals).values({
        userId, // Adiciona o ID do usuário à nova meta
        title,
        desiredWeeklyFrequency,
    }).returning();

    const goal = result[0]; // Obtém a meta recém-criada

    return {
        goal, // Retorna a meta criada
    };
}
