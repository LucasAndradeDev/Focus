import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { createGoalCompletion } from '../../use-case/create-goal-completion.use-case';

export const createCompletionRoute: FastifyPluginAsyncZod = async (app) => {
  // Rota para completar metas
  app.post('/completions/:userId', {
    schema: {
      // Id do usuário que completou a meta vem na url
      params: z.object({
        userId: z.string(),
      }),
      // Id da meta que o usuário completou vem no corpo da requisição
      body: z.object({
        goalId: z.string(),
      }),
    },
  }, async (request, reply) => {
    // Desestruturando os parâmetros e o corpo da requisição
    const { goalId } = request.body;
    const { userId } = request.params;

    try {
      // Executando a função para completar a meta
      const result = await createGoalCompletion({ goalId, userId });
      
      // Retornando resultado com status 201 (Created) se a meta foi completada com sucesso
      return reply.status(201).send({ result });
    } catch (error) {
      // Lidar com erros, pode ser uma exceção de negócio ou um erro de sistema
      console.error('Erro ao completar meta:', error);
      return reply.status(500).send({ error: 'Erro ao completar a meta' });
    }
  });
};
