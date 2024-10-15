import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { OutlineButton } from './ui/outline-button';
import { getPendingGoals } from '../http/get-pending-goals.route';
import { createGoalCompletion } from '../http/create-goal-completion';

export function PendingGoals() {
  const queryClient = useQueryClient();
  
  // Recupera o userId do localStorage
  const userId = localStorage.getItem('userId');

  // Chama a função de busca de metas pendentes passando o userId
  const { data: pendingGoals, isLoading, isError, error } = useQuery({
    queryKey: ['pending-goals', userId], // Inclui o userId como parte da chave para cache
    queryFn: () => getPendingGoals(userId as string), // Passa o userId para a função
    enabled: !!userId, // Habilita a query apenas se o userId estiver disponível
  });

  if (isLoading) {
    return <div>Carregando metas...</div>;
  }

  if (isError) {
    console.error('Erro ao carregar metas pendentes:', error); // Ajuda na depuração
    return <div>Erro ao carregar metas pendentes.</div>;
  }

  console.log(pendingGoals);

  async function handleCompleteGoal(goalId: string, userId: string) {
    await createGoalCompletion({ userId, goalId });

    // Invalida os caches relacionados para forçar uma nova consulta após a ação
    queryClient.invalidateQueries({ queryKey: ['summary'] });
    queryClient.invalidateQueries({ queryKey: ['pending-goals', userId] });
  }

  // Garante que 'pendingGoals' é um array antes de usar o map
  return (
    <div className="flex flex-wrap gap-3">
      {(Array.isArray(pendingGoals) ? pendingGoals : []).map((goal) => (
        <OutlineButton 
          key={goal.id} 
          disabled={goal.completionCount >= goal.desiredWeeklyFrequency}
          onClick={() => handleCompleteGoal(goal.id, userId as string)}
        >
          {goal.title}
          <Plus className="w-4 h-4" />
        </OutlineButton>
      ))}
    </div>
  );
}
