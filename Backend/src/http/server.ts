
import fastify from 'fastify';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';

// Rotas para as metas
import { createGoalRoute } from './routes/create-goal.route';
import { createCompletionRoute } from './routes/create-completion.route';
import { getPedingGoalsRoute } from './routes/get-week-pending-goals.route';
import { getWeekSummaryRoute } from './routes/get-week-sumary.route';
// Rotas para o usuário
import { createUserRoute } from './routes/user/create-user.route';
import { loginUserRoute } from './routes/user/login-user.route';
import { getUserRoute } from '../http/routes/user/get-user.route';
import { updateUserRoute } from '../http/routes/user/update-user.route';

// Cors
import fastifyCors from '@fastify/cors';


const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: "*",
})

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

// Rota para registrar novo usuário
app.register(createUserRoute)

// Rota para login de usuário
app.register(loginUserRoute)

// Rota para buscar detalhes de um usuário
app.register(getUserRoute)

// Rota para atualização de usuário
app.register(updateUserRoute)




app.listen({ port: 3333 })
  .then(() => {
    console.log('HTTP Server Running!');
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
