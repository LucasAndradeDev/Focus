import { createGoal } from '../use-case/create-goal'
import fastify from 'fastify'
import z from 'zod'
import type { serializerCompiler, validatorCompiler , ZodTypeProvider  } from "fastify-type-provider-zod";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.post('/goals', {
  schema: {
    body: z.object({
      title: z.string(),
      desiredWeeklyFrequency: z.number().int().min(1).max(7)
    })
  }
},async (request) => {
  const { title , desiredWeeklyFrequency} = request.body

  await createGoal({ title , desiredWeeklyFrequency})
})
  



app.listen({ 
    port: 3333 })
.then(() => {
  console.log('HTTP Server Running!')
})

