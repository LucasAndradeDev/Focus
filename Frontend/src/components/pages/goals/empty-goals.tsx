import { Plus } from 'lucide-react';
import focusedPerson from '../../../assets/focusedperson.gif';
import logo from '../../..//assets/Focus.png';
import { Button } from '../../ui/buttonGoal';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog'; // Certifique-se de que o caminho está correto
import { CreateGoal } from '../../forms/create-goal';

export function EmptyGoals() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-9 p-6 transition-all ease-in-out duration-500 bg-[#f3f3f3] text-zinc-950 dark:bg-[#0D1F22] dark:text-zinc-100">
      {/* Logo com animação de fade-in */}
      <img
        src={logo}
        alt="Logo"
        className="w-100 h-auto animate-fade-in"
        style={{ animationDuration: '1s' }}
      />

      {/* Imagem principal com animação de zoom */}
      <img
        src={focusedPerson}
        alt="Pessoa focada"
        className="max-w-md animate-zoom-in w-full"
        style={{ animationDuration: '1s' }}
      />

      {/* Texto centralizado com animação de deslizamento */}
      <p className="leading-relaxed max-w-lg text-center animate-slide-up">
        Ainda não há tarefas na sua lista. Que tal começar agora e deixar tudo
        mais organizado? É fácil e rápido!
      </p>

      {/* Dialog Trigger */}
      <Dialog>
        <DialogTrigger asChild>
          {/* Botão com ícone de + (Plus) e rotação no hover */}
          <Button>
            <Plus className="w-5 h-5 transition-transform duration-300 transform hover:rotate-45" />
            Criar nova meta
          </Button>
        </DialogTrigger>

        {/* Conteúdo do Dialog */}
        <DialogContent>
          <DialogTitle>Criar Nova Meta</DialogTitle>
          <DialogDescription>
            <CreateGoal />
          </DialogDescription>
          {/* Adicione um botão para fechar o diálogo ou submeter o formulário */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
