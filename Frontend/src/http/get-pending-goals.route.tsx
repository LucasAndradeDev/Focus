// Definição do tipo esperado para a resposta da API
type PendingGoalsResponse = {
  id: string;
  title: string;
  desiredWeeklyFrequency: number;
  completionCount: number;
}[];

// Função para buscar os dados de metas pendentes da API
export async function getPendingGoals(userId: string): Promise<PendingGoalsResponse> {
  const response = await fetch(`http://localhost:3333/pending-goals/${userId}`);
  
  if (!response.ok) {
    throw new Error('Houve um erro ao buscar as metas pendentes');
  }

  const data = await response.json();
  return data.pendingGoals; // Certifique-se de que 'pendingGoals' é o caminho correto
}
