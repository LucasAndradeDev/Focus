// Interface para o corpo da requisição
interface CreateGoalCompletionFormData {
    goalId: string;
    userId: string;
  }
  
  export async function createGoalCompletion({ userId, goalId }: CreateGoalCompletionFormData) {
    try {
      const response = await fetch(`http://localhost:3333/completions/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goalId }), // userId está na URL
      });
  
      if (!response.ok) {
        // Se a resposta não for bem-sucedida, lançamos um erro
        throw new Error('Erro ao completar a meta');
      }
  
      console.log('Meta completada com sucesso!, Dados:', { userId, goalId });
    } catch (error) {
      console.error('Erro na requisição de completar meta:', error);
    }
  }
  