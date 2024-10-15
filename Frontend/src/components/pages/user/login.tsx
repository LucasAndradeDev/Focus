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
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

// Importação da rota
import { loginUser } from '../../../http/user-routes/login-user.route'

// Schema de validação
const loginUserForm = z.object({
  email: z
    .string()
    .min(1, 'O email é obrigatório') // Verifica se o campo não está vazio
    .email('Por favor, insira um email válido'), // Verifica se o email é válido
  password: z
    .string()
    .min(1, 'A senha é obrigatória') // Verifica se o campo não está vazio
    .min(6, 'A senha precisa ter no mínimo 6 caracteres'), // Verifica se a senha tem pelo menos 6 caracteres
})

// Tipo inferido do schema
type loginUserFormData = z.infer<typeof loginUserForm>

export function Login() {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<loginUserFormData>({
    resolver: zodResolver(loginUserForm),
  })

  // Função que será executada pela função do hook form "" ao clicar no botão de Entrar
  async function handleLogin(data: loginUserFormData) {
    try {
      const { user, token } = await loginUser({
        email: data.email,
        password: data.password,
      })

      // Armazena o token no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id ? user.id.toString() : ''); // Armazena o ID do usuário, verificando se existe
      localStorage.setItem('userEmail', user.email ? user.email : ''); // Armazena o email do usuário, verificando se existe
      localStorage.setItem('userName', user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : ''); // Armazena o nome completo do usuário, verificando se ambos os nomes existem


      console.log('Token armazenado no localStorage:', localStorage.getItem('token'));


      // Invalida queries
      queryClient.invalidateQueries({ queryKey: ['summary'] })
      queryClient.invalidateQueries({ queryKey: ['pending-goals'] })

      alert('Login efetuado com sucesso!')

      // Redireciona para a página inicial
      window.location.href = '/'
      reset()
    } catch (error) {
      console.error(error)
      alert('Falha no login. Verifique suas credenciais.')
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-8 bg-gradient-to-b bg-[#f3f3f3] text-zinc-950 dark:bg-[#0D1F22] dark:text-zinc-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold mb-6 text-center text-[#105841]">
          Login
        </h1>
        <Card className="w-full">
          <CardHeader>
            <CardDescription className="text-[#0e4b39] mb-4">
              Faça o login para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-6"
              onSubmit={handleSubmit(handleLogin)}
            >
              {/* Email */}
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
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Senha */}
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
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Esqueceu a senha */}
              <div className="flex justify-end">
                <a
                  href="/forgot-password"
                  className="text-[#105841] hover:underline text-sm"
                >
                  Esqueceu a senha?
                </a>
              </div>

              {/* Botões */}
              <CardFooter className="flex justify-between mt-4">
                <Button
                  variant="link"
                  className="border border-[#105841] text-[#105841] hover:bg-[#105841] hover:text-white transition duration-200"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-[#105841] text-white hover:bg-[#0e4b39] transition duration-200"
                >
                  Entrar
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-gray-600 mt-4">
          Ainda não possui uma conta?{' '}
          <a href="/signup" className="text-[#105841] hover:underline">
            Crie uma
          </a>
        </p>
      </div>
    </main>
  )
}
