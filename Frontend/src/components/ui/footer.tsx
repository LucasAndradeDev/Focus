// Footer.tsx
import type React from 'react'; // Importando React
import { FaLinkedin, FaGithub, FaFileAlt } from 'react-icons/fa'; // Importando ícones

const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
                <nav className="mb-6 md:mb-0">
                    <h2 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">Links Úteis</h2>
                    <ul className="flex flex-col space-y-3">
                        <li>
                            <a 
                                href="https://www.linkedin.com/in/lucas-andrade-6a03331b2/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center text-gray-300 hover:text-gray-200 transition duration-300"
                            >
                                <FaLinkedin className="mr-2 text-xl" /> Linkedin
                            </a>
                        </li>
                        <li>
                            <a 
                                href="https://github.com/LucasAndradeDev/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center text-gray-300 hover:text-gray-200 transition duration-300"
                            >
                                <FaGithub className="mr-2 text-xl" /> Github
                            </a>
                        </li>
                        <li>
                            <a 
                                href="https://aromatic-amusement-f87.notion.site/Curr-culo-9883ea293e9a4fe48217189abf35f58c" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center text-gray-300 hover:text-gray-200 transition duration-300"
                            >
                                <FaFileAlt className="mr-2 text-xl" /> Meu Currículo
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className="text-center md:text-right mt-4 md:mt-0">
                    <p className="text-sm mb-1">© {new Date().getFullYear()} - Todos os direitos reservados.</p>
                    <p className="text-sm">Feito com ❤️ por Lucas Andrade</p>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-6 pt-4 text-center">
                <p className="text-sm text-gray-400">Agradeço pela sua visita!</p>
            </div>
        </footer>
    );
};

export default Footer;
