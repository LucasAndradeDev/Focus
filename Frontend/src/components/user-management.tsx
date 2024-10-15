import { useEffect, useState } from 'react';
import { Button } from './ui/buttonGoal'; // Importando o componente Button
import { FaEdit, FaSignOutAlt } from 'react-icons/fa'; // Importando ícones
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import { getUser } from '../http/user-routes/get-user.route'; // Importando a função getUser



interface User {
    id: string;
    firstName: string; 
    lastName: string; 
}

export const UserManagement: React.FC = () => {
    const navigate = useNavigate(); // Inicializando useNavigate
    const [user, setUser] = useState<User | null>(null);

    // Função para obter os dados do usuário
    useEffect(() => {
        // Função assíncrona para obter os dados do usuário
        const fetchUser = async () => {
            const userId = localStorage.getItem('userId'); 
            if (userId) {
                try {
                    const fetchedUser = await getUser({ id: userId });
                    setUser(fetchedUser.user); // Armazenando o usuário obtido
                } catch (error) {
                    console.error("Erro ao buscar usuário:", error);
                }
            } else {
                setUser(null); // Se o ID do usuário não estiver armazenado, define o usuário como nulo
            }
        };

        fetchUser(); // Chama a função para buscar o usuário
    }, []); // Dependência vazia, executa apenas na montagem do componente


    // Função para deslogar o usuário
    const handleLogout = () => {
        console.log("Usuário deslogado");
        localStorage.removeItem('token'); // Limpar o token do localStorage
        localStorage.removeItem('userId'); // Limpa o ID do usuário do localStorage
        localStorage.removeItem('userEmail'); // Limpa o email do usuário do localStorage
        localStorage.removeItem('userName'); // Limpa o nome do usuário do localStorage
        navigate('/'); // Redirecionar para a página de login
    };

    const handleEditUser = () => {
        console.log("Redirecionando para a tela de edição");
        // Lógica de redirecionamento para a tela de edição
        navigate('/update-user');
    };

    

    return (
        <div className="bg-{#f8f8f8} rounded-lg shadow-lg p-6 flex items-center justify-between sm:gap-12 hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div className="flex items-center gap-4">
                {user ? (
                    <h1 className="text-xl font-semibold text-gray-800">
                        {user.firstName} {user.lastName}
                    </h1>
                ) : (
                    <p className="text-xl font-semibold text-gray-800">Carregando...</p> // Mensagem de carregamento
                )}
            </div>
            <div className="flex gap-4 items-center"> 
                <Button onClick={handleEditUser} variant="primary" aria-label="Editar usuário" >
                    <FaEdit className="mr-2" /> <p>Editar usuário</p>
                </Button>
                <Button onClick={handleLogout} variant="primary" aria-label="Sair">
                    <FaSignOutAlt className="mr-2" /> <p>Sair</p>
                </Button>
            </div>
        </div>
    );
};
