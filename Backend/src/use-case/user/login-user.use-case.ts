import { db } from '../../db'
import { users } from '../../db/schema/schema'
import bcrypt from 'bcryptjs' // Biblioteca para comparação de senhas
import jwt from 'jsonwebtoken' // Biblioteca para geração de token
import { and, eq } from 'drizzle-orm'

// Interface da função de login de usuário
export interface CreateUserProps {
  email: string
  password: string
}

// Função de login de usuário
export async function LoginUser({ email, password }: CreateUserProps) {
  // Busca o usuário pelo email no banco de dados
  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.isActive, true)))
    .limit(1)

  // Verifica se o usuário existe
  if (user.length === 0) {
    throw new Error('Usuário não encontrado')
  }

  const foundUser = user[0]; // Pegue o primeiro usuário encontrado

  // Compara a senha fornecida com a senha armazenada (criptografada)
  const isPasswordValid = await bcrypt.compare(password, foundUser.password)
  if (!isPasswordValid) {
    throw new Error('Senha incorreta')
  }

  // Gera um token JWT se a senha estiver correta
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido nas variáveis de ambiente')
  }

  const token = jwt.sign(
    { id: foundUser.id, email: foundUser.email },
    process.env.JWT_SECRET, // Agora você terá acesso ao JWT_SECRET
    { expiresIn: '1h' }
  )

  // Retorna o usuário e o token
  return { user: foundUser, token }
}
