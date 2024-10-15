import logo from '../../assets/Focus.png';
import { Link } from 'react-router-dom'; 


export function HomeLoggedOut() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen py-8 bg-gradient-to-b bg-[#f3f3f3] text-zinc-950 dark:bg-[#0D1F22] dark:text-zinc-100">
        <div className="flex flex-col items-center justify-between gap-8">
            <div>
                <img
                    src={logo}
                    alt="Logo"
                    className="w-80 h-auto mb-10 animate-fade-in"
                    style={{ animationDuration: '1s' }}
                />
            </div>
            <div>
                <h1 className="text-5xl font-extrabold text-center mb-6 text-[#105841] tracking-tight uppercase">
                    Seja muito bem-vindo
                </h1>
                <p className="text-lg text-center mb-12 text-gray-600 max-w-lg">
                    O <span className="font-semibold text-[#105841]">Focus</span> é um gerenciador de metas que ajuda você a alcançar seus objetivos com organização e simplicidade.
                </p>
            </div>
        </div>

        {/* Account prompt section */}
        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-10 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Você já possui uma conta?
            </h2>
            <div className="flex justify-center gap-6">
                <Link 
                    to="/signup"
                    className="text-white bg-[#47b774] hover:bg-[#105841] py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    Crie uma
                </Link>
                <Link 
                    to="/login"
                    className="text-white bg-[#47b774] hover:bg-[#105841] py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    Faça login
                </Link>
            </div>
        </div>


    </main>
    );
}