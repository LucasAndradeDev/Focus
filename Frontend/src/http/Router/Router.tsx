import { Routes, Route } from 'react-router-dom';
import { Home } from '../../components/pages/home';
import { Summary } from '../../components/pages/goals/summary';
import { EmptyGoals } from '../../components/pages/goals/empty-goals';
import { Login } from '../../components/pages/user/login';
import { Signup } from '../../components/pages/user/signup';
import { UserSettings } from '../../components/pages/user/User-settings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/empty-goals" element={<EmptyGoals />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/update-user" element={<UserSettings />} />
    </Routes>
  );
};

export default AppRoutes;
