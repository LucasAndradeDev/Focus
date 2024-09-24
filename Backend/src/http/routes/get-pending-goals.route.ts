import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekPendingGoals } from '../../use-case/get-week-pending-goals.use-case'

export const getPedingGoalsRoute: FastifyPluginAsyncZod = async app => {
  // Rota para listar metas da semana
  app.get('/pending-goals', async () => {
    const { pendingGoals } = await getWeekPendingGoals()
    return { pendingGoals }
  })
}
