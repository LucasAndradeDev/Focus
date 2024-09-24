import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { createGoalCompletion } from '../../use-case/create-goal-completion.use-case';


export const createCompletionRoute: FastifyPluginAsyncZod = async (app) => {

// Rota para completar metas
app.post('/completions', {
    schema: {
      body: z.object({
        goalId: z.string(),
      }),
    },
  }, async (request) => {
    const { goalId } = request.body;
  
    const result = await createGoalCompletion({ goalId });
    return { result };
  });
};