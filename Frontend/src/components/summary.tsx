import { CheckCircle2, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'
import logo from '../assets/Focus-icon.png'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'
import { useQuery } from '@tanstack/react-query'
import { getSummary } from '../http/get-summary'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { PendingGoals } from './pending-goals'

dayjs.locale(ptBR)

export function Summary() {
  // Usando useQuery para buscar o resumo
  const { data: summary, refetch } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
  })

  // Adicionando valores padrão para evitar erros
  const completions = summary?.completions || 0
  const total = summary?.total || 1 // Definindo 1 como fallback para evitar divisão por zero
  const completedPercentage = Math.round((completions / total) * 100)

  const firstDayOfWeek = dayjs().startOf('week').format('DD MMM')
  const lastDayOfWeek = dayjs().endOf('week').format('DD MMM')

  if (!summary) {
    return <div>Carregando...</div> // Exibindo mensagem de carregamento
  }

  // Ordenando as entradas de goalsPerDay por data
  const sortedGoalsPerDay = Object.entries(summary.goalsPerDay || {}).sort(
    ([dateA], [dateB]) => dayjs(dateB).diff(dayjs(dateA))
  )

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-auto h-6" />
          <span className="text-lg font-semibold capitalize">
            {firstDayOfWeek} - {lastDayOfWeek}
          </span>
        </div>

        <DialogTrigger asChild>
          <Button
            onClick={() => {
              refetch() // Refetche a consulta para atualizar o resumo após a criação de uma nova meta
            }}
          >
            <Plus className="w-5 h-5 transition-transform duration-300 transform hover:rotate-45" />
            Criar nova meta
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress value={completedPercentage} max={100} className="relative">
          <ProgressIndicator
            style={{ width: `${completedPercentage}%` }}
            className="absolute top-0 left-0 h-full rounded-full"
          />
        </Progress>
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <div>
            {summary.completions === 0 ? (
              <span>Voce não completou nenhuma meta ainda</span>
            ) :  <span>
            Você completou <strong>{completions}</strong> de{' '}
            <strong>{total}</strong> nessa semana, bom trabalho!
          </span>} 
           
          </div>
          <span>{completedPercentage}%</span>
        </div>
      </div>

      <Separator />

      <PendingGoals />

      <div>
        {summary.completions === 0 ? (
          <div className="flex flex-col gap-6 items-center">
            <h2 className="text-xl font-semibold text-zinc-800">
              Ainda não há metas concluídas!
            </h2>
            <p className="text-sm text-zinc-500">
              Parece que você ainda não completou nenhuma meta nesta semana.
              Vamos começar a traçar seus objetivos!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Sua semana</h2>
            {sortedGoalsPerDay.map(([date, goals]) => {
              const weekDay = dayjs(date).format('dddd')
              const formattedDate = dayjs(date).format('DD [de] MMMM')
              return (
                <div key={date} className="flex flex-col gap-4">
                  <h3 className="font-semibold text-zinc-800">
                    <span className="capitalize">{weekDay} </span>
                    <span className="text-xs text-zinc-500">
                      {formattedDate}
                    </span>
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {goals.map(goal => {
                      const time = dayjs(goal.completedAt).format('HH:mm')
                      return (
                        <li key={goal.id} className="flex items-center gap-2">
                          <CheckCircle2
                            className={`w-4 h-4 ${goal.completedAt ? 'text-green-500' : 'text-zinc-400'}`}
                          />
                          <span className="text-sm text-zinc-400">
                            Você completou <strong>{`"${goal.title}"`}</strong>{' '}
                            às {time}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
