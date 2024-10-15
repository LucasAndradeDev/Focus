import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { GetUser } from '../../../use-case/user/get-user.use-case'

export const getUserRoute: FastifyPluginAsyncZod = async app => {
    // Rota para busca de usuário
    app.get(
        '/users/:id',
        {
            schema: {
                params: z.object({
                    id: z.string(),
                }),
            },
        },
        async (request, reply) => {
            const { id } = request.params
            const user = await GetUser({ id })
            return { user }
        }
    )
}