// Definição do tipo esperado para a resposta da API
type PendingGoalsResponse = {
    id: string;
    title: string;
    desiredWeeklyFrequency: number;
    completionCount: number;
}[]
  
  // Função para buscar os dados de resumo da API
  export async function getPendingGoals(): Promise<PendingGoalsResponse> {
    const response = await fetch('http://localhost:3333/pending-goals');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.pendingGoals; 
  }
  