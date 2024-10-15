import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUser } from '../../../http/user-routes/update-user.route';
import { useQueryClient } from '@tanstack/react-query';

// Schema de validação
const passwordSchema = z.object({
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

// Tipagem do formulário
type PasswordFormData = z.infer<typeof passwordSchema>;

// Função de atualização de senha
export const UpdatePassword = () => {
    // Função do react-hook-form
    const { register, handleSubmit, formState: { errors, isSubmitSuccessful } } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    // UseQuery para atualizar a senha
    const queryClient = useQueryClient();

    // Função para atualizar a senha
    const onSubmit = async (data: PasswordFormData) => {
        const userId = localStorage.getItem('userId');
        if(!userId){
            console.error('ID do usuário não encontrado no localStorage!');
            return;
        }

        try{
            const response = await updateUser({
                id: userId,
                password: data.password
            });

            // Invalida queries
            queryClient.invalidateQueries({ queryKey: ['summary'] });
            queryClient.invalidateQueries({ queryKey: ['pending-goals'] });
            console.log('Resposta do servidor:', response);
        } catch (error) {
            console.error('Erro ao atualizar a senha:', error);
        }
    };
    

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Atualizar Senha</h3>

            <div className="mb-4">
                <label htmlFor='password' className="block text-gray-700 font-medium mb-2">Nova Senha:</label>
                <input 
                    type="password" 
                    {...register("password")} 
                    className={`border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#16BF78] transition duration-300 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} 
                    placeholder="Digite sua nova senha" 
                />
                {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
            </div>

            <div className="mb-4">
                <label htmlFor='confirmPassword' className="block text-gray-700 font-medium mb-2">Confirme a Senha:</label>
                <input 
                    type="password" 
                    {...register("confirmPassword")} 
                    className={`border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#16BF78] transition duration-300 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} 
                    placeholder="Confirme sua senha" 
                />
                {errors.confirmPassword && <span className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</span>}
            </div>

            {isSubmitSuccessful && <span className="text-green-500 text-sm mt-2">Senha atualizada com sucesso!</span>}

            <button 
                type="submit" 
                className="w-full bg-[#16BF78] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#14a366] transition duration-300"
            >
                Atualizar Senha
            </button>
        </form>
    );
};
