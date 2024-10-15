// Atualização da interface para incluir userId
interface CreateGoalFormData {
    userId: string; // Inclua userId aqui
    title: string;
    desiredWeeklyFrequency: number;
}

export async function createGoal({ userId, title, desiredWeeklyFrequency }: CreateGoalFormData) {
    
    await fetch(`http://localhost:3333/goals/${userId}`, {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, desiredWeeklyFrequency }), // userId já está na URL
    });

    console.log('Meta criada com sucesso!, Dados:', { userId, title, desiredWeeklyFrequency });
}


