interface loginUserFormData {
    email: string;
    password: string;
}

export async function loginUser({ email, password }: loginUserFormData) {
    const response = await fetch('http://localhost:3333/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
        // Lança um erro se o status não for 200
        throw new Error('Credenciais inválidas');
    }

    const data = await response.json(); // Armazena a resposta JSON
    console.log('Resposta do login:', data); // Log da resposta
    return data; // Retorna a resposta JSON
}

