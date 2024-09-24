import { useState, useEffect } from 'react';
import { Dialog } from './components/ui/dialog';
import { CreateGoal } from './components/create-goal';
import { Summary } from './components/summary';
import { useQuery } from '@tanstack/react-query';
import { EmptyGoals } from './components/empty-goals';
import { getSummary } from './http/get-summary';

export function App() {
  const { data: summary } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
  });

  const [content, setContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContent(summary?.total && summary.total > 0 ? <Summary /> : <EmptyGoals />);
    }, 1000); // Atraso de 1 segundo

    // Limpeza do timer se o componente for desmontado antes do atraso
    return () => clearTimeout(timer);
  }, [summary]);

  return ( 
    <Dialog>
      {content}
      <CreateGoal />
    </Dialog>
  );
}
