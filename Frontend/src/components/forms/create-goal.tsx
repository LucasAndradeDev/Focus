// Importação dos componentes
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/labelGoal';
import { RadioGroup, RadioGroupIndicator } from '../ui/radio-group';
import { RadioGroupItem } from '../ui/radio-group';
import { Button } from '../ui/buttonGoal';
import { Input } from '../ui/inputGoal';

// Importação das bibliotecas
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';

// importação da rota
import { createGoal } from '../../http/create-goal';

// Schema de validação
const CreateGoalForm = z.object({
  title: z.string().min(3, 'Por favor, insira a atividade com pelo menos 3 caracteres'),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7, 'Por favor, insira uma frequência entre 1 e 7 (dias da semana)'),
});

type CreateGoalFormData = z.infer<typeof CreateGoalForm> & {
  userId: string; // Inclua userId aqui
};



export function CreateGoal() {
  const queryClient = useQueryClient();

  const userId = localStorage.getItem('userId') || ''; // Define como string vazia se for null

  const { register, handleSubmit, reset , formState , control } = useForm<CreateGoalFormData>({
    resolver: zodResolver(CreateGoalForm),
    defaultValues: {
      userId, // Definindo o valor padrão do userId
    },
  });


  async function handleCreateGoal(dataForm: CreateGoalFormData) {

    try {
      await createGoal({
        userId: userId,
        title: dataForm.title,
        desiredWeeklyFrequency: dataForm.desiredWeeklyFrequency,
      });


      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['pending-goals'] });

      reset();
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      // Você pode adicionar feedback ao usuário aqui
    }
  }


  return (
    <DialogContent>
      <div className="flex flex-col gap-7 h-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <DialogTitle>Criar nova meta</DialogTitle>
          </div>

          {/* Conteúdo do modal */}
          <DialogDescription>
            Coloque aqui aquelas atividades que fazem você se sentir bem e que
            você adoraria fazer toda semana. É a chance de transformar suas
            paixões em hábitos que vão alegrar seu dia a dia!
          </DialogDescription>
        </div>
        <form
          onSubmit={handleSubmit(handleCreateGoal)}
          className="flex-1 flex flex-col justify-between gap-2"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Qual é a sua meta?</Label>
              <Input
                placeholder="Escrever um livro, aprender inglês..."
                autoFocus
                id="title"
                {...register('title')}
              />

              {formState.errors.title && (
                <span className="text-red-500 text-sm">
                  {formState.errors.title.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-6">
              <Label>Quantas vezes na semana?</Label>
              <div className="flex flex-col gap-6">
                <Controller
                  control={control}
                  name="desiredWeeklyFrequency"
                  defaultValue={3}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={String(field.value)}
                    >
                      <RadioGroupItem
                        value="1"
                        className="flex items-center gap-2"
                      >
                        <RadioGroupIndicator />
                        <span className="text-zinc-500 text-sm font-medium leading-none">
                          1x na semana
                        </span>{' '}
                        <span className="leading-none text-lg">😐</span>
                      </RadioGroupItem>
                      <RadioGroupItem
                        value="2"
                        className="flex items-center gap-2"
                      >
                        <RadioGroupIndicator />
                        <span className="text-zinc-500 text-sm font-medium leading-none">
                          2x na semana
                        </span>{' '}
                        <span className="leading-none text-lg">🙂</span>
                      </RadioGroupItem>
                      <RadioGroupItem
                        value="3"
                        className="flex items-center gap-2"
                      >
                        <RadioGroupIndicator />
                        <span className="text-zinc-500 text-sm font-medium leading-none">
                          3x na semana
                        </span>{' '}
                        <span className="leading-none text-lg">😊</span>
                      </RadioGroupItem>
                      <RadioGroupItem
                        value="4"
                        className="flex items-center gap-2"
                      >
                        <RadioGroupIndicator />
                        <span className="text-zinc-500 text-sm font-medium leading-none">
                          4x na semana
                        </span>{' '}
                        <span className="leading-none text-lg">😁</span>
                      </RadioGroupItem>
                      <RadioGroupItem
                        value="5"
                        className="flex items-center gap-2"
                      >
                        <RadioGroupIndicator />
                        <span className="text-zinc-500 text-sm font-medium leading-none">
                          5x na semana
                        </span>{' '}
                        <span className="leading-none text-lg">😃</span>
                      </RadioGroupItem>
                      <RadioGroupItem
                        value="6"
                        className="flex items-center gap-2"
                      >
                        <RadioGroupIndicator />
                        <span className="text-zinc-500 text-sm font-medium leading-none">
                          6x na semana
                        </span>{' '}
                        <span className="leading-none text-lg">😄</span>
                      </RadioGroupItem>
                      <RadioGroupItem
                        value="7"
                        className="flex items-center gap-2"
                      >
                        <RadioGroupIndicator />
                        <span className="text-zinc-500 text-sm font-medium leading-none">
                          Todos os dias da semana
                        </span>{' '}
                        <span className="leading-none text-lg">🤩</span>
                      </RadioGroupItem>
                    </RadioGroup>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" className="flex-1">
              Criar
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="flex-1">
                Cancelar
              </Button>
            </DialogClose>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}
