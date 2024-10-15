import { z } from 'zod'; 
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getWeekPendingGoals } from '../../use-case/get-week-pending-goals.use-case';

// Schema de validação do parâmetro userId
const getPendingGoalsParamsSchema = z.object({
  userId: z.string(), // Aceita qualquer string como userId
});


export const getPedingGoalsRoute: FastifyPluginAsyncZod = async app => {
  // Rota para listar metas pendentes da semana de um usuário específico
  app.get<{ Params: { userId: string } }>('/pending-goals/:userId', {
    schema: {
      params: getPendingGoalsParamsSchema,
    },
  }, async (request) => {
    const { userId } = request.params;

    const { pendingGoals } = await getWeekPendingGoals({ userId });

    return { pendingGoals };
  });
};
 