// src/pages/home-logged-in.tsx
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSummary } from '../../http/get-summary'; // Rota para obter resumo
import { Summary } from './goals/summary'; // Componente para exibir resumo
import { EmptyGoals } from './goals/empty-goals'; // Componente para exibir mensagem de lista vazia
import { UserManagement } from '../user-management';
import '../css/home-logged-in.css';
import '../css/spinner.css'; // Importando o CSS da animação

const userId = localStorage.getItem('userId');

export function HomeLoggedIn() {
  const { data: summary } = useQuery({
    queryKey: ['summary'],
    queryFn: () => getSummary(userId as string), // Passa o userId para a função
  });

  const [content, setContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContent(summary?.total && summary.total > 0 ? <Summary /> : <EmptyGoals />);
    }, 1000); // Atraso de 0,5 segundo

    return () => clearTimeout(timer);
  }, [summary]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-8 bg-gradient-to-b bg-[#f3f3f3] text-zinc-950 dark:bg-[#0D1F22] dark:text-zinc-100">
      <div className="user-management">
        <UserManagement />
      </div>
      {content || <div className="spinner">
        </div>} {/* Exibe o spinner enquanto o conteúdo é carregado */}
    </main>
  );
}
