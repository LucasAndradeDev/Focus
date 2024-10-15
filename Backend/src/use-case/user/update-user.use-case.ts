import { db } from "../../db";
import { users } from "../../db/schema/schema";
import { and, eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Interface da função de atualização de usuário
export type UpdateUserProps = {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
};

// Função de atualização de usuário
export async function UpdateUser({ id, firstName, lastName, email, password }: UpdateUserProps) {
    // Verifica se alguma informação foi passada
    if (!firstName && !lastName && !email && !password) {
        throw new Error('Não foi passado nenhuma informação para atualizar o usuário');
    }

    // Verifica se o JWT_SECRET foi definido nas variáveis de ambiente
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET não definido nas variáveis de ambiente');
    }

    // Prepara um objeto para atualizar apenas os campos que foram fornecidos
    const updateData: Partial<UpdateUserProps> = {};

    // Atualiza apenas os campos fornecidos
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (password) {
        updateData.password = await bcrypt.hash(password, 10);
    }

    // Atualiza o usuário no banco de dados
    const result = await db
        .update(users)
        .set(updateData)
        .where(and(eq(users.id, id), eq(users.isActive, true)))
        .returning();

    // Retorna o usuário atualizado
    return result[0];
}
