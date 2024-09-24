import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { createGoal } from '../../use-case/create-goal.use-case';

export const createGoalRoute: FastifyPluginAsyncZod = async (app) => {
 // Rota de criação de meta
app.post('/goals', {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    },
  }, async (request) => {
    const { title, desiredWeeklyFrequency } = request.body;
  
    const createdGoal = await createGoal({ title, desiredWeeklyFrequency });
    return { createdGoal };
  });
};