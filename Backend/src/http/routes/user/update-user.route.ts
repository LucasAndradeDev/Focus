import {z} from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { UpdateUser } from '../../../use-case/user/update-user.use-case'

// Rota para atualização de usuário
export const updateUserRoute: FastifyPluginAsyncZod = async app => {
    app.put(
        '/users/:id',
        {
            schema: {
                params: z.object({
                    id: z.string(),
                }),
                body: z.object({
                    firstName: z.string().optional(),
                    lastName: z.string().optional(),
                    email: z.string().email().optional(),
                    password: z.string().optional(),
                }),
            },
        },
        async (request, reply) => {
            const { id } = request.params
            const { firstName, lastName, email, password } = request.body
            const user = await UpdateUser({ id, firstName, lastName, email, password })
            return { user }
        }
    )
}