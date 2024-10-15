import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUser } from '../../../http/user-routes/update-user.route';
import { useQueryClient } from '@tanstack/react-query';

// Schema de validação
const personalInfoSchema = z.object({
    firstName: z.string().min(1, 'O nome é obrigatório'),
    lastName: z.string().min(1, 'O sobrenome é obrigatório'),
});

// Tipo inferido do schema
type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

// Função para atualizar informações pessoais
export const UpdatePersonalInfo = () => {
    // Função do react-hook-form
    const { register, handleSubmit, formState: { errors, isSubmitSuccessful } } = useForm<PersonalInfoFormData>({
        resolver: zodResolver(personalInfoSchema),
    });

    // UseQuery para atualizar informações pessoais
    const queryClient = useQueryClient();

    const onSubmit = async (data: PersonalInfoFormData) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('ID do usuário não encontrado no localStorage');
            return; // Sai da função se o ID não estiver disponível
        }
        try {
            const response = await updateUser({
                id: userId,
                firstName: data.firstName,
                lastName: data.lastName,
            });
            // Invalida queries
            queryClient.invalidateQueries({ queryKey: ['summary'] });
            queryClient.invalidateQueries({ queryKey: ['pending-goals'] });
            console.log('Resposta do servidor:', response);
        } catch (error) {
            console.error('Erro ao atualizar informações pessoais:', error);
        }
    };
    

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Atualizar Informações Pessoais</h3>

            <div className="mb-4">
                <label htmlFor='firstName' className="block text-gray-700 font-medium mb-2">Nome:</label>
                <input
                    type="text"
                    {...register("firstName")}
                    className={`border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#16BF78] transition duration-300 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Digite seu nome"
                />
                {errors.firstName && <span className="text-red-500 text-sm mt-1">{errors.firstName.message}</span>}
            </div>

            <div className="mb-4">
                <label htmlFor='lastName' className="block text-gray-700 font-medium mb-2">Sobrenome:</label>
                <input
                    type="text"
                    {...register("lastName")}
                    className={`border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#16BF78] transition duration-300 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Digite seu sobrenome"
                />
                {errors.lastName && <span className="text-red-500 text-sm mt-1">{errors.lastName.message}</span>}
            </div>

            {isSubmitSuccessful && <span className="text-green-500 text-sm mt-2">Informações atualizadas com sucesso!</span>}

            <button
                type="submit"
                className="w-full bg-[#16BF78] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#14a366] transition duration-300"
            >
                Atualizar Informações
            </button>
        </form>
    );
};
