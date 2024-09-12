
import fastify from 'fastify';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import { createGoalRoute } from './routes/create-goal.route';
import { createCompletionRoute } from './routes/create-completion.route';
import { getPedingGoalsRoute } from './routes/get-pending-goals.route';
import { getWeekSummaryRoute } from './routes/get-week-sumary.route';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Rota para registrar nova meta
app.register(createGoalRoute)

//Rota para completar metas da semana
app.register(createCompletionRoute)

// Rota para listar metas da semana
app.register(getPedingGoalsRoute)

//Rota para listar as semanas
app.register(getWeekSummaryRoute)




app.listen({ port: 3333 })
  .then(() => {
    console.log('HTTP Server Running!');
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
