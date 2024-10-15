// src/App.js
import { BrowserRouter as Router } from 'react-router-dom';
import { Dialog } from './components/ui/dialog';
import AppRoutes from './http/Router/Router'; // Importação das rotas

export function App() {
  return (
    <Router>
      <Dialog>
        <AppRoutes /> {/* Aqui as rotas serão renderizadas */}
      </Dialog>
    </Router>
  );
}
