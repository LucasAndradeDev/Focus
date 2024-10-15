interface CreateUserFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}


export async function createUser({ firstName, lastName, email, password }: CreateUserFormData) {
    await fetch('http://localhost:3333/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
    });
    }
