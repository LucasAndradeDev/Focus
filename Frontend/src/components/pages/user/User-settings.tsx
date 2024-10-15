// Importando o hook useState do React para gerenciar o estado local
import { useState } from 'react';

// Importando os componentes que permitem atualizar dados do usuário
import { UpdatePersonalInfo } from '../../ui/user/update-personal-info';
import { UpdateEmail } from '../../ui/user/update-email';
import { UpdatePassword } from '../../ui/user/update-passoword';

// Importando os ícones do Font Awesome para uso nos botões
import '@fortawesome/fontawesome-free/css/all.min.css';

export const UserSettings = () => {
    // Definindo o estado inicial como 'personalInfo', que será a opção padrão exibida
    const [selectedOption, setSelectedOption] = useState<string>('personalInfo');

    // Essa função verifica se a opção passada é a atualmente selecionada,
    // retornando true se for e false caso contrário. Usada para estilizar os botões.
    const isSelected = (option: string) => selectedOption === option;

    return (
        <div className="max-w-4xl mx-auto p-10 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-xl mt-24">
            {/* Header da seção de configurações */}
            <div className="mb-10 flex flex-col gap-8">
                <span className="flex justify-start">
                    <p className="text-center">
                        {/* Link para a página inicial */}
                        <a href="/" className="flex items-center justify-center text-gray-700 hover:text-[#16BF78] transition-colors duration-300">
                            <i className="fas fa-home mr-2">
                            
                            </i>
                            Home
                        </a>
                    </p>
                </span>
                <h2 className="text-5xl font-extrabold text-center mb-10 tracking-tight" style={{ color: '#105841' }}>
                    Configurações da Conta
                </h2>
            </div>

            {/* Área dos botões para selecionar as opções de configuração */}
            <div className="flex flex-wrap justify-center gap-6 mb-12 m-10">
                {['personalInfo', 'email', 'password'].map((option) => (
                    <button
                        type='button'
                        key={option}
                        className={`relative flex items-center justify-center px-4 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${isSelected(option)
                            ? 'bg-[#16BF78] text-white shadow-lg' // Estilo para botão selecionado
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300' // Estilo para botão não selecionado
                            }`}
                        onClick={() => setSelectedOption(option)} // Atualiza a opção selecionada ao clicar
                    >
                        {/* Ícone correspondente à opção */}
                        <i className={`fas ${option === 'personalInfo' ? 'fa-user-circle' : option === 'email' ? 'fa-envelope' : 'fa-lock'} mr-2 transform transition-transform duration-300 ${isSelected(option) ? 'scale-110' : 'scale-100'}`}>
                        </i>
                        <span>{option === 'personalInfo' ? 'Atualizar Informações Pessoais' : option === 'email' ? 'Atualizar Email' : 'Atualizar Senha'}</span>
                        {/* Indicador visual para o botão selecionado */}
                        {isSelected(option) && (
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-1 rounded-full">

                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Área onde o componente correspondente à opção selecionada será exibido */}
            <div className="relative bg-white p-8 rounded-lg shadow-lg transition-all duration-500">
                {/* Renderiza o componente correto com base na opção selecionada */}
                {selectedOption === 'personalInfo' && (
                    <div className="animate-fade-in">
                        <UpdatePersonalInfo />
                    </div>
                )}
                {selectedOption === 'email' && (
                    <div className="animate-fade-in">
                        <UpdateEmail />
                    </div>
                )}
                {selectedOption === 'password' && (
                    <div className="animate-fade-in">
                        <UpdatePassword />
                    </div>
                )}
            </div>
        </div>
    );
};
