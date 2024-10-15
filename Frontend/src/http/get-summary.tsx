// Definição do tipo esperado para a resposta da API
type SummaryResponse = {
  completed: number;
  total: number;
  goalsPerDay: Record<string, {
    id: string;
    title: string;
    completedAt: string;
  }[]>;
};

// Função para buscar os dados de resumo da API
export async function getSummary(userId: string): Promise<SummaryResponse> {
  const response = await fetch(`http://localhost:3333/summary/${userId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.summary;
}
