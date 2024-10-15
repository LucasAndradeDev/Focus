import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createUser } from '../../../use-case/user/create-user.use-case'

export const createUserRoute: FastifyPluginAsyncZod = async app => {
  // Rota para registrar novo usuário
  app.post(
    '/users/signup',
    {
      schema: {
        body: z.object({
          firstName: z.string(),
          lastName: z.string(),
          email: z.string().email(),
          password: z.string(),
        }),
      },
    },
    async request => {
      const { firstName, lastName, email, password } = request.body
      const user = await createUser({
        firstName,
        lastName,
        email,
        password,
      })
      return { user }
    }
  )
}
