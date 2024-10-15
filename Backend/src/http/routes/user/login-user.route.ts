import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { LoginUser } from '../../../use-case/user/login-user.use-case'

export const loginUserRoute: FastifyPluginAsyncZod = async app => {
  // Rota para login de usuário
  app.post(
    '/users/login',
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body
        const { user, token } = await LoginUser({
          email,
          password,
        })

        // Retorna o usuário e o token se o login for bem-sucedido
        return { user, token }
      } catch (error) {
        // Verifica se o erro é uma instância de Error
        if (error instanceof Error) {
          reply.status(400).send({ error: error.message })
        } else {
          // Caso o erro não seja do tipo Error, envia uma mensagem genérica
          reply.status(400).send({ error: 'Erro desconhecido' })
        }
      }
    }
  )
}
