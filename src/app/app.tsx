import Dashboard from './dashboard';
import { AuthProvider } from '../hooks/useAuth';

export function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}

export default App;
