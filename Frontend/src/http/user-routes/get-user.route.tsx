// Interface para obter os dados do usuário 
interface GetUserFormData {
    id: string;
}

// Função para obter os dados do usuário
export async function getUser({ id }: GetUserFormData) {
    const response = await fetch(`http://localhost:3333/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Não foi possível obter os dados do usuário');
    }

    const data = await response.json();
    return data;
}
