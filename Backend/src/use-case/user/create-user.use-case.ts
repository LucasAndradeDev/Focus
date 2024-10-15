import { db } from "../../db";
import { users } from "../../db/schema/schema";
import bcrypt from 'bcrypt';

// Interface da função de criação de usuário
export interface CreateUserProps {
    firstName: string;
    lastName: string;
    email: string;
    password: string; // Mantenha o campo como password, para fazer o hash
}

// Função de criação de usuário
export async function createUser({ firstName, lastName, email, password }: CreateUserProps) {
    // Hash a senha antes de armazená-la
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db
     .insert(users)
     .values({ firstName, lastName, email, password: passwordHash }) // <- você deve usar `passwordHash` aqui, não `password`
     .returning();

    
    const user = result[0];
    
    return {
        user, // Retorna o usuário criado
    };
}
