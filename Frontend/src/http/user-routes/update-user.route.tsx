// Interface para atualizar os dados do usuário
interface UpdateUserFormData {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string; 
    password?: string; 
}



// Função para atualizar os dados do usuário
export async function updateUser({ id, firstName, lastName, email, password }: UpdateUserFormData) {
    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (password) updateData.password = password; 
    if (Object.keys(updateData).length === 0) {
        throw new Error('Nenhum dado foi informado para atualizar');
    }

    const response = await fetch(`http://localhost:3333/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
    });

    if (!response.ok) {
        throw new Error('Erro ao atualizar os dados do usuário');
    }

    const data = await response.json();
    console.log('Dados atualizados:', data);
    return data;
}

