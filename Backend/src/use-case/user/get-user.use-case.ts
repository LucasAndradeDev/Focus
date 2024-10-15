import { db } from '../../db'
import { users } from '../../db/schema/schema'
import { and, eq } from 'drizzle-orm'

// Interface da função de busca de usuário
export type GetUserProps = {
    id: string
}

// Função de busca de usuário
export async function GetUser({ id }: GetUserProps) {
    const user = await db
        .select()
        .from(users)
        .where(and(eq(users.id, id), eq(users.isActive, true)))
        .limit(1)

    if (user.length === 0) {
        throw new Error('Usuário não encontrado')
    }
    

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET não definido nas variáveis de ambiente')
    }

    return user[0]
}

