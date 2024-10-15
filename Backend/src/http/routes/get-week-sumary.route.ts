import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { getWeekSummary } from '../../use-case/get-week-summary.use-case'; 

// Schema de validação do parâmetro userId
const getSummaryParamsSchema = z.object({
  userId: z.string(), // Aceita qualquer string como userId
});

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (app) => {
  // Rota para listar o resumo das metas da semana
  app.get<{ Params: { userId: string } }>('/summary/:userId', {
    schema: {
      params: getSummaryParamsSchema,
    },
  }, async (request) => {
    const { userId } = request.params;

    const { summary } = await getWeekSummary({ userId });

    return { summary };
  });
};
    
      