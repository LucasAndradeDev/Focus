// Importação dos componentes
import { Button } from '../../ui/buttonLogin'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '../../ui/cardLogin'
import { Input } from '../../ui/inputLogin'
import { Label } from '../../ui/labelLogin'

// Importação das bibliotecas
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

// Importação da rota de cadastro
import { createUser } from '../../../http/user-routes/create-user.route'

// Importação da rota de login
import { loginUser } from '../../../http/user-routes/login-user.route'

// Regex para validar emails (padrão comum)
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Regex para validar senhas
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/

const createUserForm = z
  .object({
    firstName: z
      .string()
      .min(3, 'Por favor, insira o primeiro nome com pelo menos 3 caracteres'),
    lastName: z
      .string()
      .min(3, 'Por favor, insira o sobrenome com pelo menos 3 caracteres'),
    email: z
      .string()
      .regex(emailRegex, 'Por favor, insira um email válido')
      .refine(
        email => email.length <= 100,
        'O email não pode ter mais de 100 caracteres'
      ), // Limite de caracteres no email
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .regex(
        passwordRegex,
        'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial'
      ),
    confirmPassword: z
      .string()
      .min(8, 'Por favor, confirme sua senha com pelo menos 8 caracteres'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'], // Define onde o erro deve ser exibido
  })

export function Signup() {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
    trigger, 
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserForm),
  })

  type CreateUserFormData = z.infer<typeof createUserForm>

  // Função que será executada pela função do hook form "" ao clicar no botão de Criar Conta
  async function handleCreateUser(data: CreateUserFormData) {
    try {
      await createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
  
      // Invalida queries
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['pending-goals'] });
  
      alert('Conta criada com sucesso!');
  
      // Chama a função de login
      await handleLogin(data.email, data.password);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      alert('Erro ao criar conta. Tente novamente.');
    }
  }
  
  // Função de login automatico ao cadastrar uma conta
  async function handleLogin(email: string, password: string) {
    try {
      const { user, token } = await loginUser({
        email,
        password,
      });
  
      // Armazena o token no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id ? user.id.toString() : ''); // Armazena o ID do usuário, verificando se existe
      localStorage.setItem('userEmail', user.email || ''); // Armazena o email do usuário, verificando se existe
      localStorage.setItem('userName', user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : ''); // Armazena o nome completo do usuário, verificando se ambos os nomes existem
  
      console.log('Token armazenado no localStorage:', localStorage.getItem('token'));
  
      // Redireciona para a página inicial
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login. Tente novamente.');
    }
  }
  

      // Função para avançar para o proximo passo


      const [step, setStep] = useState(1) // Controla qual seção do formulário está visível

      const nextStep = async () => {
        const currentValues = getValues(); // Obtém os valores atuais do formulário
        const currentStep = step;

        // Valida o passo atual
        if (currentStep === 1) {
          const isValid = await trigger(['firstName', 'lastName']); // Valida os campos do primeiro passo
          if (!isValid) {

            return;
          }
        }

        if (currentStep === 2) {
          const isValid = await trigger('email'); // Valida o campo de email
          if (!isValid) {

            return;
          }
        }

        setStep(prevStep => Math.min(prevStep + 1, 3)); // Limite para o número de etapas
      };



      // Função para voltar para o passo anterior
      const prevStep = () => {
        setStep(prevStep => Math.max(prevStep - 1, 1)) // Limite para o número de etapas
      }

      return (
        <main className="flex flex-col items-center justify-center min-h-screen py-8 bg-gradient-to-b bg-[#f3f3f3] text-zinc-950 dark:bg-[#0D1F22] dark:text-zinc-100">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <h1 className="text-4xl font-bold mb-6 text-center text-[#105841]">
              Criar Conta
            </h1>
            <Card className="w-full">
              <CardHeader>
                <CardDescription className="text-[#0e4b39] mb-4">
                  Crie sua conta para começar a usar o aplicativo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="flex flex-col gap-6"
                  onSubmit={handleSubmit(handleCreateUser)}
                >
                  {/* Etapa 1: Nome e Sobrenome */}
                  {step === 1 && (
                    <>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="firstname" className="text-[#105841]">
                          Nome
                        </Label>
                        <Input
                          id="firstname"
                          placeholder="Digite seu nome"
                          className="border border-[#105841] focus:ring-[#0e4b39] focus:border-[#0e4b39] transition duration-200"
                          required
                          {...register('firstName')}
                        />
                        {errors.firstName && (
                          <span className="text-red-600">
                            {errors.firstName.message}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="lastname" className="text-[#105841]">
                          Sobrenome
                        </Label>
                        <Input
                          id="lastname"
                          placeholder="Digite seu sobrenome"
                          className="border border-[#105841] focus:ring-[#0e4b39] focus:border-[#0e4b39] transition duration-200"
                          required
                          {...register('lastName')}
                        />
                        {errors.lastName && (
                          <span className="text-red-600">
                            {errors.lastName.message}
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {/* Etapa 2: Email */}
                  {step === 2 && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email" className="text-[#105841]">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seuemail@exemplo.com"
                        className="border border-[#105841] focus:ring-[#0e4b39] focus:border-[#0e4b39] transition duration-200"
                        required
                        {...register('email')}
                      />
                      {errors.email && (
                        <span className="text-red-600">{errors.email.message}</span>
                      )}
                    </div>
                  )}

                  {/* Etapa 3: Senhas */}
                  {step === 3 && (
                    <>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="password" className="text-[#105841]">
                          Senha
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Digite sua senha"
                          className="border border-[#105841] focus:ring-[#0e4b39] focus:border-[#0e4b39] transition duration-200"
                          required
                          {...register('password')}
                        />
                        {errors.password && (
                          <span className="text-red-600">
                            {errors.password.message}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label
                          htmlFor="confirm-password"
                          className="text-[#105841]"
                        >
                          Confirmar Senha
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirme sua senha"
                          className="border border-[#105841] focus:ring-[#0e4b39] focus:border-[#0e4b39] transition duration-200"
                          required
                          {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && (
                          <span className="text-red-600">
                            {errors.confirmPassword.message}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="link"
                  className="border border-[#105841] text-[#105841] hover:bg-[#105841] hover:text-white transition duration-200"
                  onClick={prevStep}
                  disabled={step === 1} // Desabilita o botão se estiver no primeiro passo
                >
                  Voltar
                </Button>
                <Button
                  variant="link"
                  className="bg-[#105841] text-white hover:bg-[#0e4b39] transition duration-200"
                  onClick={step === 3 ? handleSubmit(handleCreateUser) : nextStep}
                >
                  {step === 3 ? 'Criar Conta' : 'Próximo'}
                </Button>
              </CardFooter>
            </Card>
            <p className="text-center text-gray-600 mt-4">
              Já tem uma conta?{' '}
              <a href="/login" className="text-[#105841] hover:underline">
                Faça o login
              </a>
            </p>
          </div>
        </main>
      )
    }
