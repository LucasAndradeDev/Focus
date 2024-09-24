import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { OutlineButton } from './ui/outline-button';
import { getPendingGoals } from '../http/get-pending-goals';
import { createGoalCompletion } from '../http/create-goal-completion';

export function PendingGoals() {
  const queryClient = useQueryClient();
  const { data: pendingGoals } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: getPendingGoals,
  });

  if (!pendingGoals) {
    return null;
  }

  async function handleCompleteGoal(goalId: string) {
    await createGoalCompletion(goalId);

    queryClient.invalidateQueries({ queryKey: ['summary'] });
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] });
    
  }

  return (
    <div className="flex flex-wrap gap-3">
      {pendingGoals.map((goal) => (
        <OutlineButton key={goal.id} disabled={goal.completionCount >= goal.desiredWeeklyFrequency} 
        onClick={() => handleCompleteGoal(goal.id)}>
          {goal.title}
          <Plus className="w-4 h-4" />
        </OutlineButton>
      ))}
    </div>
  );
}
