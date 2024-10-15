import { useForm } from 'react-hook-form'; 
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../../../http/user-routes/update-user.route';

// Schema de validação
const emailSchema = z.object({
    email: z.string().email('Email inválido'),
});

// Tipagem do formulário
type EmailFormData = z.infer<typeof emailSchema>;

// Função para atualizar o email
export const UpdateEmail = () => {
    const { register, handleSubmit, formState: { errors, isSubmitSuccessful } } = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
    });

    const queryClient = useQueryClient();

    const onSubmit = async (data: EmailFormData) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('ID do usuário não encontrado no localStorage');
            return; 
        }

        // Log para verificar os dados que serão enviados
        console.log('Preparando para enviar os dados:', {
            id: userId,
            email: data.email,
        });

        try {
            const response = await updateUser({
                id: userId,
                email: data.email,
            });

            // Log para verificar a resposta do servidor
            console.log('Resposta do servidor após atualização:', response);

            // Log para verificar o email atualizado
            console.log('Esse é o email atualizado:', response.email);

            // Invalida queries 
            queryClient.invalidateQueries({ queryKey: ['summary'] });
            queryClient.invalidateQueries({ queryKey: ['pending-goals'] });
        } catch (error) {
            // Log detalhado do erro
            console.error('Erro ao atualizar o email:', error);
            if (error instanceof Error) {
                console.error('Mensagem de erro:', error.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Atualizar Email</h3>

            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email:</label>
                <input 
                    type="email" 
                    {...register("email")} 
                    className={`border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#16BF78] transition duration-300 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} 
                    placeholder="Digite seu novo email" 
                />
                {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                {isSubmitSuccessful && <span className="text-green-500 text-sm mt-1">Email atualizado com sucesso!</span>}
            </div>
            
            <button 
                type="submit" 
                className="w-full bg-[#16BF78] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#14a366] transition duration-300 text-center"
            >
                Atualizar Email
            </button>
        </form>
    );
};
