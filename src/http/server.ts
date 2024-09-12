=import { createGoal } from '../use-case/create-goal';
import { createGoalCompletion } from '../use-case/create-goal-completion'; 
import fastify from 'fastify';
import z from 'zod';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import { getWeekPendingGoals } from '../use-case/get-week-pending-goals';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Rota para listar metas da semana
app.get('/pending-goals', async () => {
  const { pendingGoals } = await getWeekPendingGoals();
  return { pendingGoals };
});

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

// Rota para completar metas
app.post('/completions', {
  schema: {
    body: z.object({
      goalId: z.string(),
    }),
  },
}, async (request) => {
  const { goalId } = request.body;

  const goalCompletion = await createGoalCompletion({ goalId });
  return { goalCompletion };
});

app.listen({ port: 3333 })
  .then(() => {
    console.log('HTTP Server Running!');
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
