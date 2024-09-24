import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getWeekSummary } from '../../use-case/get-week-summary.use-case'; // Corrigido o nome da importação

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (app) => {
  // Rota para listar o resumo das metas da semana
  app.get('/summary', async (_request, _reply) => {
    try {
      const { summary } = await getWeekSummary(); // Chamando a função correta
      return { summary };
    } catch (error) {
      app.log.error('Erro ao obter o resumo da semana:', error);
      return { error: 'Erro ao obter o resumo da semana' };
    }
  });
};
